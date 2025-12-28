'use client';

import { Badge } from '@/components/ui/badge';
import { getTitleInfo } from '@/types/user';
import type { UserTitle } from '@/types/user';

interface UserTitleBadgeProps {
  title: UserTitle;
  size?: 'sm' | 'md' | 'lg';
}

export function UserTitleBadge({ title, size = 'md' }: UserTitleBadgeProps) {
  const titleInfo = getTitleInfo(title);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <Badge
      variant="outline"
      className={`bg-tm-green/10 text-tm-green border-tm-green/30 ${sizeClasses[size]}`}
      title={titleInfo.description}
    >
      <span className="ml-1">{titleInfo.emoji}</span>
      <span>{titleInfo.title}</span>
    </Badge>
  );
}

