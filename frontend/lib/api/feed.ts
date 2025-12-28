import axios from 'axios';
import type {
  GetPersonalizedFeedParams,
  PersonalizedFeedResponse,
} from '@/types/feed';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create axios instance for feed endpoints
const feedClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
feedClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const feedApi = {
  /**
   * Get personalized feed based on user preferences and followed entities
   */
  async getPersonalizedFeed(params: GetPersonalizedFeedParams): Promise<PersonalizedFeedResponse> {
    const response = await feedClient.get('/feed/personalized', {
      params,
    });
    return response.data;
  },
};

