'use client';

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp, HelpCircle } from 'lucide-react';
import type { UserReputation } from '@/types/user';

interface ReputationBadgeProps {
  reputation: number;
  breakdown?: UserReputation['breakdown'];
  showTooltip?: boolean;
}

export function ReputationBadge({ reputation, breakdown, showTooltip = true }: ReputationBadgeProps) {
  const getReputationColor = (score: number) => {
    if (score >= 1000) return 'bg-purple-100 text-purple-700 border-purple-300';
    if (score >= 500) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    if (score >= 200) return 'bg-tm-green/10 text-tm-green border-tm-green/30';
    if (score >= 100) return 'bg-blue-100 text-blue-700 border-blue-300';
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const badge = (
    <Badge
      variant="outline"
      className={`flex items-center space-x-reverse space-x-1 ${getReputationColor(reputation)}`}
    >
      <TrendingUp className="h-3 w-3" />
      <span className="font-semibold">{reputation}</span>
      <span className="text-xs">امتیاز اعتبار</span>
    </Badge>
  );

  if (!showTooltip || !breakdown) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent className="max-w-xs" side="bottom">
          <div className="space-y-2 text-sm">
            <p className="font-semibold mb-2">محاسبه امتیاز اعتبار:</p>
            <div className="space-y-1">
              <p>• نظرات ارسال شده: {breakdown.commentsPosted} امتیاز</p>
              <p>• لایک‌های دریافت شده: {breakdown.likesReceived} امتیاز</p>
              <p>• نشان‌های کسب شده: {breakdown.badgesEarned} امتیاز</p>
              <p>• چالش‌های تکمیل شده: {breakdown.challengesCompleted} امتیاز</p>
              <p>• رتبه در جدول: {breakdown.leaderboardRank} امتیاز</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

