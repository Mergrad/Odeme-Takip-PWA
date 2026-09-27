import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';
import ExpenseItem from '@/components/ExpenseItem';

export default function ExpenseList({ expenses, currency, onSelect, onPay }) {
  const [catFilter, setCatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = expenses.filter((e) => {
    if (catFilter !== 'all' && e.category !== catFilter) return false;
    if (statusFilter === 'paid' && e.status !== 'paid') return false;
    if (statusFilter === 'unpaid' && e.status === 'paid') return false;
    return true;
  });

  const selectCls = 'w-full px-3 py-2.5 rounded-2xl bg-card border border-border text-xs font-semibold text-foreground outline-none cursor-pointer';

  return (
    <div className="mt-7">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-display text-base font-bold text-foreground tracking-tight">Tüm Ödemeler</h2>
        <span className="text-xs text-muted-foreground">{filtered.length} kayıt</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectCls}>
          <option value="all">Tüm durumlar</option>
          <option value="unpaid">Bekleyen</option>
          <option value="paid">Ödenen</option>
        </select>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className={selectCls}>
          <option value="all">Tüm kategoriler</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-dashed border-border text-muted-foreground">
          <SlidersHorizontal size={22} className="mx-auto mb-2 text-muted-foreground/50" />
          <p className="text-sm">Bu filtreye uygun kayıt bulunamadı.</p>
        </div>
      ) : (
        <div className="grid gap-2.5">
          <AnimatePresence mode="popLayout">
            {filtered.map((exp) => (
              <ExpenseItem key={exp.id} exp={exp} currency={currency} onSelect={onSelect} onPay={onPay} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}