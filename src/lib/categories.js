import {
  Home, Zap, Droplet, Flame, Wifi, Smartphone, Repeat, Fuel,
  ShoppingCart, Landmark, Shield, Receipt, Heart, GraduationCap,
  Car, Gift, MoreHorizontal,
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'kira', label: 'Kira', icon: Home, color: '#6B7FDB' },
  { id: 'elektrik', label: 'Elektrik', icon: Zap, color: '#E0A800' },
  { id: 'su', label: 'Su', icon: Droplet, color: '#3B9AE1' },
  { id: 'dogalgaz', label: 'Doğalgaz', icon: Flame, color: '#E0650A' },
  { id: 'internet', label: 'İnternet', icon: Wifi, color: '#7C5BD9' },
  { id: 'telefon', label: 'Telefon', icon: Smartphone, color: '#5B9BD9' },
  { id: 'abonelik', label: 'Abonelik', icon: Repeat, color: '#D94F7C' },
  { id: 'akaryakit', label: 'Akaryakıt', icon: Fuel, color: '#C2410C' },
  { id: 'market', label: 'Market', icon: ShoppingCart, color: '#2E7D5B' },
  { id: 'kredi', label: 'Kredi', icon: Landmark, color: '#475569' },
  { id: 'sigorta', label: 'Sigorta', icon: Shield, color: '#0E9488' },
  { id: 'vergi', label: 'Vergi', icon: Receipt, color: '#8B5CF6' },
  { id: 'saglik', label: 'Sağlık', icon: Heart, color: '#E84D5B' },
  { id: 'egitim', label: 'Eğitim', icon: GraduationCap, color: '#2563EB' },
  { id: 'ulasim', label: 'Ulaşım', icon: Car, color: '#0891B2' },
  { id: 'hediye', label: 'Hediye', icon: Gift, color: '#DB2777' },
  { id: 'diger', label: 'Diğer', icon: MoreHorizontal, color: '#94A3B8' },
];

const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
const FALLBACK = CATEGORIES[CATEGORIES.length - 1];

export function getCategory(id) {
  return CATEGORY_MAP[id] || FALLBACK;
}