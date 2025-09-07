"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/product/${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Search for a Product</h2>
        <form onSubmit={handleSearch} className="flex space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Enter product name or barcode"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Search
          </button>
        </form>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2">Or Scan a Barcode</h2>
        <a
          href="/scan"
          className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Scan Now
        </a>
      </div>
    </div>
  );
}