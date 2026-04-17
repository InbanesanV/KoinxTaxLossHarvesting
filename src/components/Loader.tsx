interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`rounded-lg bg-gradient-to-r from-navy-700 via-navy-600 to-navy-700 bg-[length:200%_100%] animate-skeleton ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-navy-700 p-6 space-y-4 animate-fade-in">
      <Skeleton className="h-6 w-40" />
      <div className="space-y-3 mt-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="border-t border-white/10 pt-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-28" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-white/5">
      <td className="py-4 px-4">
        <Skeleton className="h-4 w-4 rounded" />
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="space-y-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-14" />
        </div>
      </td>
      <td className="py-4 px-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="py-4 px-4">
        <div className="space-y-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-14" />
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="space-y-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-14" />
        </div>
      </td>
      <td className="py-4 px-4">
        <Skeleton className="h-4 w-16" />
      </td>
    </tr>
  );
}

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ size = 'md' }: SpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };
  return (
    <div
      className={`${sizes[size]} rounded-full border-white/20 border-t-blue-harvest animate-spin`}
    />
  );
}
