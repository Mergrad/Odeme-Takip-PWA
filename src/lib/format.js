export const MONTHS_TR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

export function ymKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function ymKeyFromISO(iso) {
  if (!iso) return null;
  const [y, m] = iso.split('-').map(Number);
  return `${y}-${String(m).padStart(2, '0')}`;
}

export function formatMonthLabel(date) {
  return `${MONTHS_TR[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatMoney(amount, currency = '₺') {
  const n = Number(amount) || 0;
  const formatted = n.toLocaleString('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${formatted} ${currency}`;
}

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function parseDate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function daysUntil(iso) {
  const t = parseDate(iso);
  if (!t) return Infinity;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  t.setHours(0, 0, 0, 0);
  return Math.round((t - now) / 86400000);
}

export function formatDueDate(iso) {
  const dd = daysUntil(iso);
  if (dd === 0) return 'Bugün';
  if (dd === 1) return 'Yarın';
  if (dd === -1) return 'Dün';
  if (dd < 0) return `${Math.abs(dd)} gün gecikti`;
  if (dd <= 6) return `${dd} gün sonra`;
  const t = parseDate(iso);
  return t.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
}

export function shortDate(iso) {
  const t = parseDate(iso);
  if (!t) return '';
  return t.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

export function getStatus(exp) {
  if (exp.status === 'paid') return 'paid';
  return daysUntil(exp.dueDate) < 0 ? 'late' : 'pending';
}