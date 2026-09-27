import { useMemo } from 'react';
import { getCategory } from '@/lib/categories';
import { formatMoney, getStatus, ymKeyFromISO } from '@/lib/format';
import { PieChart as PieIcon } from 'lucide-react';

export default function StatsView({ expenses, monthKey, currency, budget }) {
  const monthExpenses = useMemo(
    () => expenses.filter((e) => ymKeyFromISO(e.dueDate) === monthKey),
    [expenses, monthKey]
  );

  const byCategory = useMemo(() => {
    const map = {};
    monthExpenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + Number(e.amount || 0);
    });
    return Object.entries(map)
      .map(([id, amount]) => ({ id, amount, cat: getCategory(id) }))
      .sort((a, b) => b.amount - a.amount);
  }, [monthExpenses]);

  const total = byCategory.reduce((s, x) => s + x.amount, 0);
  const maxCat = byCategory[0]?.amount || 1;
  const paidCount = monthExpenses.filter((e) => getStatus(e) === 'paid').length;
  const lateCount = monthExpenses.filter((e) => getStatus(e) === 'late').length;

  if (monthExpenses.length === 0) {
    return (
      <div className="p-10 text-center rounded-2xl border border-dashed border-border text-muted-foreground mt-4">
        <PieIcon size={22} className="mx-auto mb-2 text-muted-foreground/50" />
        <p className="text-sm">Bu ay için istatistik yok.</p>
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-5">
      {budget > 0 && (
        <div className="rounded-3xl bg-card border border-border p-4 shadow-sm">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bütçe</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {formatMoney(total, currency)} / {formatMoney(budget, currency)}
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, (total / budget) * 100)}%`,
                backgroundColor: total > budget ? '#E84D5B' : '#C9A227',
              }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground tabular-nums">
            {total > budget
              ? `${formatMoney(total - budget, currency)} bütçe aşımı`
              : `${formatMoney(budget - total, currency)} kaldı`}
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <MiniStat label="Toplam" value={formatMoney(total, currency)} />
        <MiniStat label="Ödenen" value={`${paidCount}`} />
        <MiniStat label="Gecikmiş" value={`${lateCount}`} />
      </div>

      <div>
        <h3 className="font-display text-base font-bold text-foreground tracking-tight mb-3">Kategoriye Göre</h3>
        <div className="grid gap-2.5">
          {byCategory.map(({ id, amount, cat }) => {
            const Icon = cat.icon;
            const pct = total ? Math.round((amount / total) * 100) : 0;
            return (
              <div key={id} className="rounded-2xl bg-card border border-border p-3.5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="w-9 h-9 grid place-items-center rounded-xl shrink-0"
                    style={{ backgroundColor: `${cat.color}1A`, color: cat.color }}
                  >
                    <Icon size={16} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-foreground">{cat.label}</span>
                    <span className="block text-xs text-muted-foreground tabular-nums">%{pct}</span>
                  </span>
                  <span className="font-display font-bold text-sm tabular-nums text-foreground">
                    {formatMoney(amount, currency)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(amount / maxCat) * 100}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-3.5 shadow-sm text-center">
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display font-bold text-foreground tabular-nums truncate">{value}</p>
    </div>
  );
}