'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatCurrency } from '@/lib/utils';
import { ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransferRumorCardProps {
  rumor: {
    _id: string;
    player?: {
      _id: string;
      fullName: string;
      photo?: string;
    };
    fromClub?: {
      _id: string;
      name: string;
      logo?: string;
    };
    toClub: {
      _id: string;
      name: string;
      logo?: string;
    };
    probability: number;
    voteCount?: number;
    upvotes?: number;
    downvotes?: number;
    estimatedFee?: number;
    status: 'active' | 'confirmed' | 'denied' | 'expired';
    userVote?: 'believe' | 'disbelieve';
  };
  onVote?: (rumorId: string, vote: 'believe' | 'disbelieve') => void;
  voting?: boolean;
  className?: string;
}

function TransferRumorCardComponent({ rumor, onVote, voting = false, className }: TransferRumorCardProps) {
  // Get probability color gradient
  const getProbabilityColor = (prob: number) => {
    if (prob <= 30) {
      return 'from-red-500 to-orange-500';
    } else if (prob <= 70) {
      return 'from-orange-500 to-yellow-500';
    } else {
      return 'from-yellow-500 to-tm-green';
    }
  };

  return (
    <Card className={cn(
      'bg-white border border-gray-200 rounded-lg overflow-hidden',
      'hover:border-tm-green/50 hover:shadow-md transition-all duration-200',
      className
    )}>
      {/* Player Info */}
      <CardHeader className="p-4 pb-3">
        <div className="flex items-center gap-3">
          {rumor.player?.photo ? (
            <Avatar className="h-12 w-12 border-2 border-gray-200">
              <AvatarImage src={rumor.player.photo} loading="lazy" />
              <AvatarFallback className="bg-gray-100 text-gray-600">
                {rumor.player.fullName[0]}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-2xl">⚽</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <Link href={`/rumors/${rumor._id}`}>
              <h4 className="font-bold text-gray-900 text-base hover:text-tm-green transition-colors">
                {rumor.player?.fullName || 'بازیکن نامشخص'}
              </h4>
            </Link>
            {rumor.player && (
              <p className="text-xs text-gray-500 mt-0.5">
                {rumor.fromClub?.name || 'آزاد'}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Transfer Direction */}
      <CardContent className="px-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          {rumor.fromClub ? (
            <>
              <div className="flex flex-col items-center gap-1 flex-1">
                {rumor.fromClub.logo ? (
                  <img
                    src={rumor.fromClub.logo}
                    alt={rumor.fromClub.name}
                    className="h-10 w-10 object-contain"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-lg">🏟️</span>
                  </div>
                )}
                <span className="text-xs font-medium text-gray-700 text-center">
                  {rumor.fromClub.name}
                </span>
              </div>
              <ArrowRight className="h-6 w-6 text-tm-green mx-2 flex-shrink-0" />
            </>
          ) : (
            <div className="flex-1" />
          )}
          <div className="flex flex-col items-center gap-1 flex-1">
            {rumor.toClub.logo ? (
              <img
                src={rumor.toClub.logo}
                alt={rumor.toClub.name}
                className="h-10 w-10 object-contain"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-lg">🏟️</span>
              </div>
            )}
            <span className="text-xs font-medium text-gray-700 text-center">
              {rumor.toClub.name}
            </span>
          </div>
        </div>

        {/* Probability Meter - HERO */}
        <div className="space-y-2 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">احتمال انتقال</span>
            <span className="text-3xl font-bold font-mono text-tm-green" dir="ltr">
              {rumor.probability}%
            </span>
          </div>

          {/* Progress Bar with Gradient */}
          <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn(
                'absolute inset-y-0 right-0 bg-gradient-to-l transition-all duration-500',
                getProbabilityColor(rumor.probability)
              )}
              style={{ width: `${rumor.probability}%` }}
            />
          </div>

          {rumor.voteCount !== undefined && rumor.voteCount > 0 && (
            <p className="text-xs text-gray-500 text-center">
              بر اساس {rumor.voteCount} رأی کاربران
            </p>
          )}
        </div>

        {/* Estimated Fee */}
        {rumor.estimatedFee && (
          <div className="mt-3 p-2 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">حق‌الزحمه تخمینی</p>
            <p className="text-base font-bold text-gray-900" dir="ltr">
              {formatCurrency(rumor.estimatedFee)}
            </p>
          </div>
        )}
      </CardContent>

      {/* Footer: Vote Buttons */}
      {rumor.status === 'active' && onVote && (
        <CardFooter className="border-t border-gray-100 p-3 bg-gray-50/50">
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button
              variant={rumor.userVote === 'believe' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onVote(rumor._id, 'believe')}
              disabled={voting}
              className={cn(
                rumor.userVote === 'believe'
                  ? 'bg-tm-green hover:bg-tm-green/90 text-white'
                  : 'border-gray-300 hover:border-tm-green hover:text-tm-green'
              )}
            >
              <CheckCircle className="h-4 w-4 ml-1" />
              باور دارم
            </Button>
            <Button
              variant={rumor.userVote === 'disbelieve' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onVote(rumor._id, 'disbelieve')}
              disabled={voting}
              className={cn(
                rumor.userVote === 'disbelieve'
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'border-gray-300 hover:border-red-500 hover:text-red-500'
              )}
            >
              <XCircle className="h-4 w-4 ml-1" />
              باور ندارم
            </Button>
          </div>
          {(rumor.upvotes !== undefined || rumor.downvotes !== undefined) && (
            <div className="flex items-center justify-center gap-2 mt-2 w-full text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-tm-green" />
                {rumor.upvotes || 0} موافق
              </span>
              <span className="mx-1">•</span>
              <span className="flex items-center gap-1">
                <XCircle className="h-3 w-3 text-red-500" />
                {rumor.downvotes || 0} مخالف
              </span>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

export const TransferRumorCard = memo(TransferRumorCardComponent);

