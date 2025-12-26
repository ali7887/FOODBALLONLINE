'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/useAuthStore';
import { ThumbsUp, Flame, HelpCircle, Laugh } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReactionCounts {
  like: number;
  fire: number;
  suspicious: number;
  funny: number;
}

interface ReactionBarProps {
  targetType: 'comment' | 'player' | 'rumor';
  targetId: string;
  initialCounts?: ReactionCounts;
}

const reactions = [
  { type: 'like' as const, icon: ThumbsUp, label: 'لایک', emoji: '👍' },
  { type: 'fire' as const, icon: Flame, label: 'داغ', emoji: '🔥' },
  { type: 'suspicious' as const, icon: HelpCircle, label: 'مشکوک', emoji: '🤔' },
  { type: 'funny' as const, icon: Laugh, label: 'خنده‌دار', emoji: '😂' },
];

export function ReactionBar({ targetType, targetId, initialCounts }: ReactionBarProps) {
  const [counts, setCounts] = useState<ReactionCounts>(
    initialCounts || { like: 0, fire: 0, suspicious: 0, funny: 0 }
  );
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (initialCounts) {
      setCounts(initialCounts);
    }
  }, [initialCounts]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserReaction();
    }
  }, [isAuthenticated, targetType, targetId]);

  const fetchUserReaction = useCallback(async () => {
    try {
      const response = await apiClient.getUserReaction({
        targetType,
        targetId,
      });
      setUserReaction(response.data?.reaction?.type || null);
    } catch (error) {
      // Silently fail - user might not have a reaction
    }
  }, [targetType, targetId]);

  const handleReaction = useCallback(
    async (type: string) => {
      if (!isAuthenticated) {
        return;
      }

      setLoading(true);

      // Optimistic update
      const wasActive = userReaction === type;
      const previousReaction = userReaction;

      if (wasActive) {
        // Remove reaction
        setUserReaction(null);
        setCounts((prev) => ({
          ...prev,
          [type]: Math.max(0, prev[type as keyof ReactionCounts] - 1),
        }));
      } else {
        // Add or change reaction
        if (previousReaction) {
          // Remove previous reaction count
          setCounts((prev) => ({
            ...prev,
            [previousReaction]: Math.max(0, prev[previousReaction as keyof ReactionCounts] - 1),
          }));
        }
        setUserReaction(type);
        setCounts((prev) => ({
          ...prev,
          [type]: prev[type as keyof ReactionCounts] + 1,
        }));
      }

      try {
        const response = await apiClient.toggleReaction({
          targetType,
          targetId,
          type: type as 'like' | 'fire' | 'suspicious' | 'funny',
        });

        // Update with server response
        if (response.data?.reaction) {
          setUserReaction(response.data.reaction.type);
        } else {
          setUserReaction(null);
        }
      } catch (error: any) {
        // Revert optimistic update
        setUserReaction(previousReaction);
        if (wasActive) {
          setCounts((prev) => ({
            ...prev,
            [type]: prev[type as keyof ReactionCounts] + 1,
          }));
        } else {
          if (previousReaction) {
            setCounts((prev) => ({
              ...prev,
              [previousReaction]: prev[previousReaction as keyof ReactionCounts] + 1,
            }));
          }
          setCounts((prev) => ({
            ...prev,
            [type]: Math.max(0, prev[type as keyof ReactionCounts] - 1),
          }));
        }
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, targetType, targetId, userReaction]
  );

  const memoizedReactions = useMemo(() => reactions, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center space-x-reverse space-x-2">
      {memoizedReactions.map((reaction) => {
        const Icon = reaction.icon;
        const isActive = userReaction === reaction.type;
        const count = counts[reaction.type as keyof ReactionCounts];

        return (
          <Button
            key={reaction.type}
            variant="ghost"
            size="sm"
            onClick={() => handleReaction(reaction.type)}
            disabled={loading}
            className={cn(
              'h-8 px-2 text-xs transition-all',
              isActive
                ? 'bg-tm-green/10 text-tm-green border border-tm-green/20'
                : 'text-gray-600 hover:text-tm-green hover:bg-gray-50'
            )}
            title={reaction.label}
          >
            <span className="ml-1">{reaction.emoji}</span>
            {count > 0 && (
              <span className="font-medium">{count}</span>
            )}
          </Button>
        );
      })}
    </div>
  );
}

