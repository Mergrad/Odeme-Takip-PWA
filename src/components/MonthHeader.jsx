import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatMonthLabel, ymKey } from '@/lib/format';

export default function MonthHeader({ month, onPrev, onNext, onToday }) {
  const isCurrent = ymKey(month) === ymKey(new Date());
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onPrev}
        className="w-10 h-10 grid place-items-center rounded-2xl bg-card border border-border text-muted-foreground hover:bg-muted/60 transition"
        aria-label="Önceki ay"
      >
        <ChevronLeft size={18} />
      </button>
      <div className="text-center">
        <h1 className="font-display text-xl font-extrabold tracking-tight text-foreground">
          {formatMonthLabel(month)}
        </h1>
        {!isCurrent && (
          <button onClick={onToday} className="text-xs font-semibold text-accent mt-0.5">
            Bugüne dön
          </button>
        )}
      </div>
      <button
        onClick={onNext}
        className="w-10 h-10 grid place-items-center rounded-2xl bg-card border border-border text-muted-foreground hover:bg-muted/60 transition"
        aria-label="Sonraki ay"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}