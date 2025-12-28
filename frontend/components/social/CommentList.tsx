'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { commentsApi } from '@/lib/api/comments';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import type { Comment, GetCommentsParams } from '@/types/comments';

interface CommentListProps {
  entityType: 'player' | 'rumor';
  entityId: string;
  refreshTrigger?: number;
}

export function CommentList({ entityType, entityId, refreshTrigger }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const params: GetCommentsParams = {
        entityType,
        entityId,
        page,
        limit: 10,
      };
      
      const response = await commentsApi.get(params);
      setComments(response.comments || []);
      setTotalPages(response.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId, page]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments, refreshTrigger]);

  const handleCommentAdded = useCallback(() => {
    fetchComments();
    setReplyingTo(null);
  }, [fetchComments]);

  const handleDelete = useCallback(() => {
    fetchComments();
  }, [fetchComments]);

  if (loading && comments.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-reverse space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Comment Form */}
      {replyingTo ? (
        <div className="pr-4 border-r-2 border-tm-green/30">
          <CommentForm
            entityType={entityType}
            entityId={entityId}
            parentId={replyingTo}
            onCommentAdded={handleCommentAdded}
            onCancel={() => setReplyingTo(null)}
            placeholder="پاسخت رو بنویس..."
          />
        </div>
      ) : (
        <CommentForm
          entityType={entityType}
          entityId={entityId}
          onCommentAdded={handleCommentAdded}
        />
      )}

      {/* Comments */}
      {comments.length === 0 ? (
        <Card className="border-gray-200">
          <CardContent className="p-8 text-center">
            <div className="text-5xl mb-4">👀</div>
            <p className="text-gray-600 font-medium">اولین نظر رو تو بنویس ⚽</p>
            <p className="text-sm text-gray-500 mt-2">
              هنوز کسی نظری نذاشته، تو اولین نفر باش!
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={handleDelete}
              onReply={setReplyingTo}
            />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-reverse space-x-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-gray-300 hover:border-tm-green hover:text-tm-green"
              >
                قبلی
              </Button>
              <span className="text-sm text-gray-600 px-4">
                صفحه {page} از {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="border-gray-300 hover:border-tm-green hover:text-tm-green"
              >
                بعدی
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
