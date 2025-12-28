'use client';

import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendIndicatorProps {
  change: number;
  className?: string;
}

export function TrendIndicator({ change, className }: TrendIndicatorProps) {
  if (change > 0) {
    return (
      <span className={cn('flex items-center gap-1 text-green-600 font-medium', className)}>
        <ArrowUp className="h-3.5 w-3.5" />
        <span className="text-xs" dir="ltr">{change}</span>
      </span>
    );
  }

  if (change < 0) {
    return (
      <span className={cn('flex items-center gap-1 text-red-600 font-medium', className)}>
        <ArrowDown className="h-3.5 w-3.5" />
        <span className="text-xs" dir="ltr">{Math.abs(change)}</span>
      </span>
    );
  }

  return (
    <span className={cn('text-gray-400', className)}>
      <Minus className="h-3.5 w-3.5" />
    </span>
  );
}

