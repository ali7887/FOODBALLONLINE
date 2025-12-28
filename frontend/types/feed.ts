import type { BaseQueryParams } from '@/lib/api-client';

export type FeedSourceType = 'player' | 'team' | 'rumor' | 'news' | 'activity';

export interface UserPreferences {
  followedPlayers: string[]; // Player IDs
  followedTeams: string[]; // Team/Club IDs
  followedTopics?: string[]; // Future-proof: topic IDs
  feedSortBy?: 'relevance' | 'date' | 'popularity';
  feedFilterBy?: FeedSourceType[];
}

export interface PersonalizedFeedItem {
  id: string;
  type: FeedSourceType;
  title: string;
  description?: string;
  thumbnail?: string;
  source: {
    id: string;
    name: string;
    type: 'player' | 'team' | 'system';
    avatar?: string;
  };
  metadata: {
    relevanceScore?: number;
    popularityScore?: number;
    interactionCount?: number;
    createdAt: string;
    updatedAt?: string;
  };
  // Type-specific data
  data: FeedItemData;
}

export type FeedItemData =
  | PlayerFeedData
  | TeamFeedData
  | RumorFeedData
  | NewsFeedData
  | ActivityFeedData;

export interface PlayerFeedData {
  type: 'player';
  playerId: string;
  playerName: string;
  action: 'transfer' | 'rumor' | 'update' | 'milestone';
  details?: Record<string, unknown>;
}

export interface TeamFeedData {
  type: 'team';
  teamId: string;
  teamName: string;
  action: 'transfer' | 'rumor' | 'match' | 'update';
  details?: Record<string, unknown>;
}

export interface RumorFeedData {
  type: 'rumor';
  rumorId: string;
  playerName: string;
  fromClub?: string;
  toClub?: string;
  probability?: number;
}

export interface NewsFeedData {
  type: 'news';
  newsId: string;
  url?: string;
  author?: string;
}

export interface ActivityFeedData {
  type: 'activity';
  activityId: string;
  activityType: string;
  userId: string;
  userName: string;
}

export interface GetPersonalizedFeedParams extends BaseQueryParams {
  sortBy?: 'relevance' | 'date' | 'popularity';
  filterBy?: FeedSourceType[];
  includeFollowed?: boolean; // Default: true
}

export interface PersonalizedFeedResponse {
  items: PersonalizedFeedItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  preferences?: {
    followedPlayersCount: number;
    followedTeamsCount: number;
    hasPreferences: boolean;
  };
}

