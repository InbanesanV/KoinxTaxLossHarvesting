import type { CapitalGainsAPIResponse } from '../types';

const MOCK_CAPITAL_GAINS: CapitalGainsAPIResponse = {
  capitalGains: {
    stcg: { profits: 70200.88, losses: 1548.53 },
    ltcg: { profits: 5020, losses: 3050 },
  },
};

export async function fetchCapitalGains(): Promise<CapitalGainsAPIResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate occasional errors (uncomment to test error state)
      // if (Math.random() < 0.1) {
      //   reject(new Error('Failed to fetch capital gains data'));
      //   return;
      // }
      resolve(MOCK_CAPITAL_GAINS);
    }, 800);
  });
}
