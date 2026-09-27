import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

const OWNER = 'Mergrad';
const REPO = 'Odeme-Takip-PWA';
const BRANCH = 'main';
const FILE_PATH = 'data/payments.json';
const MAX_BYTES = 500 * 1024;
const MAX_EXPENSES = 1000;

function toBase64(bytes) {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const data = body && body.data;
    if (!data || !Array.isArray(data.expenses)) {
      return Response.json({ error: 'Geçersiz veri formatı.' }, { status: 400 });
    }
    if (data.expenses.length > MAX_EXPENSES) {
      return Response.json({ error: 'Kayıt sayısı fazla (en fazla 1000).' }, { status: 400 });
    }

    const json = JSON.stringify({ expenses: data.expenses, settings: data.settings || {} }, null, 2);
    const bytes = new TextEncoder().encode(json);
    if (bytes.length > MAX_BYTES) {
      return Response.json({ error: 'Veri boyutu fazla (en fazla 500 KB).' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('github');
    const authHeaders = {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'odeme-takip-pwa',
    };

    // Mevcut dosyanın sha'sini al (dosya varsa güncelleme için gereklidir)
    const getRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
      { headers: authHeaders }
    );
    let sha = null;
    if (getRes.ok) {
      const existing = await getRes.json();
      sha = existing.sha;
    }

    const syncedAt = new Date().toISOString();
    const putRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`, {
      method: 'PUT',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `chore: ödeme verisi senkronizasyonu ${syncedAt.slice(0, 16).replace('T', ' ')}`,
        content: toBase64(bytes),
        branch: BRANCH,
        ...(sha ? { sha } : {}),
      }),
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      return Response.json(
        { error: `GitHub API hatası: ${putRes.status}`, details: errText.slice(0, 300) },
        { status: 502 }
      );
    }

    const result = await putRes.json();
    return Response.json({
      ok: true,
      commitUrl: result.commit ? result.commit.html_url : null,
      fileUrl: result.content ? result.content.html_url : null,
      expenseCount: data.expenses.length,
      syncedAt,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}