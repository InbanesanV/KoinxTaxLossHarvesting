import { formatINR } from '../utils/formatCurrency';

interface SavingsBannerProps {
  savings: number;
  visible: boolean;
}

export function SavingsBanner({ savings, visible }: SavingsBannerProps) {
  if (!visible || savings <= 0) return null;

  return (
    <div
      className="flex items-center gap-2 bg-blue-600 rounded-lg px-4 py-2.5 text-white"
      role="status"
      aria-live="polite"
    >
      <span className="text-lg" role="img" aria-label="celebration">🎉</span>
      <p className="text-sm font-medium">
        You are going to save upto{' '}
        <span className="font-bold">
          {formatINR(savings)}
        </span>
      </p>
    </div>
  );
}
