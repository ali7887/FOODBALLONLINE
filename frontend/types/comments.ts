export interface CommentAuthor {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  title?: string;
  reputation?: number;
}

export interface Comment {
  id: string;
  content: string;
  author: CommentAuthor;
  createdAt: string;
  likesCount: number;
  isLikedByUser: boolean;
  parentId?: string;
  replies?: Comment[];
  mentions?: string[];
}

export interface CreateCommentRequest {
  entityType: 'player' | 'rumor';
  entityId: string;
  content: string;
  parentId?: string;
}

export interface GetCommentsParams {
  entityType: 'player' | 'rumor';
  entityId: string;
  page?: number;
  limit?: number;
}

export interface CommentsResponse {
  comments: Comment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}


