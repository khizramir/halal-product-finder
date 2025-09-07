import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { barcode: string } }
) {
  const { barcode } = params;
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(barcode)}.json`,
      { next: { revalidate: 60 * 60 } }
    );
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch product data' },
        { status: response.status }
      );
    }
    const json = await response.json();
    const product = json.product || {};
    const normalized = {
      barcode,
      name: product.product_name || '',
      brand: product.brands || '',
      imageUrl: product.image_front_small_url || product.image_url || '',
      ingredients: product.ingredients_text || product.ingredients_text_en || '',
      nutriments: product.nutriments || {},
    };
    return NextResponse.json(normalized);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error fetching product' }, { status: 500 });
  }
}