'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TransferRumorCard } from '@/components/rumors/TransferRumorCard';
import { apiClient } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';

export function RumorsPage() {
  const [rumors, setRumors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [voting, setVoting] = useState<string | null>(null);

  useEffect(() => {
    fetchRumors();
  }, [page]);

  async function fetchRumors() {
    setLoading(true);
    try {
      const response = await apiClient.getRumors({
        page,
        limit: 12,
        status: 'active',
        sortBy: 'probability',
        sortOrder: 'desc',
      });
      setRumors(response.data?.rumors || []);
      setTotalPages(response.data?.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching rumors:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleVote(rumorId: string, vote: 'believe' | 'disbelieve') {
    setVoting(rumorId);
    try {
      // Vote with probability: believe = 75%, disbelieve = 25%
      const probability = vote === 'believe' ? 75 : 25;
      await apiClient.voteOnRumor(rumorId, probability);
      // Optimistic update
      fetchRumors();
    } catch (error) {
      console.error('Error voting:', error);
      alert('خطا در ثبت رأی. لطفاً دوباره تلاش کن.');
    } finally {
      setVoting(null);
    }
  }


  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">شایعات نقل‌وانتقالات 🔥</h1>
          <p className="text-muted-foreground">روی احتمال نقل‌وانتقالات رأی بده و آخرین شایعات رو دنبال کن</p>
        </div>
      </div>

      {/* Rumors Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(12)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : rumors.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">هنوز شایعه‌ای ثبت نشده، تو اولین شایعه رو ثبت کن! 🍕</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rumors.map((rumor) => (
            <TransferRumorCard
              key={rumor._id}
              rumor={rumor}
              onVote={handleVote}
              voting={voting === rumor._id}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center space-x-reverse space-x-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            قبلی
          </Button>
          <span className="text-sm text-muted-foreground">
            صفحه {page} از {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            بعدی
          </Button>
        </div>
      )}
    </div>
  );
}
