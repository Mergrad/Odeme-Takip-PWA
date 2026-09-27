import { House, PieChart, Settings } from 'lucide-react';

const TABS = [
  { id: 'home', label: 'Aylık', icon: House },
  { id: 'stats', label: 'İstatistik', icon: PieChart },
  { id: 'settings', label: 'Ayarlar', icon: Settings },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-30 flex justify-around px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+10px)] bg-background/90 backdrop-blur-xl border-t border-border">
      {TABS.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="flex flex-col items-center gap-1 px-4 py-1.5"
          >
            <span
              className={`w-10 h-9 grid place-items-center rounded-2xl transition ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            >
              <Icon size={18} />
            </span>
            <span className={`text-[10px] font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}