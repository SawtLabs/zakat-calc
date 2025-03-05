// Constants
export const ZAKAT_RATE = 0.025; // 2.5%

// Thresholds with their Hadith references
export const THRESHOLDS = {
  GOLD: {
    value: 87.48, // grams
    hadith: "The Prophet (ﷺ) prescribed that no Zakat is payable on less than twenty dinars of gold. (Bukhari)"
  },
  SILVER: {
    value: 612.36, // grams
    hadith: "No Zakat is due on less than 5 awsuq [equivalent to 612.36g] of silver. (Bukhari)"
  },
  AGRICULTURAL: {
    value: 653, // kg
    hadith: "No Zakat is due on less than 5 awsuq of dates or grains. (Bukhari)"
  }
} as const;

// Current market rates (example values, should be updated regularly)
export const RATES = {
  GOLD_PER_GRAM: 6000, // INR
  SILVER_PER_GRAM: 75, // INR
};

/**
 * Formats a number as INR currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

interface Asset {
  name: string;
  value: number;
}

/**
 * Gets the appropriate Hadith based on asset type
 */
export function getAssetHadith(assetName: string): string | null {
  const lowerName = assetName.toLowerCase();
  if (lowerName.includes('gold')) {
    return THRESHOLDS.GOLD.hadith;
  }
  if (lowerName.includes('silver')) {
    return THRESHOLDS.SILVER.hadith;
  }
  if (lowerName.includes('crop') || lowerName.includes('agriculture')) {
    return THRESHOLDS.AGRICULTURAL.hadith;
  }
  return null;
}

/**
 * Determines if an asset meets its Nisab threshold
 */
export function isAboveThreshold(asset: Asset): boolean {
  const lowerName = asset.name.toLowerCase();

  if (lowerName.includes('gold')) {
    return asset.value >= (THRESHOLDS.GOLD.value * RATES.GOLD_PER_GRAM);
  }
  if (lowerName.includes('silver')) {
    return asset.value >= (THRESHOLDS.SILVER.value * RATES.SILVER_PER_GRAM);
  }
  // For cash and other assets, compare with gold threshold
  return asset.value >= (THRESHOLDS.GOLD.value * RATES.GOLD_PER_GRAM);
}

/**
 * Calculates Zakat and provides relevant Hadith
 */
export function calculateZakat(assets: Asset[]) {
  let totalZakatable = 0;
  let relevantHadiths = new Set<string>();

  for (const asset of assets) {
    const lowerName = asset.name.toLowerCase();
    let threshold = THRESHOLDS.GOLD.value * RATES.GOLD_PER_GRAM; // Default to gold threshold

    if (lowerName.includes('gold')) {
      threshold = THRESHOLDS.GOLD.value * RATES.GOLD_PER_GRAM;
    } else if (lowerName.includes('silver')) {
      threshold = THRESHOLDS.SILVER.value * RATES.SILVER_PER_GRAM;
    }

    // Only add the amount exceeding threshold to zakatable amount
    if (asset.value > threshold) {
      totalZakatable += (asset.value - threshold);
      const hadith = getAssetHadith(asset.name);
      if (hadith) relevantHadiths.add(hadith);
    }
  }

  return {
    zakatableAmount: totalZakatable,
    zakatAmount: totalZakatable * ZAKAT_RATE,
    hadiths: Array.from(relevantHadiths),
    goldThreshold: formatCurrency(THRESHOLDS.GOLD.value * RATES.GOLD_PER_GRAM),
    silverThreshold: formatCurrency(THRESHOLDS.SILVER.value * RATES.SILVER_PER_GRAM)
  };
}

/**
 * Validates input and returns error message if invalid
 */
export function validateInput(value: string | number): string | null {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return 'Please enter a valid number';
  }
  
  if (numValue < 0) {
    return 'Value cannot be negative';
  }
  
  return null;
}