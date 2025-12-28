import axios from 'axios';
import type {
  GetUserProfileParams,
  GetUserActivitiesParams,
  UserProfileResponse,
  UserActivitiesResponse,
} from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create a separate axios instance for user endpoints
const userClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const usersApi = {
  /**
   * Get public user profile by username
   */
  async getPublicProfile(params: GetUserProfileParams): Promise<UserProfileResponse> {
    const response = await userClient.get(`/users/${params.username}/profile`);
    return response.data;
  },

  /**
   * Get user activities
   */
  async getActivities(params: GetUserActivitiesParams): Promise<UserActivitiesResponse> {
    const { username, ...queryParams } = params;
    const response = await userClient.get(`/users/${username}/activities`, {
      params: queryParams,
    });
    return response.data;
  },
};

