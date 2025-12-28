'use client';

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getTitleInfo } from '@/types/user';
import type { UserTitle } from '@/types/user';
import { cn } from '@/lib/utils';

interface UserTitleBadgeProps {
  title: UserTitle;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  reputation?: number;
  level?: number;
}

// Color scheme for titles
const TITLE_COLORS: Partial<Record<UserTitle, { bg: string; text: string; border: string }>> = {
  'تازه‌وارد': {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300',
  },
  'تحلیل‌گر': {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    border: 'border-orange-300',
  },
  'شایعه‌باز': {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-300',
  },
  'Guru نقل‌وانتقالات': {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-300',
  },
  'Expert': {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-300',
  },
  'Master': {
    bg: 'bg-indigo-100',
    text: 'text-indigo-700',
    border: 'border-indigo-300',
  },
  'Veteran': {
    bg: 'bg-teal-100',
    text: 'text-teal-700',
    border: 'border-teal-300',
  },
  'Legend': {
    bg: 'bg-gradient-to-r from-yellow-100 to-amber-100',
    text: 'text-yellow-800',
    border: 'border-yellow-400',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

export function UserTitleBadge({ title, size = 'md', showTooltip = false, reputation, level }: UserTitleBadgeProps) {
  const titleInfo = getTitleInfo(title);
  const colors = TITLE_COLORS[title] || TITLE_COLORS['تازه‌وارد'] || {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300',
  };

  const badgeContent = (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1.5 border-2',
        colors.bg,
        colors.text,
        colors.border,
        sizeClasses[size]
      )}
    >
      <span>{titleInfo.emoji}</span>
      <span>{titleInfo.title}</span>
    </Badge>
  );

  if (showTooltip && (reputation !== undefined || level !== undefined)) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badgeContent}
          </TooltipTrigger>
          <TooltipContent className="bg-white border border-gray-200 shadow-lg p-4 max-w-xs">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">امتیاز اعتبار</p>
                <p className="text-2xl font-bold text-gray-900" dir="ltr">
                  {reputation?.toLocaleString('fa-IR') || 0}
                </p>
              </div>
              {level !== undefined && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-500">سطح</p>
                    <p className="font-bold text-gray-900" dir="ltr">{level}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">عنوان</p>
                    <p className="font-medium text-gray-900">{titleInfo.title}</p>
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-600 leading-relaxed">
                {titleInfo.description}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badgeContent;
}
