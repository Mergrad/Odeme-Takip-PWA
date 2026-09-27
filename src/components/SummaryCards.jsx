import { Check, Clock, AlertTriangle, Wallet } from 'lucide-react';
import { formatMoney } from '@/lib/format';

function StatCard({ label, amount, currency, icon: Icon, tone }) {
  const tones = {
    dark: 'bg-gradient-to-br from-stone-900 to-stone-800 text-white border border-stone-800',
    paid: 'bg-card text-foreground border border-border',
    pending: 'bg-card text-foreground border border-border',
    late: 'bg-card text-foreground border border-border',
  };
  const iconTones = {
    dark: 'bg-[#C9A227]/20 text-[#E8C465]',
    paid: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    late: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  };
  const amountTones = {
    dark: 'text-[#E8C465]',
    paid: 'text-emerald-600 dark:text-emerald-400',
    pending: 'text-amber-600 dark:text-amber-400',
    late: 'text-rose-600 dark:text-rose-400',
  };
  return (
    <div className={`rounded-3xl border p-4 shadow-sm ${tones[tone]}`}>
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-bold uppercase tracking-wider ${tone === 'dark' ? 'text-white/60' : 'text-muted-foreground'}`}>
          {label}
        </span>
        <span className={`w-8 h-8 grid place-items-center rounded-xl ${iconTones[tone]}`}>
          <Icon size={16} />
        </span>
      </div>
      <p className={`mt-3 font-display text-2xl font-extrabold tracking-tight tabular-nums ${amountTones[tone]}`}>
        {formatMoney(amount, currency)}
      </p>
    </div>
  );
}

export default function SummaryCards({ summary, currency }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2">
        <StatCard label="Toplam Ödeme" amount={summary.total} currency={currency} icon={Wallet} tone="dark" />
      </div>
      <StatCard label="Ödendi" amount={summary.paid} currency={currency} icon={Check} tone="paid" />
      <StatCard label="Bekleyen" amount={summary.pending} currency={currency} icon={Clock} tone="pending" />
      <div className="col-span-2">
        <StatCard label="Gecikmiş" amount={summary.late} currency={currency} icon={AlertTriangle} tone="late" />
      </div>
    </div>
  );
}