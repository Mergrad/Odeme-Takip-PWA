import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Sheet({ open, onClose, title, children, footer }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-card sm:rounded-3xl rounded-t-3xl shadow-2xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 340 }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-card/95 backdrop-blur border-b border-border">
              <h2 className="font-display text-lg font-bold text-foreground tracking-tight">{title}</h2>
              <button
                onClick={onClose}
                className="w-9 h-9 grid place-items-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition"
                aria-label="Kapat"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-5">{children}</div>
            {footer && (
              <div className="sticky bottom-0 px-5 py-4 bg-card/95 backdrop-blur border-t border-border">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}