import { useState } from 'react';

export default function ShortenForm({ onCreated }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }

      setOriginalUrl('');
      onCreated(data);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Shorten a URL</h2>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Destination URL
        </label>
        <input
          type="url"
          required
          placeholder="https://example.com/very/long/url"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-taller-500"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-taller-500 px-4 py-2 text-sm font-semibold text-white hover:bg-taller-600 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Shortening…' : 'Shorten URL'}
      </button>
    </form>
  );
}
