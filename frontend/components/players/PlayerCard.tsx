'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Target, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayerCardProps {
  player: {
    _id: string;
    fullName: string;
    position: string;
    photo?: string;
    currentClub?: {
      name: string;
      logo?: string;
    };
    marketValue: number;
    marketValueVoteCount?: number;
    stats?: {
      goals?: number;
      assists?: number;
      appearances?: number;
    };
  };
  onVote?: (playerId: string) => void;
  className?: string;
}

const positionLabels: { [key: string]: string } = {
  GK: 'دروازه‌بان',
  DF: 'مدافع',
  MF: 'هافبک',
  FW: 'مهاجم',
};

const positionColors: { [key: string]: string } = {
  GK: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  DF: 'bg-blue-100 text-blue-700 border-blue-300',
  MF: 'bg-green-100 text-green-700 border-green-300',
  FW: 'bg-red-100 text-red-700 border-red-300',
};

function PlayerCardComponent({ player, onVote, className }: PlayerCardProps) {
  const positionColor = positionColors[player.position] || 'bg-gray-100 text-gray-700 border-gray-300';

  return (
    <Card className={cn(
      'bg-white border border-gray-200 rounded-lg overflow-hidden',
      'hover:border-tm-green/50 hover:shadow-md transition-all duration-200',
      className
    )}>
      {/* Header: Small, Subtle */}
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          {player.currentClub && (
            <Badge variant="outline" className="text-xs border-gray-300">
              {player.currentClub.name}
            </Badge>
          )}
          <Badge variant="outline" className={cn('text-xs', positionColor)}>
            {positionLabels[player.position] || player.position}
          </Badge>
        </div>
      </CardHeader>

      {/* Image: Hero Element */}
      <div className="relative h-48 bg-gray-100">
        {player.photo ? (
          <Image
            src={player.photo}
            alt={player.fullName}
            fill
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-6xl">⚽</span>
          </div>
        )}
        
        {/* Market Value Badge - Absolute positioned */}
        <div className="absolute bottom-2 right-2">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md border border-gray-200">
            <p className="text-xs text-gray-600 mb-0.5">ارزش بازاری</p>
            <p className="text-lg font-bold text-tm-green" dir="ltr">
              {formatCurrency(player.marketValue || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Content: Focus Area */}
      <CardContent className="p-4">
        <Link href={`/players/${player._id}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-1 text-right hover:text-tm-green transition-colors">
            {player.fullName}
          </h3>
        </Link>
        {player.currentClub && (
          <p className="text-sm text-gray-500 text-right mb-3">
            {player.currentClub.name}
          </p>
        )}

        {/* Stats Grid */}
        {player.stats && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
              <Target className="h-4 w-4 text-gray-600 mb-1" />
              <span className="text-sm font-bold text-gray-900" dir="ltr">
                {player.stats.goals || 0}
              </span>
              <span className="text-[10px] text-gray-500">گل</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
              <TrendingUp className="h-4 w-4 text-gray-600 mb-1" />
              <span className="text-sm font-bold text-gray-900" dir="ltr">
                {player.stats.assists || 0}
              </span>
              <span className="text-[10px] text-gray-500">پاس گل</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
              <Activity className="h-4 w-4 text-gray-600 mb-1" />
              <span className="text-sm font-bold text-gray-900" dir="ltr">
                {player.stats.appearances || 0}
              </span>
              <span className="text-[10px] text-gray-500">بازی</span>
            </div>
          </div>
        )}
      </CardContent>

      {/* Footer: Actions */}
      <CardFooter className="border-t border-gray-100 p-3 bg-gray-50/50">
        {onVote ? (
          <Button
            variant="default"
            size="sm"
            className="w-full bg-tm-green hover:bg-tm-green/90 text-white"
            onClick={() => onVote(player._id)}
          >
            <TrendingUp className="h-4 w-4 ml-2" />
            رأی به ارزش بازار
          </Button>
        ) : (
          <Link href={`/players/${player._id}`} className="w-full">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-tm-green text-tm-green hover:bg-tm-green hover:text-white"
            >
              مشاهده جزئیات
            </Button>
          </Link>
        )}
        {player.marketValueVoteCount !== undefined && player.marketValueVoteCount > 0 && (
          <p className="text-xs text-gray-500 mt-2 text-center w-full">
            {player.marketValueVoteCount} رأی
          </p>
        )}
      </CardFooter>
    </Card>
  );
}

export const PlayerCard = memo(PlayerCardComponent);

