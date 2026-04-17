import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react';
import type { HarvestingState, HarvestingAction, CapitalGainsData, Holding } from '../types';
import { fetchCapitalGains } from '../api/capitalGains';
import { fetchHoldings } from '../api/holdings';

const initialState: HarvestingState = {
  capitalGains: null,
  holdings: [],
  selectedHoldings: new Set<string>(),
  isLoadingGains: true,
  isLoadingHoldings: true,
  errorGains: null,
  errorHoldings: null,
  showAll: false,
};

function harvestingReducer(state: HarvestingState, action: HarvestingAction): HarvestingState {
  switch (action.type) {
    case 'SET_CAPITAL_GAINS':
      return { ...state, capitalGains: action.payload };
    case 'SET_HOLDINGS':
      return { ...state, holdings: action.payload };
    case 'SET_LOADING_GAINS':
      return { ...state, isLoadingGains: action.payload };
    case 'SET_LOADING_HOLDINGS':
      return { ...state, isLoadingHoldings: action.payload };
    case 'SET_ERROR_GAINS':
      return { ...state, errorGains: action.payload };
    case 'SET_ERROR_HOLDINGS':
      return { ...state, errorHoldings: action.payload };
    case 'TOGGLE_HOLDING': {
      const newSelected = new Set(state.selectedHoldings);
      if (newSelected.has(action.payload)) {
        newSelected.delete(action.payload);
      } else {
        newSelected.add(action.payload);
      }
      return { ...state, selectedHoldings: newSelected };
    }
    case 'SELECT_ALL': {
      const allIds = state.holdings.map((h) => `${h.coin}::${h.coinName}`);
      return { ...state, selectedHoldings: new Set(allIds) };
    }
    case 'DESELECT_ALL':
      return { ...state, selectedHoldings: new Set<string>() };
    case 'TOGGLE_VIEW_ALL':
      return { ...state, showAll: !state.showAll };
    default:
      return state;
  }
}

interface HarvestingContextValue {
  state: HarvestingState;
  dispatch: React.Dispatch<HarvestingAction>;
  refetchGains: () => void;
  refetchHoldings: () => void;
}

const HarvestingContext = createContext<HarvestingContextValue | undefined>(undefined);

export function HarvestingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(harvestingReducer, initialState);

  const loadCapitalGains = async () => {
    dispatch({ type: 'SET_LOADING_GAINS', payload: true });
    dispatch({ type: 'SET_ERROR_GAINS', payload: null });
    try {
      const data = await fetchCapitalGains();
      dispatch({ type: 'SET_CAPITAL_GAINS', payload: data.capitalGains });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR_GAINS',
        payload: err instanceof Error ? err.message : 'Failed to load capital gains',
      });
    } finally {
      dispatch({ type: 'SET_LOADING_GAINS', payload: false });
    }
  };

  const loadHoldings = async () => {
    dispatch({ type: 'SET_LOADING_HOLDINGS', payload: true });
    dispatch({ type: 'SET_ERROR_HOLDINGS', payload: null });
    try {
      const data = await fetchHoldings();
      dispatch({ type: 'SET_HOLDINGS', payload: data });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR_HOLDINGS',
        payload: err instanceof Error ? err.message : 'Failed to load holdings',
      });
    } finally {
      dispatch({ type: 'SET_LOADING_HOLDINGS', payload: false });
    }
  };

  useEffect(() => {
    loadCapitalGains();
    loadHoldings();
  }, []);

  return (
    <HarvestingContext.Provider
      value={{
        state,
        dispatch,
        refetchGains: loadCapitalGains,
        refetchHoldings: loadHoldings,
      }}
    >
      {children}
    </HarvestingContext.Provider>
  );
}

export function useHarvesting(): HarvestingContextValue {
  const context = useContext(HarvestingContext);
  if (!context) {
    throw new Error('useHarvesting must be used within a HarvestingProvider');
  }
  return context;
}
