import { useState } from 'react';

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-taller-500 hover:text-taller-700 font-medium transition-colors"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export default function UrlTable({ urls, onDeleted }) {
  const [deletingAlias, setDeletingAlias] = useState(null);

  async function handleDelete(alias) {
    setDeletingAlias(alias);
    try {
      const res = await fetch(`/api/urls/${alias}`, { method: 'DELETE' });
      if (res.ok) {
        onDeleted(alias);
      }
    } finally {
      setDeletingAlias(null);
    }
  }

  if (urls.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-400 text-sm">
        No short URLs yet. Create one above.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Your short URLs</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Short URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Destination
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Clicks
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {urls.map((url) => {
              const shortUrl = `${window.location.origin}/${url.alias}`;
              return (
                <tr key={url.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-taller-500 hover:text-taller-700"
                      >
                        /{url.alias}
                      </a>
                      <CopyButton text={shortUrl} />
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <a
                      href={url.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-gray-900 truncate block"
                      title={url.originalUrl}
                    >
                      {url.originalUrl}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-[2rem] rounded-full bg-taller-50 px-2 py-0.5 text-xs font-semibold text-taller-600">
                      {url.clicks}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(url.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(url.alias)}
                      disabled={deletingAlias === url.alias}
                      className="text-sm text-red-500 hover:text-red-700 font-medium disabled:opacity-40 transition-colors"
                    >
                      {deletingAlias === url.alias ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
