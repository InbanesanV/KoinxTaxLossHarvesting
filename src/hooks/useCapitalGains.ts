import { useHarvesting } from '../context/HarvestingContext';
import { calculatePreHarvesting, calculateAfterHarvesting } from '../utils/calculations';
import type { PreHarvestingData, AfterHarvestingData } from '../types';

export function useCapitalGains(): {
  preHarvesting: PreHarvestingData | null;
  afterHarvesting: AfterHarvestingData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const { state, refetchGains } = useHarvesting();

  const preHarvesting = state.capitalGains
    ? calculatePreHarvesting(state.capitalGains)
    : null;

  const afterHarvesting =
    state.capitalGains
      ? calculateAfterHarvesting(state.capitalGains, state.holdings, state.selectedHoldings)
      : null;

  return {
    preHarvesting,
    afterHarvesting,
    isLoading: state.isLoadingGains,
    error: state.errorGains,
    refetch: refetchGains,
  };
}
