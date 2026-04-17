import { useHarvesting } from '../context/HarvestingContext';
import { sortHoldingsByGain } from '../utils/calculations';
import type { Holding } from '../types';

export function useHoldings(): {
  holdings: Holding[];
  sortedHoldings: Holding[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const { state, refetchHoldings } = useHarvesting();

  const sortedHoldings = sortHoldingsByGain(state.holdings);

  return {
    holdings: state.holdings,
    sortedHoldings,
    isLoading: state.isLoadingHoldings,
    error: state.errorHoldings,
    refetch: refetchHoldings,
  };
}
