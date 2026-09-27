import { motion } from 'framer-motion';
import { getCategory } from '@/lib/categories';
import { formatMoney, formatDueDate, getStatus } from '@/lib/format';

export default function UpcomingBills({ bills, currency, onPay, onSelect }) {
  if (!bills.length) return null;
  return (
    <div className="mt-7">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-display text-base font-bold text-foreground tracking-tight">Yaklaşan Ödemeler</h2>
        <span className="text-xs text-muted-foreground">{bills.length} bekleyen</span>
      </div>
      <div className="grid gap-2.5">
        {bills.map((exp, i) => {
          const cat = getCategory(exp.category);
          const Icon = cat.icon;
          const status = getStatus(exp);
          const isLate = status === 'late';
          return (
            <motion.button
              key={exp.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => onSelect(exp)}
              className={`flex items-center gap-3 p-3 rounded-2xl bg-card border shadow-sm text-left ${isLate ? 'border-l-4 border-l-rose-500 border-border' : 'border-l-4 border-l-accent border-border'}`}
            >
              <span
                className="w-10 h-10 grid place-items-center rounded-xl shrink-0"
                style={{ backgroundColor: `${cat.color}1A`, color: cat.color }}
              >
                <Icon size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-sm text-foreground truncate">{exp.name}</span>
                <span className={`block text-xs mt-0.5 ${isLate ? 'text-rose-500 font-medium' : 'text-muted-foreground'}`}>
                  {formatDueDate(exp.dueDate)}
                </span>
              </span>
              <span className="text-right shrink-0">
                <span className="block font-display font-bold text-sm tabular-nums text-foreground">
                  {formatMoney(exp.amount, currency)}
                </span>
                <span
                  onClick={(e) => { e.stopPropagation(); onPay(exp); }}
                  className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:opacity-75"
                >
                  Öde
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}