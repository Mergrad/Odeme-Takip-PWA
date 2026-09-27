import { useState, useEffect, useCallback } from 'react';
import { SEED_EXPENSES } from '@/lib/seedData';

const STORAGE_KEY = 'odeme_takip_data_v1';

const DEFAULT_DATA = {
  expenses: [],
  settings: { currency: '₺', monthlyBudget: 0 },
};

const SEED_FLAG = 'odeme_takip_seeded';

// Eylül 2026 ödemeleri ilk açılışta bir kez otomatik doldurulur
function seededData() {
  return {
    expenses: SEED_EXPENSES.map((e) => ({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...e,
    })),
    settings: DEFAULT_DATA.settings,
  };
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let parsed = null;
    try { parsed = raw ? JSON.parse(raw) : null; } catch { parsed = null; }
    const hasData = parsed && Array.isArray(parsed.expenses) && parsed.expenses.length > 0;
    const seeded = localStorage.getItem(SEED_FLAG) === 'yes';
    if (!hasData && !seeded) {
      localStorage.setItem(SEED_FLAG, 'yes');
      return seededData();
    }
    return {
      expenses: Array.isArray(parsed?.expenses) ? parsed.expenses : [],
      settings: { ...DEFAULT_DATA.settings, ...(parsed?.settings || {}) },
    };
  } catch {
    return DEFAULT_DATA;
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* storage full / unavailable */
  }
}

export function exportToFile(data) {
  const text = JSON.stringify(data, null, 2);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `odeme-takip-yedek-${date}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function importFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        resolve({
          expenses: Array.isArray(data.expenses) ? data.expenses : [],
          settings: { ...DEFAULT_DATA.settings, ...(data.settings || {}) },
        });
      } catch {
        reject(new Error('Dosya okunamadı. Geçerli bir yedek dosyası seçin.'));
      }
    };
    reader.onerror = () => reject(new Error('Dosya okunamadı.'));
    reader.readAsText(file);
  });
}

export function usePaymentStore() {
  const [data, setData] = useState(() => loadData());

  useEffect(() => {
    saveData(data);
  }, [data]);

  const addExpense = useCallback((exp) => {
    setData((d) => ({
      ...d,
      expenses: [
        { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...exp },
        ...d.expenses,
      ],
    }));
  }, []);

  const updateExpense = useCallback((id, patch) => {
    setData((d) => ({
      ...d,
      expenses: d.expenses.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  }, []);

  const deleteExpense = useCallback((id) => {
    setData((d) => ({ ...d, expenses: d.expenses.filter((e) => e.id !== id) }));
  }, []);

  const updateSettings = useCallback((patch) => {
    setData((d) => ({ ...d, settings: { ...d.settings, ...patch } }));
  }, []);

  const replaceAll = useCallback((newData) => setData(newData), []);
  const clearAll = useCallback(() => setData(DEFAULT_DATA), []);

  return {
    data,
    addExpense,
    updateExpense,
    deleteExpense,
    updateSettings,
    replaceAll,
    clearAll,
  };
}