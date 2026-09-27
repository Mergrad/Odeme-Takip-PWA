import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Wallet, Sun, Moon } from 'lucide-react';
import { usePaymentStore } from '@/lib/paymentStore';
import { ymKey, ymKeyFromISO, getStatus, daysUntil } from '@/lib/format';
import { getTheme, toggleTheme } from '@/lib/theme';
import { maybeShowReminders } from '@/lib/reminders';
import MonthHeader from '@/components/MonthHeader';
import SummaryCards from '@/components/SummaryCards';
import UpcomingBills from '@/components/UpcomingBills';
import ExpenseList from '@/components/ExpenseList';
import StatsView from '@/components/StatsView';
import SettingsView from '@/components/SettingsView';
import BottomNav from '@/components/BottomNav';
import ExpenseModal from '@/components/ExpenseModal';

const prevMonth = (m) => new Date(m.getFullYear(), m.getMonth() - 1, 1);
const nextMonth = (m) => new Date(m.getFullYear(), m.getMonth() + 1, 1);

export default function Home() {
  const { data, addExpense, updateExpense, deleteExpense, updateSettings, replaceAll, clearAll } = usePaymentStore();

  const [tab, setTab] = useState('home');
  const [month, setMonth] = useState(() => new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [isDark, setIsDark] = useState(() => getTheme() === 'dark');

  useEffect(() => {
    maybeShowReminders(data.expenses);
  }, [data.expenses]);

  const monthKey = ymKey(month);
  const currency = data.settings.currency;

  const monthExpenses = useMemo(
    () => data.expenses.filter((e) => ymKeyFromISO(e.dueDate) === monthKey),
    [data.expenses, monthKey]
  );

  const summary = useMemo(() => {
    const s = { total: 0, paid: 0, pending: 0, late: 0 };
    monthExpenses.forEach((e) => {
      const amt = Number(e.amount) || 0;
      s.total += amt;
      const st = getStatus(e);
      if (st === 'paid') s.paid += amt;
      else if (st === 'late') s.late += amt;
      else s.pending += amt;
    });
    return s;
  }, [monthExpenses]);

  const upcoming = useMemo(() => {
    return data.expenses
      .filter((e) => e.status !== 'paid')
      .map((e) => ({ exp: e, days: daysUntil(e.dueDate) }))
      .filter(({ days }) => days <= 7)
      .sort((a, b) => a.days - b.days)
      .slice(0, 5)
      .map(({ exp }) => exp);
  }, [data.expenses]);

  const openNew = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (exp) => { setEditing(exp); setModalOpen(true); };

  const handleSave = (payload) => {
    if (editing) updateExpense(editing.id, payload);
    else addExpense(payload);
    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = (id) => {
    deleteExpense(id);
    setModalOpen(false);
    setEditing(null);
  };

  const quickPay = (exp) => {
    updateExpense(exp.id, { status: 'paid', paidDate: new Date().toISOString().slice(0, 10) });
  };

  const handleToggleDark = () => setIsDark(toggleTheme() === 'dark');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full max-w-md mx-auto px-4 pt-5 pb-28">
        {/* Brand */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 grid place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Wallet size={18} />
            </span>
            <div>
              <h1 className="font-display text-base font-extrabold tracking-tight leading-none">Ödeme Takip</h1>
              <p className="text-[11px] text-muted-foreground mt-0.5">Aylık gider yönetimi</p>
            </div>
          </div>
          <button
            onClick={handleToggleDark}
            className="w-10 h-10 grid place-items-center rounded-2xl bg-card border border-border text-foreground hover:bg-muted/60 transition"
            aria-label="Tema değiştir"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <MonthHeader
                month={month}
                onPrev={() => setMonth(prevMonth(month))}
                onNext={() => setMonth(nextMonth(month))}
                onToday={() => setMonth(new Date())}
              />
              <SummaryCards summary={summary} currency={currency} />
              <UpcomingBills bills={upcoming} currency={currency} onPay={quickPay} onSelect={openEdit} />
              <ExpenseList expenses={monthExpenses} currency={currency} onSelect={openEdit} onPay={quickPay} />
            </motion.div>
          )}
          {tab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <MonthHeader
                month={month}
                onPrev={() => setMonth(prevMonth(month))}
                onNext={() => setMonth(nextMonth(month))}
                onToday={() => setMonth(new Date())}
              />
              <StatsView
                expenses={data.expenses}
                monthKey={monthKey}
                currency={currency}
                budget={data.settings.monthlyBudget}
              />
            </motion.div>
          )}
          {tab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="font-display text-xl font-extrabold tracking-tight mb-1">Ayarlar</h1>
              <p className="text-xs text-muted-foreground mb-4">Verileriniz cihazınızda metin olarak saklanır.</p>
              <SettingsView
                data={data}
                dark={isDark}
                onToggleDark={handleToggleDark}
                updateSettings={updateSettings}
                replaceAll={replaceAll}
                clearAll={clearAll}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FAB */}
      {tab !== 'settings' && (
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={openNew}
          className="fixed right-5 bottom-[calc(env(safe-area-inset-bottom)+84px)] z-30 w-14 h-14 grid place-items-center rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-black/25"
          aria-label="Yeni ödeme ekle"
        >
          <Plus size={26} />
        </motion.button>
      )}

      <BottomNav active={tab} onChange={setTab} />

      <ExpenseModal
        open={modalOpen}
        editing={editing}
        currency={currency}
        onSave={handleSave}
        onDelete={handleDelete}
        onClose={() => { setModalOpen(false); setEditing(null); }}
      />
    </div>
  );
}