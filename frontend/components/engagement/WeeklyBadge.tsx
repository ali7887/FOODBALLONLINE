'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Award } from 'lucide-react';
import { useMemo } from 'react';

interface WeeklyBadgeProps {
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    earned: boolean;
    timeRemaining?: number; // seconds until week ends
  } | null;
}

export function WeeklyBadge({ badge }: WeeklyBadgeProps) {
  const timeRemaining = useMemo(() => {
    if (!badge?.timeRemaining) return null;
    const days = Math.floor(badge.timeRemaining / 86400);
    const hours = Math.floor((badge.timeRemaining % 86400) / 3600);
    return { days, hours };
  }, [badge?.timeRemaining]);

  if (!badge) {
    return null;
  }

  const rarityColors = {
    common: 'border-gray-300 bg-gray-50',
    rare: 'border-blue-400 bg-blue-50',
    epic: 'border-purple-400 bg-purple-50',
    legendary: 'border-yellow-400 bg-yellow-50',
  };

  const rarityLabels = {
    common: 'معمولی',
    rare: 'نادر',
    epic: 'حماسی',
    legendary: 'افسانهای',
  };

  return (
    <Card className={`border-2 ${badge.earned ? 'border-tm-green' : rarityColors[badge.rarity]}`}>
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-reverse space-x-2">
            <Award className="h-5 w-5 text-tm-green" />
            <CardTitle className="text-gray-900">نشان هفتگی</CardTitle>
          </div>
          <Badge className="bg-tm-green text-white border-0">
            این هفته
          </Badge>
        </div>
        <CardDescription className="mt-1">
          نشان محدود این هفته را کسب کن
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="text-6xl mb-2">{badge.icon || '🏆'}</div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">{badge.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
            <Badge
              variant="outline"
              className={`text-xs ${rarityColors[badge.rarity]}`}
            >
              {rarityLabels[badge.rarity]}
            </Badge>
          </div>

          {badge.earned ? (
            <div className="w-full pt-4 border-t border-gray-200">
              <Badge className="bg-tm-green text-white w-full justify-center py-2">
                <Award className="h-4 w-4 ml-1" />
                کسب شده!
              </Badge>
            </div>
          ) : (
            <div className="w-full pt-4 border-t border-gray-200 space-y-3">
              {timeRemaining && (
                <div className="flex items-center justify-center space-x-reverse space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    {timeRemaining.days > 0
                      ? `${timeRemaining.days} روز و ${timeRemaining.hours} ساعت باقی مانده`
                      : `${timeRemaining.hours} ساعت باقی مانده`}
                  </span>
                </div>
              )}
              <p className="text-xs text-gray-500">
                برای کسب این نشان، فعالیت‌های هفتگی‌ات رو انجام بده
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

