'use client';

import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { PersonalizedFeedItem } from '@/types/feed';
import { formatDistanceToNow } from 'date-fns';
import { faIR } from 'date-fns/locale';
import {
  User,
  Users,
  TrendingUp,
  Newspaper,
  Activity,
  ArrowRight,
  Calendar,
} from 'lucide-react';

interface FeedItemRendererProps {
  item: PersonalizedFeedItem;
}

function FeedItemRendererComponent({ item }: FeedItemRendererProps) {
  const timeAgo = formatDistanceToNow(new Date(item.metadata.createdAt), {
    addSuffix: true,
    locale: faIR,
  });

  const getTypeIcon = () => {
    const iconMap = {
      player: User,
      team: Users,
      rumor: TrendingUp,
      news: Newspaper,
      activity: Activity,
    };
    return iconMap[item.type] || Activity;
  };

  const getTypeColor = () => {
    const colorMap = {
      player: 'bg-blue-100 text-blue-700 border-blue-300',
      team: 'bg-purple-100 text-purple-700 border-purple-300',
      rumor: 'bg-tm-green/10 text-tm-green border-tm-green/30',
      news: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      activity: 'bg-gray-100 text-gray-700 border-gray-300',
    };
    return colorMap[item.type] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getItemLink = () => {
    switch (item.type) {
      case 'player':
        return `/players/${item.data.type === 'player' ? item.data.playerId : '#'}`;
      case 'team':
        return `/teams/${item.data.type === 'team' ? item.data.teamId : '#'}`;
      case 'rumor':
        return `/rumors/${item.data.type === 'rumor' ? item.data.rumorId : '#'}`;
      case 'news':
        return item.data.type === 'news' && item.data.url ? item.data.url : '#';
      default:
        return '#';
    }
  };

  const renderItemContent = () => {
    switch (item.data.type) {
      case 'player':
        const playerData = item.data;
        return (
          <div>
            <p className="text-sm text-gray-700 mb-2">
              {playerData.action === 'transfer' && 'انتقال جدید'}
              {playerData.action === 'rumor' && 'شایعه جدید'}
              {playerData.action === 'update' && 'به‌روزرسانی'}
              {playerData.action === 'milestone' && 'دستاورد'}
              {' برای '}
              <span className="font-semibold text-gray-900">{playerData.playerName}</span>
            </p>
          </div>
        );

      case 'team':
        const teamData = item.data;
        return (
          <div>
            <p className="text-sm text-gray-700 mb-2">
              {teamData.action === 'transfer' && 'انتقال جدید'}
              {teamData.action === 'rumor' && 'شایعه جدید'}
              {teamData.action === 'match' && 'مسابقه جدید'}
              {teamData.action === 'update' && 'به‌روزرسانی'}
              {' برای '}
              <span className="font-semibold text-gray-900">{teamData.teamName}</span>
            </p>
          </div>
        );

      case 'rumor':
        const rumorData = item.data;
        return (
          <div>
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold text-gray-900">{rumorData.playerName}</span>
              {rumorData.fromClub && ` از ${rumorData.fromClub}`}
              {rumorData.toClub && ` به ${rumorData.toClub}`}
              {rumorData.probability !== undefined && (
                <span className="mr-2 text-tm-green font-medium">
                  ({rumorData.probability}% احتمال)
                </span>
              )}
            </p>
          </div>
        );

      case 'news':
        return (
          <div>
            <p className="text-sm text-gray-700 mb-2">{item.description}</p>
          </div>
        );

      case 'activity':
        const activityData = item.data;
        return (
          <div>
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold text-gray-900">{activityData.userName}</span>
              {' '}
              {item.description}
            </p>
          </div>
        );

      default:
        return <p className="text-sm text-gray-700 mb-2">{item.description}</p>;
    }
  };

  const Icon = getTypeIcon();
  const typeColor = getTypeColor();
  const itemLink = getItemLink();

  return (
    <Card className="border-gray-200 hover:border-tm-green/50 transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start space-x-reverse space-x-3">
          {/* Type Icon */}
          <div className={`p-2 rounded-lg ${typeColor} flex-shrink-0`}>
            <Icon className="h-4 w-4" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-reverse space-x-2 mb-1 flex-wrap gap-1">
                  <Badge variant="outline" className={`text-xs ${typeColor}`}>
                    {item.type === 'player' && 'بازیکن'}
                    {item.type === 'team' && 'تیم'}
                    {item.type === 'rumor' && 'شایعه'}
                    {item.type === 'news' && 'خبر'}
                    {item.type === 'activity' && 'فعالیت'}
                  </Badge>
                  {item.source.type === 'player' && (
                    <Link
                      href={`/users/${item.source.id}`}
                      className="text-xs text-gray-600 hover:text-tm-green transition-colors"
                    >
                      {item.source.name}
                    </Link>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 text-base mb-1">{item.title}</h3>
              </div>
            </div>

            {/* Item-specific content */}
            {renderItemContent()}

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-reverse space-x-3 text-xs text-gray-500">
                <div className="flex items-center space-x-reverse space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{timeAgo}</span>
                </div>
                {item.metadata.relevanceScore !== undefined && (
                  <span className="text-tm-green font-medium">
                    مرتبط: {Math.round(item.metadata.relevanceScore * 100)}%
                  </span>
                )}
              </div>
              {itemLink !== '#' && (
                <Link
                  href={itemLink}
                  className="flex items-center space-x-reverse space-x-1 text-xs text-tm-green hover:text-tm-green/80 transition-colors"
                >
                  <span>مشاهده</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const FeedItemRenderer = memo(FeedItemRendererComponent);

