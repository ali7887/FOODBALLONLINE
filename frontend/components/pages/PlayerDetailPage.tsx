'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import { ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { CommentBox } from '@/components/social/CommentBox';
import { CommentList } from '@/components/social/CommentList';
import { ReactionBar } from '@/components/social/ReactionBar';

interface PlayerDetailPageProps {
  playerId: string;
}

export function PlayerDetailPage({ playerId }: PlayerDetailPageProps) {
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentRefresh, setCommentRefresh] = useState(0);

  useEffect(() => {
    fetchPlayer();
  }, [playerId]);

  const fetchPlayer = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.getPlayer(playerId);
      setPlayer(response.data?.player);
    } catch (error) {
      console.error('Error fetching player:', error);
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  const handleCommentAdded = useCallback(() => {
    setCommentRefresh((prev) => prev + 1);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container space-y-6">
          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          <Card className="border-gray-200">
            <CardContent className="pt-6 text-center py-12">
              <p className="text-gray-600">بازیکن پیدا نشد</p>
              <Link href="/players">
                <Button className="mt-4 bg-tm-green hover:bg-tm-green/90">
                  بازگشت به لیست بازیکنان
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container space-y-6">
        {/* Player Header */}
        <Card className="border-gray-200">
          <CardHeader className="bg-tm-green text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{player.fullName}</CardTitle>
                <CardDescription className="text-white/90 mt-1">
                  {player.position} • {player.currentClub?.name || 'بدون باشگاه'}
                </CardDescription>
              </div>
              <Link href="/players">
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <ArrowRight className="h-4 w-4 ml-2" />
                  بازگشت
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">ارزش بازاری</p>
                <p className="text-2xl font-bold text-tm-green">
                  {formatCurrency(player.marketValue || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {player.marketValueVoteCount || 0} رأی
                </p>
              </div>
              {player.stats && (
                <>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">گل‌ها</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {player.stats.goals || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">پاس گل</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {player.stats.assists || 0}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Reactions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <ReactionBar targetType="player" targetId={playerId} />
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="border-gray-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-gray-900">نظرات</CardTitle>
            <CardDescription>نظرات و بحث‌های کاربران درباره این بازیکن</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <CommentBox
              entityType="player"
              entityId={playerId}
              onCommentAdded={handleCommentAdded}
            />
            <CommentList
              entityType="player"
              entityId={playerId}
              refreshTrigger={commentRefresh}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

