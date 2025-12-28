'use client';

import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Heart, TrendingUp, Award } from 'lucide-react';
import type { UserStats } from '@/types/user';

interface UserStatsGridProps {
  stats: UserStats;
}

export function UserStatsGrid({ stats }: UserStatsGridProps) {
  const statItems = [
    {
      label: 'نظرات',
      value: stats.totalComments,
      icon: MessageSquare,
      color: 'text-tm-green',
      bgColor: 'bg-tm-green/10',
    },
    {
      label: 'لایک‌های دریافت شده',
      value: stats.likesReceived,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'رأی‌ها',
      value: stats.totalVotes,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'نشان‌ها',
      value: stats.totalBadges,
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="border-gray-200 hover:border-tm-green/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center space-x-reverse space-x-3">
                <div className={`p-2 rounded-lg ${item.bgColor} flex-shrink-0`}>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  <p className="text-xs text-gray-600 mt-1">{item.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

