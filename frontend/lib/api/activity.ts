import { apiClient } from '../api-client';
import type { GetActivityParams, ActivityResponse } from '@/types/activity';

export const activityApi = {
  /**
   * Get activity feed
   */
  async getFeed(params?: GetActivityParams): Promise<ActivityResponse> {
    const response = await apiClient.getActivityFeed(params);
    return response.data;
  },
};

