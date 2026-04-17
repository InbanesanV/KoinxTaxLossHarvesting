import React from 'react';
import { useCapitalGains } from './hooks/useCapitalGains';
import { useHarvesting } from './context/HarvestingContext';
import { CapitalGainsCard } from './components/CapitalGainsCard';
import { HoldingsTable } from './components/HoldingsTable';
import { SavingsBanner } from './components/SavingsBanner';
import { Navbar } from './components/Navbar';
import { ImportantNotes } from './components/ImportantNotes';
import { ThemeProvider } from './context/ThemeContext';

function AppContent() {
  const { preHarvesting, afterHarvesting, isLoading, error, refetch } = useCapitalGains();
  const { state } = useHarvesting();

  const savingAmount = preHarvesting && afterHarvesting
    ? Math.max(0, preHarvesting.realisedGains - afterHarvesting.realisedGains)
    : 0;

  const showSavingsBanner =
    preHarvesting !== null &&
    afterHarvesting !== null &&
    afterHarvesting.realisedGains < preHarvesting.realisedGains &&
    state.selectedHoldings.size > 0;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        {/* Navbar */}
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* ─── Header ─── */}
          <header className="mb-6">
            {/* Page title */}
            <div className="flex items-center gap-3 mb-6">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                Tax Harvesting
              </h1>
              <a 
                href="#" 
                className="text-sm text-blue-400 hover:text-blue-300 underline"
              >
                How it works?
              </a>
            </div>
          </header>

          {/* ─── Important Notes ─── */}
          <div className="mb-6">
            <ImportantNotes />
          </div>

        {/* ─── Capital Gains Cards ─── */}
        <section className="mb-6" aria-label="Capital Gains Summary">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Pre Harvesting */}
            <CapitalGainsCard
              title="Pre Harvesting"
              variant="pre"
              stcgProfits={preHarvesting?.stcg.profits ?? 0}
              stcgLosses={preHarvesting?.stcg.losses ?? 0}
              stcgNet={preHarvesting?.stcg.net ?? 0}
              ltcgProfits={preHarvesting?.ltcg.profits ?? 0}
              ltcgLosses={preHarvesting?.ltcg.losses ?? 0}
              ltcgNet={preHarvesting?.ltcg.net ?? 0}
              realisedGains={preHarvesting?.realisedGains ?? 0}
              isLoading={isLoading}
              error={error}
              onRetry={refetch}
            />

            {/* After Harvesting */}
            <CapitalGainsCard
              title="After Harvesting"
              variant="after"
              stcgProfits={afterHarvesting?.stcg.profits ?? 0}
              stcgLosses={afterHarvesting?.stcg.losses ?? 0}
              stcgNet={afterHarvesting?.netSTCG ?? 0}
              ltcgProfits={afterHarvesting?.ltcg.profits ?? 0}
              ltcgLosses={afterHarvesting?.ltcg.losses ?? 0}
              ltcgNet={afterHarvesting?.netLTCG ?? 0}
              realisedGains={afterHarvesting?.realisedGains ?? 0}
              isLoading={isLoading}
              error={error}
              onRetry={refetch}
            />
          </div>

          {/* Savings Banner */}
          {showSavingsBanner && (
            <div className="mt-4">
              <SavingsBanner savings={savingAmount} visible={showSavingsBanner} />
            </div>
          )}
        </section>

        {/* ─── Holdings Table ─── */}
        <section aria-label="Holdings for Tax Loss Harvesting">
          <HoldingsTable />
        </section>
      </div>
    </div>
    </ThemeProvider>
  );
}

export default AppContent;
