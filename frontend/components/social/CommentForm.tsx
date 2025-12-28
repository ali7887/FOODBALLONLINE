'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/useAuthStore';
import { commentsApi } from '@/lib/api/comments';
import { extractMentions } from '@/lib/utils/mentions';
import { Send } from 'lucide-react';
import type { CreateCommentRequest } from '@/types/comments';

interface CommentFormProps {
  entityType: 'player' | 'rumor';
  entityId: string;
  parentId?: string;
  onCommentAdded?: () => void;
  onCancel?: () => void;
  placeholder?: string;
}

export function CommentForm({
  entityType,
  entityId,
  parentId,
  onCommentAdded,
  onCancel,
  placeholder = 'نظرت رو بنویس... (می‌تونی با @username دیگران رو منشن کنی)',
}: CommentFormProps) {
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
        const request: CreateCommentRequest = {
          entityType,
          entityId,
          content: content.trim(),
          ...(parentId && { parentId }),
        };

        await commentsApi.create(request);
        setContent('');
        onCommentAdded?.();
        onCancel?.();
      } catch (err: any) {
        setError(err.message || 'خطا در ثبت نظر');
      } finally {
        setLoading(false);
      }
    },
    [content, entityType, entityId, parentId, isAuthenticated, onCommentAdded, onCancel]
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

  const mentions = extractMentions(content);

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-start space-x-reverse space-x-3">
        <Avatar className="h-10 w-10 border-2 border-gray-200 flex-shrink-0">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback className="bg-tm-green text-white">
            {user?.displayName?.[0] || user?.username?.[0] || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError(null);
            }}
            placeholder={placeholder}
            className="min-h-[100px] border-gray-300 focus:border-tm-green focus:ring-tm-green resize-none"
            maxLength={500}
            disabled={loading}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-gray-500">
              {content.length} / 500 کاراکتر
              {mentions.length > 0 && (
                <span className="text-tm-green mr-2">
                  • {mentions.length} منشن
                </span>
              )}
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-reverse space-x-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="border-gray-300 hover:border-tm-green hover:text-tm-green"
          >
            انصراف
          </Button>
        )}
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

