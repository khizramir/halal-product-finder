import { notFound } from 'next/navigation';
import { HalalVerdict, getHalalVerdict } from '@/lib/halalRules';

interface ProductPageProps {
  params: { barcode: string };
}

interface ProductData {
  barcode: string;
  name: string;
  brand: string;
  imageUrl?: string;
  ingredients?: string;
  nutriments?: Record<string, string>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { barcode } = params;
  // Fetch product data from our API
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/off/${barcode}`);
  if (!res.ok) {
    notFound();
  }
  const data = await res.json() as ProductData;
  if (!data || !data.barcode) {
    notFound();
  }
  const verdict: HalalVerdict = getHalalVerdict(data);
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{data.name || 'Unknown Product'}</h2>
      <p className="text-gray-700">Barcode: {data.barcode}</p>
      {data.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.imageUrl} alt={data.name} className="w-40 h-40 object-contain border" />
      )}
      <p><strong>Brand:</strong> {data.brand || 'N/A'}</p>
      {data.ingredients && (
        <p><strong>Ingredients:</strong> {data.ingredients}</p>
      )}
      <div className="p-4 border rounded bg-gray-100">
        <h3 className="font-semibold mb-2">Halal Verdict</h3>
        <p><strong>Status:</strong> {verdict.status}</p>
        <p><strong>Reasoning:</strong> {verdict.reasons.join(', ') || 'No evidence available'}</p>
      </div>
    </div>
  );
}