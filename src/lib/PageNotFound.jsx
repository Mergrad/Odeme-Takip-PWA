import { useLocation } from 'react-router-dom';

export default function PageNotFound() {
  const pageName = useLocation().pathname.substring(1);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-7xl font-light text-muted-foreground/60">404</h1>
        <h2 className="text-2xl font-medium text-foreground">Sayfa bulunamadı</h2>
        <p className="text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">"{pageName}"</span> sayfası bu uygulamada bulunamadı.
        </p>
        <a
          href="/"
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          Ana sayfaya dön
        </a>
      </div>
    </div>
  );
}