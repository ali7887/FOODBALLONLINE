import { apiClient } from '../api-client';
import type { CreateCommentRequest, GetCommentsParams, CommentsResponse, Comment } from '@/types/comments';

export const commentsApi = {
  /**
   * Create a new comment
   */
  async create(data: CreateCommentRequest): Promise<{ comment: Comment }> {
    const response = await apiClient.createComment(data);
    return response.data;
  },

  /**
   * Get comments for an entity
   */
  async get(params: GetCommentsParams): Promise<CommentsResponse> {
    const response = await apiClient.getComments(params);
    return response.data;
  },

  /**
   * Delete a comment
   */
  async delete(commentId: string): Promise<void> {
    await apiClient.deleteComment(commentId);
  },
};

