'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SectionHeader } from './SectionHeader';
import { UserTitleBadge } from '@/components/profile/UserTitleBadge';

interface LeaderboardPreviewProps {
  topUsers: Array<{
    _id: string;
    username: string;
    displayName?: string;
    avatar?: string;
    points: number;
    level?: number;
    title?: string;
    favoriteClub?: {
      name: string;
    };
  }>;
}

function PodiumUser({
  user,
  rank,
}: {
  user: LeaderboardPreviewProps['topUsers'][0];
  rank: number;
}) {
  const rankConfig = {
    1: { emoji: '🥇', bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600', height: 'h-32', pt: 'pt-4' },
    2: { emoji: '🥈', bg: 'bg-gradient-to-br from-gray-300 to-gray-500', height: 'h-24', pt: 'pt-8' },
    3: { emoji: '🥉', bg: 'bg-gradient-to-br from-amber-500 to-amber-700', height: 'h-20', pt: 'pt-12' },
  };

  const config = rankConfig[rank as keyof typeof rankConfig] || { emoji: '', bg: '', height: '', pt: '' };

  return (
    <div className="text-center">
      <div className={config.height} />
      <div className={`rounded-t-lg p-4 text-white ${config.bg}`}>
        <div className="text-3xl mb-2">{config.emoji}</div>
        <Avatar className="h-16 w-16 mx-auto mb-2 border-4 border-white">
          <AvatarImage src={user.avatar} loading="lazy" />
          <AvatarFallback className="bg-white text-gray-600">
            {user.displayName?.[0] || user.username[0]}
          </AvatarFallback>
        </Avatar>
        <p className="font-bold text-sm mb-1" dir="rtl">
          {user.displayName || user.username}
        </p>
        {user.title && (
          <UserTitleBadge title={user.title as any} size="sm" />
        )}
        <p className="text-2xl font-bold mt-2" dir="ltr">
          {user.points.toLocaleString('fa-IR')}
        </p>
      </div>
    </div>
  );
}

export function LeaderboardPreview({ topUsers }: LeaderboardPreviewProps) {
  if (topUsers.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-tm-green/5 to-yellow-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title="جدول امتیازات"
            subtitle="برترین‌های این هفته"
            icon="🏆"
            centered
            action={
              <Link href="/leaderboard" className="text-tm-green hover:underline text-sm font-medium">
                مشاهده کامل ←
              </Link>
            }
          />

          {/* Podium Style for Top 3 */}
          {topUsers.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mt-8 mb-6">
              {/* 2nd Place */}
              <PodiumUser user={topUsers[1]} rank={2} />

              {/* 1st Place */}
              <PodiumUser user={topUsers[0]} rank={1} />

              {/* 3rd Place */}
              <PodiumUser user={topUsers[2]} rank={3} />
            </div>
          )}

          {/* Rest of Top 5 */}
          {topUsers.length > 3 && (
            <div className="space-y-2">
              {topUsers.slice(3).map((user, index) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 font-bold">
                      {index + 4}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} loading="lazy" />
                      <AvatarFallback className="bg-tm-green text-white">
                        {user.displayName?.[0] || user.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold" dir="rtl">
                        {user.displayName || user.username}
                      </p>
                      <p className="text-xs text-gray-600">
                        سطح {user.level || 1}
                        {user.favoriteClub && ` • ${user.favoriteClub.name}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold text-tm-green" dir="ltr">
                      {user.points.toLocaleString('fa-IR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

