export type HalalStatus = 'Halal' | 'Likely Halal' | 'Unknown' | 'Not Halal';

export interface HalalVerdict {
  status: HalalStatus;
  confidence: number; // 0–100
  reasons: string[];
  lastReviewedBy?: string;
  lastReviewedAt?: string;
  sources?: string[];
}

interface ProductInfo {
  barcode: string;
  name?: string;
  brand?: string;
  ingredients?: string;
  nutriments?: Record<string, any>;
}

/**
 * Stub halal rules engine.
 * For the MVP this function returns Unknown status with generic reasoning.
 */
export function getHalalVerdict(product: ProductInfo): HalalVerdict {
  const reasons: string[] = [];
  const ingredients = product.ingredients?.toLowerCase() || '';
  // Basic checks for obvious non-halal ingredients
  if (ingredients.includes('gelatin') || ingredients.includes('pork')) {
    return {
      status: 'Not Halal',
      confidence: 90,
      reasons: ['Contains pork-derived ingredients or gelatin'],
    };
  }
  if (ingredients.includes('alcohol') || ingredients.includes('ethanol')) {
    return {
      status: 'Not Halal',
      confidence: 90,
      reasons: ['Contains alcohol'],
    };
  }
  if (!ingredients) {
    reasons.push('No ingredient data available');
  }
  return {
    status: 'Unknown',
    confidence: 50,
    reasons: reasons.length ? reasons : ['No halal certification or ingredient data available'],
  };
}