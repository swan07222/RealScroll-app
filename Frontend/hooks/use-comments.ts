// hooks/use-comments.ts
import { useState, useCallback } from 'react';
import { Comment, CreateCommentInput } from '@/types';
import { commentsApi } from '@/api';

export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchComments = useCallback(async (pageNum: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await commentsApi.getCommentsByPostId(postId, pageNum);
      if (response.success) {
        if (pageNum === 1) {
          setComments(response.data);
        } else {
          setComments(prev => [...prev, ...response.data]);
        }
        setPage(pageNum);
        setHasMore(response.pagination.hasNext);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchComments(page + 1);
    }
  }, [isLoading, hasMore, page, fetchComments]);

  const addComment = useCallback(async (content: string, parentId?: string) => {
    setIsSubmitting(true);

    try {
      const input: CreateCommentInput = {
        postId,
        content,
        parentId,
      };
      const response = await commentsApi.createComment(input);
      if (response.success) {
        if (parentId) {
          // Add reply to parent comment
          setComments(prev =>
            prev.map(comment => {
              if (comment.id === parentId) {
                return {
                  ...comment,
                  repliesCount: comment.repliesCount + 1,
                  replies: [...(comment.replies || []), response.data],
                };
              }
              return comment;
            })
          );
        } else {
          // Add new top-level comment
          setComments(prev => [response.data, ...prev]);
        }
        return response.data;
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [postId]);

  const likeComment = useCallback(async (commentId: string) => {
    try {
      const response = await commentsApi.likeComment(commentId);
      if (response.success) {
        setComments(prev =>
          prev.map(comment =>
            comment.id === commentId ? response.data : comment
          )
        );
      }
    } catch (err) {
      console.error('Like comment error:', err);
    }
  }, []);

  const deleteComment = useCallback(async (commentId: string) => {
    try {
      const response = await commentsApi.deleteComment(commentId);
      if (response.success) {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
      }
    } catch (err) {
      console.error('Delete comment error:', err);
    }
  }, []);

  return {
    comments,
    isLoading,
    isSubmitting,
    error,
    hasMore,
    fetchComments,
    loadMore,
    addComment,
    likeComment,
    deleteComment,
  };
}