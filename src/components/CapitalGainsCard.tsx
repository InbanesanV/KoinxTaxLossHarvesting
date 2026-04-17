import React from 'react';
import { formatINR } from '../utils/formatCurrency';
import { CardSkeleton } from './Loader';

interface GainRow {
  label: string;
  value: number;
  isBold?: boolean;
  isHighlight?: boolean;
}

interface CapitalGainsCardProps {
  title: string;
  variant: 'pre' | 'after';
  stcgProfits: number;
  stcgLosses: number;
  stcgNet: number;
  ltcgProfits: number;
  ltcgLosses: number;
  ltcgNet: number;
  realisedGains: number;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

function GainRowItem({ label, value, isBold, isHighlight }: GainRow) {
  const isNegative = value < 0;
  const valueColor = isNegative
    ? 'text-red-500'
    : value > 0
    ? 'text-emerald-500'
    : 'text-[var(--text-secondary)]';

  return (
    <div className={`flex items-center justify-between py-2 ${isBold ? 'mt-1' : ''}`}>
      <span
        className={`text-sm ${
          isBold ? 'font-semibold text-[var(--text-primary)]' : 'font-normal text-[var(--text-secondary)]'
        }`}
      >
        {label}
      </span>
      <span
        className={`font-mono text-sm transition-all duration-500 ${
          isBold ? 'font-bold' : 'font-medium'
        } ${isHighlight ? 'text-base' : ''} ${valueColor}`}
      >
        {formatINR(value)}
      </span>
    </div>
  );
}

export function CapitalGainsCard({
  title,
  variant,
  stcgProfits,
  stcgLosses,
  stcgNet,
  ltcgProfits,
  ltcgLosses,
  ltcgNet,
  realisedGains,
  isLoading,
  error,
  onRetry,
}: CapitalGainsCardProps) {
  const isAfter = variant === 'after';

  const cardBg = isAfter
    ? 'bg-[var(--card-bg-after)] border-blue-500/30'
    : 'bg-[var(--card-bg-pre)] border-[var(--border-color)]';

  const sectionBg = isAfter ? 'bg-white/5' : 'bg-[var(--bg-tertiary)]';
  const dividerColor = isAfter ? 'border-white/20' : 'border-[var(--border-color)]';
  const headingColor = isAfter ? 'text-white' : 'text-[var(--text-primary)]';

  if (isLoading) {
    return (
      <div className="flex-1 min-w-0">
        <CardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex-1 min-w-0 rounded-2xl border ${cardBg} p-6 flex flex-col items-center justify-center gap-4 min-h-[280px]`}
      >
        <div className="text-red-400 text-center">
          <p className="font-semibold mb-1 text-[var(--text-primary)]">Failed to load data</p>
          <p className="text-sm text-[var(--text-secondary)]">{error}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-5 py-2 rounded-lg bg-[var(--button-bg)] hover:bg-[var(--button-hover)] text-[var(--text-primary)] text-sm font-medium transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex-1 min-w-0 rounded-lg border ${cardBg} p-5 space-y-4`}
    >
      {/* Title */}
      <h2 className={`text-base font-semibold ${headingColor} tracking-tight`}>{title}</h2>

      {/* Short-Term Capital Gains */}
      <div className="space-y-0.5">
        <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
          isAfter ? 'text-white/80' : 'text-[var(--text-muted)]'
        }`}>
          Short-term
        </p>
        <GainRowItem label="Profits" value={stcgProfits} />
        <GainRowItem label="Losses" value={-stcgLosses} />
        <GainRowItem label="Net Capital Gains" value={stcgNet} isBold />
      </div>

      {/* Long-Term Capital Gains */}
      <div className="space-y-0.5">
        <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
          isAfter ? 'text-white/80' : 'text-[var(--text-muted)]'
        }`}>
          Long-term
        </p>
        <GainRowItem label="Profits" value={ltcgProfits} />
        <GainRowItem label="Losses" value={-ltcgLosses} />
        <GainRowItem label="Net Capital Gains" value={ltcgNet} isBold />
      </div>

      {/* Realised Capital Gains */}
      <div className={`border-t ${dividerColor} pt-3`}>
        <div className="flex items-center justify-between">
          <span className={`font-semibold text-sm ${headingColor}`}>
            {isAfter ? 'Effective Capital Gains:' : 'Realised Capital Gains:'}
          </span>
          <span
            className={`font-mono font-bold text-xl transition-all duration-500 ${
              realisedGains < 0 ? 'text-red-500' : realisedGains > 0 ? (isAfter ? 'text-white' : 'text-emerald-500') : 'text-[var(--text-secondary)]'
            }`}
          >
            {formatINR(realisedGains)}
          </span>
        </div>
      </div>
    </div>
  );
}
