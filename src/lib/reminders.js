import { daysUntil, formatDueDate, todayISO } from '@/lib/format';

const KEY = 'odeme_takip_reminders';
const STATE_KEY = 'odeme_takip_reminder_state';

export function remindersEnabled() {
  try { return localStorage.getItem(KEY) === 'on'; } catch { return false; }
}

export function setRemindersEnabled(on) {
  try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* ignore */ }
}

export function requestReminderPermission() {
  if (typeof Notification === 'undefined') return Promise.resolve('unsupported');
  if (Notification.permission === 'default') {
    return Notification.requestPermission().catch(() => Notification.permission);
  }
  return Promise.resolve(Notification.permission);
}

// Uygulama açıldığında vadesi 3 gün içinde ya da gecikmiş ödemeler için
// bildirim gösterir. Gün içinde tekrar açılırsa tekrar bildirmez.
export function maybeShowReminders(expenses) {
  if (!remindersEnabled()) return null;
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return null;

  let state = {};
  try { state = JSON.parse(localStorage.getItem(STATE_KEY) || '{}'); } catch { state = {}; }
  const today = todayISO();
  if (state.lastShown === today) return null;

  const due = expenses
    .filter((e) => e.status !== 'paid' && daysUntil(e.dueDate) <= 3)
    .sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate));
  if (!due.length) return null;

  const lateCount = due.filter((e) => daysUntil(e.dueDate) < 0).length;
  const title = lateCount
    ? `${due.length} ödeme hatırlatması · ${lateCount} gecikmiş`
    : `${due.length} yaklaşan ödeme`;
  const body = due.slice(0, 3).map((e) => `${e.name} — ${formatDueDate(e.dueDate)}`).join('\n');

  try { new Notification(title, { body }); } catch { /* ignore */ }
  try { localStorage.setItem(STATE_KEY, JSON.stringify({ lastShown: today })); } catch { /* ignore */ }

  return { title, count: due.length, lateCount };
}