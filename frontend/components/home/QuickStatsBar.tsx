'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';

interface QuickStatsBarProps {
  stats: {
    totalPlayers: number;
    totalVotes: number;
    activeUsers: number;
    hotRumors: number;
  };
}

function StatItem({
  icon,
  value,
  label,
  color,
  badge,
}: {
  icon: string;
  value: number;
  label: string;
  color: string;
  badge?: string;
}) {
  return (
    <div className="text-center relative">
      <div className="text-3xl mb-2">{icon}</div>
      <div className={cn('text-2xl md:text-3xl font-bold font-mono mb-1', color)} dir="ltr">
        {value.toLocaleString('fa-IR')}
      </div>
      <div className="text-sm text-gray-600" dir="rtl">
        {label}
      </div>
      {badge && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
}

function QuickStatsBarComponent({ stats }: QuickStatsBarProps) {
  return (
    <section className="py-8 bg-gradient-to-r from-gray-50 to-gray-100 border-y border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <StatItem
            icon="⚽"
            value={stats.totalPlayers}
            label="بازیکن"
            color="text-tm-green"
          />
          <StatItem
            icon="🗳️"
            value={stats.totalVotes}
            label="رأی ثبت‌شده"
            color="text-blue-600"
          />
          <StatItem
            icon="👥"
            value={stats.activeUsers}
            label="کاربر فعال"
            color="text-purple-600"
            badge="امروز"
          />
          <StatItem
            icon="🔥"
            value={stats.hotRumors}
            label="شایعه داغ"
            color="text-red-500"
            badge="جدید"
          />
        </div>
      </div>
    </section>
  );
}

export const QuickStatsBar = memo(QuickStatsBarComponent);

