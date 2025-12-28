'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  action?: ReactNode;
  centered?: boolean;
}

export function SectionHeader({ title, subtitle, icon, action, centered = false }: SectionHeaderProps) {
  return (
    <div className={cn('mb-6', centered && 'text-center')}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className={cn('flex items-center gap-3', centered && 'mx-auto')}>
          {icon && <span className="text-3xl">{icon}</span>}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900" dir="rtl">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm md:text-base text-gray-600 mt-1" dir="rtl">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action && <div className={cn(centered && 'w-full flex justify-center')}>{action}</div>}
      </div>
    </div>
  );
}

