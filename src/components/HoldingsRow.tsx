import React, { useState } from 'react';
import type { Holding } from '../types';
import { formatINR, formatHolding, formatPrice, formatGain } from '../utils/formatCurrency';
import { getHoldingId } from '../utils/calculations';

interface HoldingsRowProps {
  holding: Holding;
  isSelected: boolean;
  onToggle: (id: string) => void;
  index: number;
}

export function HoldingsRow({ holding, isSelected, onToggle, index }: HoldingsRowProps) {
  const [imgError, setImgError] = useState(false);
  const holdingId = getHoldingId(holding);

  const stcgPositive = holding.stcg.gain >= 0;
  const ltcgPositive = holding.ltcg.gain >= 0;

  return (
    <tr
      className={`
        border-b border-[var(--border-color)] transition-all duration-200 ease-in-out cursor-pointer
        ${isSelected
          ? 'bg-blue-500/10 hover:bg-blue-500/15'
          : 'hover:bg-[var(--button-hover)]'
        }
        group
      `}
      onClick={() => onToggle(holdingId)}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Checkbox */}
      <td className="py-4 pl-4 pr-2 w-12">
        <div
          className={`
            w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200
            ${isSelected
              ? 'bg-blue-500 border-blue-500'
              : 'border-[var(--text-muted)] group-hover:border-[var(--text-secondary)]'
            }
          `}
          role="checkbox"
          aria-checked={isSelected}
          aria-label={`Select ${holding.coin}`}
        >
          {isSelected && (
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
              <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          )}
        </div>
      </td>

      {/* Asset */}
      <td className="py-4 px-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            {!imgError ? (
              <img
                src={holding.logo}
                alt={holding.coin}
                className="w-9 h-9 rounded-full object-cover bg-[var(--bg-tertiary)] ring-1 ring-[var(--border-color)]"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/40 to-[var(--bg-tertiary)] flex items-center justify-center ring-1 ring-[var(--border-color)]">
                <span className="text-xs font-bold text-[var(--text-secondary)]">
                  {holding.coin.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[var(--text-primary)] leading-tight truncate">{holding.coin}</p>
            <p className="text-xs text-[var(--text-muted)] leading-tight truncate max-w-[140px]">
              {holding.coinName}
            </p>
          </div>
        </div>
      </td>

      {/* Holdings & Avg Buy Price */}
      <td className="py-4 px-3">
        <div>
          <p className="text-sm font-mono text-[var(--text-primary)]">{formatHolding(holding.totalHolding)}</p>
          <p className="text-xs font-mono text-[var(--text-muted)]">
            Avg: {formatPrice(holding.averageBuyPrice)}
          </p>
        </div>
      </td>

      {/* Current Price */}
      <td className="py-4 px-3">
        <span className="text-sm font-mono text-[var(--text-primary)]">{formatPrice(holding.currentPrice)}</span>
      </td>

      {/* Short-Term Gain */}
      <td className="py-4 px-3">
        <div>
          <p
            className={`text-sm font-mono font-semibold transition-colors duration-300 ${
              stcgPositive ? 'text-emerald-500' : 'text-red-500'
            }`}
          >
            {formatGain(holding.stcg.gain)}
          </p>
          <p className="text-xs font-mono text-[var(--text-muted)]">
            {formatHolding(holding.stcg.balance)} {holding.coin}
          </p>
        </div>
      </td>

      {/* Long-Term Gain */}
      <td className="py-4 px-3">
        <div>
          <p
            className={`text-sm font-mono font-semibold transition-colors duration-300 ${
              ltcgPositive ? 'text-emerald-500' : 'text-red-500'
            }`}
          >
            {formatGain(holding.ltcg.gain)}
          </p>
          <p className="text-xs font-mono text-[var(--text-muted)]">
            {formatHolding(holding.ltcg.balance)} {holding.coin}
          </p>
        </div>
      </td>

      {/* Amount to Sell */}
      <td className="py-4 px-3">
        {isSelected ? (
          <span className="text-sm font-mono text-blue-500 font-semibold">
            {formatHolding(holding.totalHolding)}
          </span>
        ) : (
          <span className="text-[var(--text-muted)] text-sm">—</span>
        )}
      </td>
    </tr>
  );
}
