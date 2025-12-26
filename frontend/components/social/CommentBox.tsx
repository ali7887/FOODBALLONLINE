'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/useAuthStore';
import { apiClient } from '@/lib/api-client';
import { Send } from 'lucide-react';

interface CommentBoxProps {
  entityType: 'player' | 'rumor';
  entityId: string;
  onCommentAdded?: () => void;
}

export function CommentBox({ entityType, entityId, onCommentAdded }: CommentBoxProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuthStore();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!isAuthenticated) {
        setError('لطفاً ابتدا وارد حساب کاربری‌ات بشو');
        return;
      }

      if (!content.trim()) {
        setError('لطفاً نظرت رو بنویس');
        return;
      }

      if (content.length > 500) {
        setError('نظر نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await apiClient.createComment({
          entityType,
          entityId,
          content: content.trim(),
        });

        setContent('');
        onCommentAdded?.();
      } catch (err: any) {
        setError(err.message || 'خطا در ثبت نظر');
      } finally {
        setLoading(false);
      }
    },
    [content, entityType, entityId, isAuthenticated, onCommentAdded]
  );

  if (!isAuthenticated) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
        <p className="text-sm text-gray-600">
          برای ثبت نظر، لطفاً{' '}
          <a href="/login" className="text-tm-green hover:underline font-medium">
            وارد حساب کاربری‌ات بشو
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-start space-x-reverse space-x-3">
        <Avatar className="h-10 w-10 border-2 border-gray-200">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback className="bg-tm-green text-white">
            {user?.displayName?.[0] || user?.username?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError(null);
            }}
            placeholder="نظرت رو بنویس... (می‌تونی با @username دیگران رو منشن کنی)"
            className="min-h-[100px] border-gray-300 focus:border-tm-green focus:ring-tm-green resize-none"
            maxLength={500}
            disabled={loading}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-gray-500">
              {content.length} / 500 کاراکتر
            </div>
            {error && (
              <p className="text-xs text-red-600">{error}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading || !content.trim()}
          className="bg-tm-green hover:bg-tm-green/90 text-white tm-button"
        >
          {loading ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></span>
              در حال ارسال...
            </span>
          ) : (
            <span className="flex items-center">
              <Send className="h-4 w-4 ml-2" />
              ارسال نظر
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}

