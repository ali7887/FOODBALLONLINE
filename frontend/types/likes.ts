export type LikeableEntity = 'comment' | 'rumor' | 'player';

export interface LikeRequest {
  targetType: LikeableEntity;
  targetId: string;
}

export interface LikeResponse {
  liked: boolean;
  likesCount: number;
}

export interface LikeStatus {
  isLiked: boolean;
  likesCount: number;
}

