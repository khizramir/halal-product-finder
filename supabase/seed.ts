/**
 * Seed script for Halal Product Finder AU.
 *
 * This script populates the database with a few sample products,
 * halal assessments, stores and product-store associations.
 *
 * To run this script, install dependencies and execute using ts-node
 * or compile to JavaScript. Ensure you set the SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY environment variables for full access.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY) as string;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  // Upsert sample products
  const products = [
    {
      barcode: '9353824000913',
      name: 'Plain Greek Yogurt',
      brand: 'Coles',
      img_url: '',
      off_payload_json: {},
    },
    {
      barcode: '9300605142168',
      name: 'Tim Tam Original',
      brand: 'Arnott\'s',
      img_url: '',
      off_payload_json: {},
    },
  ];
  for (const p of products) {
    await supabase.from('products').upsert(p, { onConflict: 'barcode' });
  }
  // Upsert stores
  const stores = [
    { name: 'Coles West End', chain: 'coles', suburb: 'West End', state: 'QLD' },
    { name: 'Woolworths South Brisbane', chain: 'woolworths', suburb: 'South Brisbane', state: 'QLD' },
  ];
  const storeIds: string[] = [];
  for (const store of stores) {
    const { data } = await supabase.from('stores').upsert(store).select('id');
    if (data && data.length > 0) storeIds.push(data[0].id as string);
  }
  // Link sample products to stores
  const productEntries = await supabase.from('products').select('id, barcode');
  if (productEntries.data) {
    for (const product of productEntries.data) {
      for (const storeId of storeIds) {
        await supabase.from('product_store').upsert({ product_id: product.id, store_id: storeId });
      }
    }
  }
  // Insert assessments
  const productMap: Record<string, string> = {};
  productEntries.data?.forEach((p) => (productMap[p.barcode] = p.id));
  const assessments = [
    {
      product_id: productMap['9353824000913'],
      status: 'likely_halal',
      confidence: 70,
      reasons: [{ note: 'Contains dairy but no animal gelatine' }],
      sources: [],
      reviewer_user_id: null,
    },
    {
      product_id: productMap['9300605142168'],
      status: 'unknown',
      confidence: 50,
      reasons: [{ note: 'Contains emulsifiers of unknown origin' }],
      sources: [],
      reviewer_user_id: null,
    },
  ];
  for (const assessment of assessments) {
    await supabase.from('halal_assessments').insert({
      product_id: assessment.product_id,
      status: assessment.status,
      confidence: assessment.confidence,
      reasons: assessment.reasons,
      sources: assessment.sources,
      reviewer_user_id: assessment.reviewer_user_id,
    });
  }
  console.log('Database seeded successfully.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});