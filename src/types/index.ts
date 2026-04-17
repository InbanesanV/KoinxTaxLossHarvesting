export interface GainLoss {
  balance: number;
  gain: number;
}

export interface Holding {
  coin: string;
  coinName: string;
  logo: string;
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: GainLoss;
  ltcg: GainLoss;
}

export interface CapitalGainsData {
  stcg: {
    profits: number;
    losses: number;
  };
  ltcg: {
    profits: number;
    losses: number;
  };
}

export interface CapitalGainsAPIResponse {
  capitalGains: CapitalGainsData;
}

export interface HarvestingState {
  capitalGains: CapitalGainsData | null;
  holdings: Holding[];
  selectedHoldings: Set<string>;
  isLoadingGains: boolean;
  isLoadingHoldings: boolean;
  errorGains: string | null;
  errorHoldings: string | null;
  showAll: boolean;
}

export type HarvestingAction =
  | { type: 'SET_CAPITAL_GAINS'; payload: CapitalGainsData }
  | { type: 'SET_HOLDINGS'; payload: Holding[] }
  | { type: 'SET_LOADING_GAINS'; payload: boolean }
  | { type: 'SET_LOADING_HOLDINGS'; payload: boolean }
  | { type: 'SET_ERROR_GAINS'; payload: string | null }
  | { type: 'SET_ERROR_HOLDINGS'; payload: string | null }
  | { type: 'TOGGLE_HOLDING'; payload: string }
  | { type: 'SELECT_ALL' }
  | { type: 'DESELECT_ALL' }
  | { type: 'TOGGLE_VIEW_ALL' };

export interface AfterHarvestingData {
  stcg: {
    profits: number;
    losses: number;
  };
  ltcg: {
    profits: number;
    losses: number;
  };
  netSTCG: number;
  netLTCG: number;
  realisedGains: number;
}

export interface PreHarvestingData {
  stcg: {
    profits: number;
    losses: number;
    net: number;
  };
  ltcg: {
    profits: number;
    losses: number;
    net: number;
  };
  realisedGains: number;
}
