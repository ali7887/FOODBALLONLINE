'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { apiClient } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import { ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { CommentBox } from '@/components/social/CommentBox';
import { CommentList } from '@/components/social/CommentList';
import { ReactionBar } from '@/components/social/ReactionBar';

interface RumorDetailPageProps {
  rumorId: string;
}

export function RumorDetailPage({ rumorId }: RumorDetailPageProps) {
  const [rumor, setRumor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentRefresh, setCommentRefresh] = useState(0);

  useEffect(() => {
    fetchRumor();
  }, [rumorId]);

  const fetchRumor = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.getRumor(rumorId);
      setRumor(response.data?.rumor);
    } catch (error) {
      console.error('Error fetching rumor:', error);
    } finally {
      setLoading(false);
    }
  }, [rumorId]);

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

  if (!rumor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          <Card className="border-gray-200">
            <CardContent className="pt-6 text-center py-12">
              <p className="text-gray-600">شایعه پیدا نشد</p>
              <Link href="/rumors">
                <Button className="mt-4 bg-tm-green hover:bg-tm-green/90">
                  بازگشت به لیست شایعات
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
        {/* Rumor Header */}
        <Card className="border-gray-200">
          <CardHeader className="bg-tm-green text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {rumor.player?.fullName || 'بازیکن نامشخص'}
                </CardTitle>
                <CardDescription className="text-white/90 mt-1">
                  {rumor.fromClub?.name || 'آزاد'} → {rumor.toClub?.name}
                </CardDescription>
              </div>
              <Link href="/rumors">
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <ArrowRight className="h-4 w-4 ml-2" />
                  بازگشت
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">احتمال نقل‌وانتقال</span>
                  <Badge className="bg-tm-green text-white">
                    {rumor.probability}%
                  </Badge>
                </div>
                <Progress value={rumor.probability} className="h-3" />
              </div>

              {rumor.estimatedFee && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">حق‌الزحمه تخمینی</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(rumor.estimatedFee)}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{rumor.voteCount || 0} رأی</span>
                <span>{rumor.upvotes || 0} موافق</span>
              </div>
            </div>

            {/* Reactions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <ReactionBar targetType="rumor" targetId={rumorId} />
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="border-gray-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-gray-900">نظرات</CardTitle>
            <CardDescription>نظرات و بحث‌های کاربران درباره این شایعه</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <CommentBox
              entityType="rumor"
              entityId={rumorId}
              onCommentAdded={handleCommentAdded}
            />
            <CommentList
              entityType="rumor"
              entityId={rumorId}
              refreshTrigger={commentRefresh}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

