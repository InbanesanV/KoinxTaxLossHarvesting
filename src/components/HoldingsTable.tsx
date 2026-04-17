import { useState, useMemo } from 'react';
import { useHoldings } from '../hooks/useHoldings';
import { useHarvesting } from '../context/HarvestingContext';
import { HoldingsRow } from './HoldingsRow';
import { TableRowSkeleton } from './Loader';
import { getHoldingId } from '../utils/calculations';

const INITIAL_ROWS = 5;

type SortField = 'stcg' | 'ltcg' | null;
type SortDirection = 'asc' | 'desc';

const COLUMN_HEADERS = [
  { label: 'Asset', sortable: false },
  { label: 'Holdings & Avg Buy Price', sortable: false },
  { label: 'Current Price', sortable: false },
  { label: 'Short-Term Gain', sortable: true, field: 'stcg' as const },
  { label: 'Long-Term Gain', sortable: true, field: 'ltcg' as const },
  { label: 'Amount to Sell', sortable: false },
];

export function HoldingsTable() {
  const { sortedHoldings, isLoading, error, refetch } = useHoldings();
  const { state, dispatch } = useHarvesting();
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedAndFilteredHoldings = useMemo(() => {
    if (!sortField) return sortedHoldings;

    return [...sortedHoldings].sort((a, b) => {
      const aValue = a[sortField].gain;
      const bValue = b[sortField].gain;
      
      if (sortDirection === 'asc') {
        return aValue - bValue;
      }
      return bValue - aValue;
    });
  }, [sortedHoldings, sortField, sortDirection]);

  const displayedHoldings = state.showAll
    ? sortedAndFilteredHoldings
    : sortedAndFilteredHoldings.slice(0, INITIAL_ROWS);

  const allIds = sortedHoldings.map(getHoldingId);
  const selectedCount = state.selectedHoldings.size;
  const allSelected = allIds.length > 0 && allIds.every((id) => state.selectedHoldings.has(id));
  const someSelected = selectedCount > 0 && !allSelected;

  const handleMasterCheckbox = () => {
    if (allSelected) {
      dispatch({ type: 'DESELECT_ALL' });
    } else {
      dispatch({ type: 'SELECT_ALL' });
    }
  };

  const handleToggle = (id: string) => {
    dispatch({ type: 'TOGGLE_HOLDING', payload: id });
  };

  const handleSort = (field: SortField) => {
    if (!field) return;
    
    if (sortField === field) {
      if (sortDirection === 'desc') {
        setSortDirection('asc');
      } else {
        setSortField(null);
        setSortDirection('desc');
      }
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  if (error) {
    return (
      <div className="rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] p-10 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-semibold text-[var(--text-primary)] mb-1">Failed to load holdings</p>
          <p className="text-sm text-[var(--text-secondary)]">{error}</p>
        </div>
        <button
          onClick={refetch}
          className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] overflow-hidden">
      {/* Table header */}
      <div className="px-5 py-3 border-b border-[var(--border-color)] flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-[var(--text-primary)] text-base">Holdings</h3>
        </div>
        {selectedCount > 0 && (
          <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
            {selectedCount} selected
          </span>
        )}
      </div>

      {/* Scrollable table container */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]">
              {/* Master checkbox */}
              <th className="py-3 pl-4 pr-2 w-12">
                <div
                  className={`
                    w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200
                    ${allSelected
                      ? 'bg-blue-500 border-blue-500'
                      : someSelected
                      ? 'bg-blue-500/50 border-blue-500/70'
                      : 'border-[var(--text-muted)] hover:border-[var(--text-secondary)]'
                    }
                  `}
                  onClick={handleMasterCheckbox}
                  role="checkbox"
                  aria-checked={allSelected ? true : someSelected ? 'mixed' : false}
                  aria-label="Select all holdings"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleMasterCheckbox()}
                >
                  {(allSelected || someSelected) && (
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                      {allSelected ? (
                        <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      ) : (
                        <path d="M2 6h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                      )}
                    </svg>
                  )}
                </div>
              </th>
              {COLUMN_HEADERS.map((header) => (
                <th
                  key={header.label}
                  className={`py-3 px-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest whitespace-nowrap ${
                    header.sortable ? 'cursor-pointer hover:text-[var(--text-secondary)] select-none' : ''
                  }`}
                  onClick={() => header.sortable && handleSort(header.field || null)}
                >
                  <div className="flex items-center gap-1.5">
                    {header.label}
                    {header.sortable && (
                      <div className="flex flex-col">
                        {sortField === header.field ? (
                          sortDirection === 'desc' ? (
                            <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
                            </svg>
                          )
                        ) : (
                          <svg className="w-3 h-3 text-[var(--text-muted)]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 10l5-5 5 5H5z" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: INITIAL_ROWS }).map((_, i) => (
                  <TableRowSkeleton key={i} />
                ))
              : displayedHoldings.map((holding, index) => (
                  <HoldingsRow
                    key={getHoldingId(holding)}
                    holding={holding}
                    isSelected={state.selectedHoldings.has(getHoldingId(holding))}
                    onToggle={handleToggle}
                    index={index}
                  />
                ))}
          </tbody>
        </table>
      </div>

      {/* View All / View Less toggle */}
      {!isLoading && sortedHoldings.length > INITIAL_ROWS && (
        <div className="border-t border-[var(--border-color)] p-3 flex justify-start">
          <button
            id="toggle-view-all"
            onClick={() => dispatch({ type: 'TOGGLE_VIEW_ALL' })}
            className="
              text-sm font-medium text-blue-400 hover:text-blue-300
              transition-colors
            "
          >
            {state.showAll ? 'View less' : 'View all'}
          </button>
        </div>
      )}
    </div>
  );
}
