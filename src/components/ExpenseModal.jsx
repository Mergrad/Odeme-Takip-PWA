import { useState, useEffect } from 'react';
import { Trash2, Check } from 'lucide-react';
import Sheet from '@/components/Sheet';
import { CATEGORIES } from '@/lib/categories';
import { todayISO } from '@/lib/format';

const EMPTY = {
  name: '', amount: '', category: 'kira', dueDate: todayISO(),
  recurring: 'none', status: 'pending', notes: '',
};

export default function ExpenseModal({ open, editing, currency, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setError('');
      if (editing) {
        setForm({
          name: editing.name || '',
          amount: String(editing.amount ?? ''),
          category: editing.category || 'kira',
          dueDate: editing.dueDate || todayISO(),
          recurring: editing.recurring || 'none',
          status: editing.status || 'pending',
          notes: editing.notes || '',
        });
      } else {
        setForm(EMPTY);
      }
    }
  }, [open, editing]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) return setError('Lütfen bir başlık girin.');
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) return setError('Lütfen geçerli bir tutar girin.');
    if (!form.dueDate) return setError('Lütfen bir son ödeme tarihi seçin.');
    onSave({
      name: form.name.trim(),
      amount,
      category: form.category,
      dueDate: form.dueDate,
      recurring: form.recurring,
      status: form.status,
      notes: form.notes.trim(),
      paidDate: form.status === 'paid' ? (editing?.paidDate || todayISO()) : null,
    });
  };

  const inputCls = 'w-full px-4 py-3 rounded-2xl bg-muted/50 border border-border focus:border-primary outline-none text-sm text-foreground placeholder:text-muted-foreground/60 transition';

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={editing ? 'Ödemeyi Düzenle' : 'Yeni Ödeme'}
      footer={
        <div className="flex gap-2">
          {editing && (
            <button
              onClick={() => onDelete(editing.id)}
              className="px-4 py-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition"
              aria-label="Sil"
            >
              <Trash2 size={18} />
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition"
          >
            {editing ? 'Güncelle' : 'Kaydet'}
          </button>
        </div>
      }
    >
      <Field label="Başlık">
        <input
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Örn. Elektrik faturası"
          className={inputCls}
        />
      </Field>

      <Field label={`Tutar (${currency})`}>
        <input
          type="number"
          inputMode="decimal"
          value={form.amount}
          onChange={(e) => set('amount', e.target.value)}
          placeholder="0"
          className={`${inputCls} tabular-nums`}
        />
      </Field>

      <Field label="Kategori">
        <div className="grid grid-cols-4 gap-2 max-h-52 overflow-y-auto no-scrollbar pr-0.5">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            const active = form.category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => set('category', c.id)}
                className={`relative flex flex-col items-center gap-1 py-2.5 px-1 rounded-2xl border transition ${active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:border-primary/40'}`}
              >
                {active && <span className="absolute top-1 right-1"><Check size={12} /></span>}
                <Icon size={18} style={active ? undefined : { color: c.color }} />
                <span className="text-[10px] font-medium leading-tight text-center">{c.label}</span>
              </button>
            );
          })}
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Son ödeme tarihi">
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => set('dueDate', e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Tekrarla">
          <select
            value={form.recurring}
            onChange={(e) => set('recurring', e.target.value)}
            className={inputCls}
          >
            <option value="none">Tekrarlanmasın</option>
            <option value="monthly">Her ay</option>
            <option value="yearly">Her yıl</option>
          </select>
        </Field>
      </div>

      <Field label="Durum">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => set('status', 'pending')}
            className={`py-3 rounded-2xl border text-sm font-semibold transition ${form.status === 'pending' ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'border-border bg-card text-muted-foreground'}`}
          >
            Bekleyen
          </button>
          <button
            onClick={() => set('status', 'paid')}
            className={`py-3 rounded-2xl border text-sm font-semibold transition ${form.status === 'paid' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-border bg-card text-muted-foreground'}`}
          >
            Ödendi
          </button>
        </div>
      </Field>

      <Field label="Not (opsiyonel)">
        <textarea
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          rows={2}
          placeholder="İsterseniz ekleyin…"
          className={`${inputCls} resize-none`}
        />
      </Field>

      {error && <p className="mt-3 text-sm text-rose-500 font-medium">{error}</p>}
    </Sheet>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-3.5">
      <label className="block mb-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}