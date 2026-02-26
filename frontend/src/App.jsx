import { useEffect, useState } from 'react';
import ShortenForm from './components/ShortenForm';
import UrlTable from './components/UrlTable';

function TallerLogo() {
  return (
    <svg viewBox="0 0 36 40" fill="none" className="w-8 h-9">
      <path d="M3 36L14 4L20 14L9 46" fill="#E8461A" />
      <path d="M3 36L14 4L20 14L9 40L3 36Z" fill="#E8461A" />
      <path d="M13 36L24 4L30 14L19 40L13 36Z" fill="#E8461A" opacity="0.75" />
    </svg>
  );
}

export default function App() {
  const [urls, setUrls] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [newUrl, setNewUrl] = useState(null);

  useEffect(() => {
    fetchUrls();
  }, []);

  async function fetchUrls() {
    try {
      const res = await fetch('/api/urls');
      const data = await res.json();
      if (res.ok) {
        setUrls(data);
      } else {
        setLoadError(data.error || 'Failed to load URLs.');
      }
    } catch {
      setLoadError('Network error. Could not load URLs.');
    }
  }

  function handleCreated(url) {
    setNewUrl(url);
    setUrls((prev) => [url, ...prev]);
    setTimeout(() => setNewUrl(null), 6000);
  }

  function handleDeleted(alias) {
    setUrls((prev) => prev.filter((u) => u.alias !== alias));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <TallerLogo />
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold text-gray-900 tracking-tight">taller</span>
            <span className="text-xs font-medium text-taller-500 tracking-wide uppercase">URL Shortener</span>
          </div>
        </div>
      </header>

      <div className="bg-taller-500">
        <div className="max-w-4xl mx-auto px-4 py-10 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Taller URL Shortener</h1>
          <p className="text-taller-100 text-sm">Paste a long URL and get a short link instantly.</p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <ShortenForm onCreated={handleCreated} />

        {newUrl && (
          <div className="bg-taller-50 border border-taller-100 rounded-2xl px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-taller-600">Short URL created!</p>
              <a
                href={`${window.location.origin}/${newUrl.alias}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-taller-500 underline break-all"
              >
                {window.location.origin}/{newUrl.alias}
              </a>
            </div>
            <button
              onClick={() => setNewUrl(null)}
              className="text-taller-400 hover:text-taller-600 shrink-0"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        {loadError && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{loadError}</p>
        )}

        <UrlTable urls={urls} onDeleted={handleDeleted} />
      </main>

      <footer className="mt-12 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-2">
          <TallerLogo />
          <span className="text-sm text-gray-400">© {new Date().getFullYear()} Taller. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
