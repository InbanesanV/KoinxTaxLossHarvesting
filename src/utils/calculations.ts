import type { CapitalGainsData, Holding, PreHarvestingData, AfterHarvestingData } from '../types';

/**
 * Calculate pre-harvesting data from capital gains API response
 */
export function calculatePreHarvesting(capitalGains: CapitalGainsData): PreHarvestingData {
  const netSTCG = capitalGains.stcg.profits - capitalGains.stcg.losses;
  const netLTCG = capitalGains.ltcg.profits - capitalGains.ltcg.losses;
  const realisedGains = netSTCG + netLTCG;

  return {
    stcg: {
      profits: capitalGains.stcg.profits,
      losses: capitalGains.stcg.losses,
      net: netSTCG,
    },
    ltcg: {
      profits: capitalGains.ltcg.profits,
      losses: capitalGains.ltcg.losses,
      net: netLTCG,
    },
    realisedGains,
  };
}

/**
 * Calculate after-harvesting data based on selected holdings
 * For each selected holding:
 *   - if stcg.gain > 0: add to stcg profits
 *   - if stcg.gain < 0: add absolute value to stcg losses
 *   - if ltcg.gain > 0: add to ltcg profits
 *   - if ltcg.gain < 0: add absolute value to ltcg losses
 */
export function calculateAfterHarvesting(
  capitalGains: CapitalGainsData,
  holdings: Holding[],
  selectedHoldings: Set<string>
): AfterHarvestingData {
  let additionalStcgProfits = 0;
  let additionalStcgLosses = 0;
  let additionalLtcgProfits = 0;
  let additionalLtcgLosses = 0;

  holdings.forEach((holding) => {
    // Use coin + coinName as unique identifier to handle duplicate coin tickers
    const holdingId = `${holding.coin}::${holding.coinName}`;
    if (selectedHoldings.has(holdingId)) {
      if (holding.stcg.gain > 0) {
        additionalStcgProfits += holding.stcg.gain;
      } else if (holding.stcg.gain < 0) {
        additionalStcgLosses += Math.abs(holding.stcg.gain);
      }

      if (holding.ltcg.gain > 0) {
        additionalLtcgProfits += holding.ltcg.gain;
      } else if (holding.ltcg.gain < 0) {
        additionalLtcgLosses += Math.abs(holding.ltcg.gain);
      }
    }
  });

  const newStcgProfits = capitalGains.stcg.profits + additionalStcgProfits;
  const newStcgLosses = capitalGains.stcg.losses + additionalStcgLosses;
  const newLtcgProfits = capitalGains.ltcg.profits + additionalLtcgProfits;
  const newLtcgLosses = capitalGains.ltcg.losses + additionalLtcgLosses;

  const netSTCG = newStcgProfits - newStcgLosses;
  const netLTCG = newLtcgProfits - newLtcgLosses;
  const realisedGains = netSTCG + netLTCG;

  return {
    stcg: {
      profits: newStcgProfits,
      losses: newStcgLosses,
    },
    ltcg: {
      profits: newLtcgProfits,
      losses: newLtcgLosses,
    },
    netSTCG,
    netLTCG,
    realisedGains,
  };
}

/**
 * Get unique identifier for a holding
 */
export function getHoldingId(holding: Holding): string {
  return `${holding.coin}::${holding.coinName}`;
}

/**
 * Sort holdings by absolute gain (stcg + ltcg) descending
 */
export function sortHoldingsByGain(holdings: Holding[]): Holding[] {
  return [...holdings].sort((a, b) => {
    const aGain = Math.abs(a.stcg.gain) + Math.abs(a.ltcg.gain);
    const bGain = Math.abs(b.stcg.gain) + Math.abs(b.ltcg.gain);
    return bGain - aGain;
  });
}

/**
 * Calculate tax savings (simplified: assumes 15% STCG + 10% LTCG)
 */
export function calculateTaxSavings(
  preRealisedGains: number,
  afterRealisedGains: number
): number {
  const savings = preRealisedGains - afterRealisedGains;
  return Math.max(0, savings);
}
