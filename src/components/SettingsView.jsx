import { useRef, useState } from 'react';
import { Download, Upload, Trash2, Check, Github } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Switch } from '@/components/ui/switch';
import { exportToFile, importFromFile } from '@/lib/paymentStore';
import { remindersEnabled, setRemindersEnabled, requestReminderPermission } from '@/lib/reminders';

export default function SettingsView({ data, dark, onToggleDark, updateSettings, replaceAll, clearAll }) {
  const fileRef = useRef(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [reminders, setReminders] = useState(() => remindersEnabled());
  const [reminderInfo, setReminderInfo] = useState('');
  const [syncing, setSyncing] = useState(false);

  const flash = (m) => { setMsg(m); setErr(''); setTimeout(() => setMsg(''), 2500); };
  const flashErr = (m) => { setErr(m); setMsg(''); };

  const toggleReminders = async (on) => {
    if (!on) {
      setRemindersEnabled(false);
      setReminders(false);
      setReminderInfo('');
      return;
    }
    const perm = await requestReminderPermission();
    if (perm === 'granted') {
      setRemindersEnabled(true);
      setReminders(true);
      setReminderInfo('Bildirimler açık. Vadesi 3 gün içinde olan veya gecikmiş ödemeler için hatırlatma gösterilir.');
    } else if (perm === 'denied') {
      setReminders(false);
      setReminderInfo('Bildirim izni reddedildi. Tarayıcı ayarlarından bu uygulamaya bildirim izni vermeniz gerekir.');
    } else {
      setReminders(false);
      setReminderInfo('Cihazınız veya tarayıcınız bildirimleri desteklemiyor.');
    }
  };

  const handleExport = () => {
    exportToFile(data);
    flash('Yedek dosyası indirildi.');
  };

  const handleImportClick = () => fileRef.current?.click();

  const handleGithubSync = async () => {
    setSyncing(true);
    try {
      await base44.functions.invoke('githubSyncPayments', { data });
      flash('Ödeme verileri GitHub deposuna kaydedildi.');
    } catch (er) {
      flashErr(er?.response?.data?.error || er?.message || 'GitHub senkronizasyonu başarısız.');
    }
    setSyncing(false);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importFromFile(file);
      replaceAll(imported);
      flash('Veriler içe aktarıldı.');
    } catch (er) {
      flashErr(er.message || 'İçe aktarma başarısız.');
    }
    e.target.value = '';
  };

  const handleClear = () => {
    if (confirm('Tüm ödemeler silinecek. Emin misiniz?')) {
      clearAll();
      flash('Tüm veriler silindi.');
    }
  };

  return (
    <div className="mt-2 space-y-5">
      <Section title="Görünüm">
        <Row label="Karanlık mod" hint={dark ? 'Koyu tema aktif' : 'Açık tema aktif'}>
          <Switch checked={dark} onCheckedChange={onToggleDark} />
        </Row>
      </Section>

      <Section title="Hatırlatıcılar">
        <Row label="Ödeme hatırlatmaları" hint="Vadesi yaklaşan ödemeler için bildirim">
          <Switch checked={reminders} onCheckedChange={toggleReminders} />
        </Row>
        {reminderInfo && <p className="text-xs text-muted-foreground leading-relaxed px-1">{reminderInfo}</p>}
      </Section>

      <Section title="Genel">
        <Row label="Para birimi">
          <select
            value={data.settings.currency}
            onChange={(e) => updateSettings({ currency: e.target.value })}
            className="px-3 py-2 rounded-xl bg-muted/50 border border-border outline-none text-sm"
          >
            {['₺', '$', '€', '£'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Row>
        <Row label="Aylık bütçe">
          <input
            type="number"
            inputMode="decimal"
            value={data.settings.monthlyBudget || ''}
            onChange={(e) => updateSettings({ monthlyBudget: parseFloat(e.target.value) || 0 })}
            placeholder="0"
            className="w-32 px-3 py-2 rounded-xl bg-muted/50 border border-border outline-none text-sm text-right tabular-nums"
          />
        </Row>
      </Section>

      <Section title="Yedekleme">
        <p className="text-xs text-muted-foreground mb-1 leading-relaxed">
          Verileriniz bu telefonda metin olarak saklanır. Düzenli olarak bir yedek dosyası indirip güvenli bir yerde saklayın; telefonu değiştirirseniz aynı dosyayı içe aktararak geri yükleyebilirsiniz.
        </p>
        <button
          onClick={handleExport}
          className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border shadow-sm hover:bg-muted/60 transition text-left"
        >
          <span className="w-10 h-10 grid place-items-center rounded-xl bg-accent/15 text-accent"><Download size={18} /></span>
          <span className="flex-1">
            <span className="block text-sm font-semibold text-foreground">Yedek indir</span>
            <span className="block text-xs text-muted-foreground">.txt dosyası olarak kaydet</span>
          </span>
        </button>
        <button
          onClick={handleImportClick}
          className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border shadow-sm hover:bg-muted/60 transition text-left"
        >
          <span className="w-10 h-10 grid place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><Upload size={18} /></span>
          <span className="flex-1">
            <span className="block text-sm font-semibold text-foreground">Yedekten geri yükle</span>
            <span className="block text-xs text-muted-foreground">.txt dosyasını içe aktar</span>
          </span>
        </button>
        <button
          onClick={handleGithubSync}
          disabled={syncing}
          className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border shadow-sm hover:bg-muted/60 transition text-left disabled:opacity-60"
        >
          <span className="w-10 h-10 grid place-items-center rounded-xl bg-foreground/5 text-foreground">
            {syncing ? (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Github size={18} />
            )}
          </span>
          <span className="flex-1">
            <span className="block text-sm font-semibold text-foreground">
              {syncing ? 'GitHub\'a kaydediliyor…' : 'GitHub\'a yedekle'}
            </span>
            <span className="block text-xs text-muted-foreground">Ödeme verilerini Mergrad/Odeme-Takip-PWA deposuna kaydet</span>
          </span>
        </button>
        <input ref={fileRef} type="file" accept=".txt,text/plain,application/json" className="hidden" onChange={handleFile} />
      </Section>

      <Section title="Tehlikeli bölge">
        <button
          onClick={handleClear}
          className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition text-left"
        >
          <span className="w-10 h-10 grid place-items-center rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400"><Trash2 size={18} /></span>
          <span className="flex-1">
            <span className="block text-sm font-semibold text-rose-600 dark:text-rose-400">Tüm verileri sil</span>
            <span className="block text-xs text-rose-500/70 dark:text-rose-400/60">Bu işlem geri alınamaz</span>
          </span>
        </button>
      </Section>

      {msg && (
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
          <Check size={16} /> {msg}
        </div>
      )}
      {err && (
        <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-medium">{err}</div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="font-display text-base font-bold text-foreground tracking-tight mb-3">{title}</h3>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function Row({ label, hint, children }) {
  return (
    <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border border-border shadow-sm">
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {hint && <span className="block text-xs text-muted-foreground mt-0.5">{hint}</span>}
      </span>
      {children}
    </div>
  );
}