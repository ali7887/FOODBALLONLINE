import { apiClient } from '../api-client';
import type { LikeRequest, LikeResponse, LikeStatus, LikeableEntity } from '@/types/likes';

export const likesApi = {
  /**
   * Toggle like on an entity
   */
  async toggle(request: LikeRequest): Promise<LikeResponse> {
    const response = await apiClient.toggleReaction({
      targetType: request.targetType,
      targetId: request.targetId,
      type: 'like',
    });
    
    // Transform reaction response to like response
    const reactionData = response.data;
    return {
      liked: reactionData.added || false,
      likesCount: reactionData.counts?.like || 0,
    };
  },

  /**
   * Get like status for an entity
   */
  async getStatus(targetType: LikeableEntity, targetId: string): Promise<LikeStatus> {
    const response = await apiClient.getUserReaction({
      targetType,
      targetId,
    });
    
    const reaction = response.data?.reaction;
    const isLiked = reaction?.type === 'like';
    
    // Get total likes count
    const reactionsResponse = await apiClient.getReactions({
      targetType,
      targetId,
    });
    
    return {
      isLiked,
      likesCount: reactionsResponse.data?.counts?.like || 0,
    };
  },
};

