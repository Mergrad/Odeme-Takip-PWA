import { motion } from 'framer-motion';
import { Check, Repeat } from 'lucide-react';
import { getCategory } from '@/lib/categories';
import { formatMoney, formatDueDate, getStatus, shortDate } from '@/lib/format';

const STATUS_BADGE = {
  paid: { label: 'Ödendi', cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  pending: { label: 'Bekleyen', cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  late: { label: 'Gecikmiş', cls: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
};

export default function ExpenseItem({ exp, currency, onSelect, onPay }) {
  const cat = getCategory(exp.category);
  const Icon = cat.icon;
  const status = getStatus(exp);
  const badge = STATUS_BADGE[status];
  const isPaid = status === 'paid';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={`flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border shadow-sm ${isPaid ? 'opacity-60' : ''}`}
    >
      <button onClick={() => onSelect(exp)} className="flex items-center gap-3 min-w-0 flex-1 text-left">
        <span
          className="w-11 h-11 grid place-items-center rounded-2xl shrink-0"
          style={{ backgroundColor: `${cat.color}1A`, color: cat.color }}
        >
          <Icon size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-foreground truncate">{exp.name}</span>
            {exp.recurring && exp.recurring !== 'none' && (
              <Repeat size={12} className="text-muted-foreground shrink-0" />
            )}
          </span>
          <span className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span className="font-medium text-muted-foreground">{cat.label}</span>
            <span>·</span>
            <span>{isPaid && exp.paidDate ? shortDate(exp.paidDate) : formatDueDate(exp.dueDate)}</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${badge.cls}`}>{badge.label}</span>
          </span>
        </span>
      </button>
      <span className="text-right shrink-0">
        <span className="block font-display font-bold text-sm tabular-nums text-foreground">
          {formatMoney(exp.amount, currency)}
        </span>
        {!isPaid && (
          <button
            onClick={() => onPay(exp)}
            className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:opacity-75"
          >
            <Check size={12} /> Öde
          </button>
        )}
      </span>
    </motion.div>
  );
}