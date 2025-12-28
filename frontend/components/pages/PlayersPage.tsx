'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter, ModalClose } from '@/components/ui/modal';
import { PlayerCard } from '@/components/players/PlayerCard';
import { apiClient } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import { Search } from 'lucide-react';

export function PlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [voteValue, setVoteValue] = useState('');
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, [page, search, position]);

  async function fetchPlayers() {
    setLoading(true);
    try {
      const response = await apiClient.getPlayers({
        page,
        limit: 12,
        search: search || undefined,
        position: position || undefined,
        sortBy: 'marketValue',
        sortOrder: 'desc',
      });
      setPlayers(response.data?.players || []);
      setTotalPages(response.data?.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleVote() {
    if (!selectedPlayer || !voteValue) return;

    setVoting(true);
    try {
      await apiClient.voteOnPlayerMarketValue(selectedPlayer._id, parseFloat(voteValue));
      setVoteModalOpen(false);
      setVoteValue('');
      // Optimistic update
      fetchPlayers();
    } catch (error) {
      console.error('Error voting:', error);
      alert('خطا در ثبت رأی. لطفاً دوباره تلاش کن.');
    } finally {
      setVoting(false);
    }
  }

  const positions = ['GK', 'DF', 'MF', 'FW'];
  const positionLabels: { [key: string]: string } = {
    'GK': 'دروازه‌بان',
    'DF': 'مدافع',
    'MF': 'هافبک',
    'FW': 'مهاجم',
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">بازیکنان ⚽</h1>
          <p className="text-muted-foreground">بازیکنان را ببین و روی ارزش بازاری‌شون رأی بده</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="جستجوی بازیکن..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pr-10"
              />
            </div>
            <div className="flex gap-2">
              {positions.map((pos) => (
                <Button
                  key={pos}
                  variant={position === pos ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setPosition(position === pos ? '' : pos);
                    setPage(1);
                  }}
                >
                  {positionLabels[pos] || pos}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Players Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(12)].map((_, i) => (
            <Card key={i} className="border-gray-200">
              <CardContent className="p-4">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-48 w-full mb-2" />
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : players.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">هیچ بازیکنی پیدا نشد 😔</p>
            {search && (
              <p className="text-sm text-muted-foreground mt-2">
                برای "{search}" نتیجه‌ای پیدا نشد
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <PlayerCard
              key={player._id}
              player={player}
              onVote={(playerId) => {
                const player = players.find(p => p._id === playerId);
                if (player) {
                  setSelectedPlayer(player);
                  setVoteModalOpen(true);
                }
              }}
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

      {/* Vote Modal */}
      <Modal open={voteModalOpen} onOpenChange={setVoteModalOpen}>
        <ModalContent>
          <ModalClose onClose={() => setVoteModalOpen(false)} />
          <ModalHeader>
            <ModalTitle>رأی به ارزش بازاری</ModalTitle>
          </ModalHeader>
          {selectedPlayer && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  فکر می‌کنی <strong>{selectedPlayer.fullName}</strong> چقدر می‌ارزه؟ 💰
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  ارزش فعلی: {formatCurrency(selectedPlayer.marketValue || 0)} ({' '}
                  {selectedPlayer.marketValueVoteCount || 0} رأی)
                </p>
              </div>
              <Input
                type="number"
                placeholder="ارزش را به یورو وارد کن"
                value={voteValue}
                onChange={(e) => setVoteValue(e.target.value)}
              />
            </div>
          )}
          <ModalFooter>
            <Button variant="outline" onClick={() => setVoteModalOpen(false)}>
              انصراف
            </Button>
            <Button onClick={handleVote} disabled={voting || !voteValue}>
              {voting ? 'در حال ثبت...' : 'ثبت رأی'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
