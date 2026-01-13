'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Comment } from '@/types/Comment';
import { CommentService } from '@/services/CommentService';
import { TreeBuilder } from '@/utils/TreeBuilder';
import { CommentItem } from './CommentItem';

/**
 * DiscussionThread - Main container component
 * 
 * Manages:
 * - Loading comments from service
 * - Building tree structure
 * - Optimistic mutations
 * - Error handling and rollback
 */
export const DiscussionThread: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    CommentService.getComments()
      .then(data => {
        setComments(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load comments');
        setLoading(false);
      });
  }, []);

  
  const commentTree = useMemo(() => {
    return TreeBuilder.buildTree(comments);
  }, [comments]);

  
  const stats = useMemo(() => {
    return {
      total: comments.length,
      maxDepth: TreeBuilder.getMaxDepth(commentTree),
    };
  }, [comments, commentTree]);

  
  const handleReply = useCallback(async (
    parentId: string, 
    content: string, 
    author: string
  ) => {
    
    const optimisticComment: Comment = {
      id: `temp_${Date.now()}_${Math.random()}`,
      parentId,
      content,
      author,
      createdAt: new Date().toISOString(),
      optimistic: true,
    };

    
    setComments(prev => [...prev, optimisticComment]);

    try {
      
      const serverComment = await CommentService.addComment({
        parentId,
        content,
        author,
      });

      
      setComments(prev =>
        prev.map(c => c.id === optimisticComment.id ? serverComment : c)
      );
    } catch (err) {
      
      setComments(prev => 
        prev.filter(c => c.id !== optimisticComment.id)
      );
      alert('Failed to post comment. Please try again.');
    }
  }, []);

  
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Delete this comment and all its replies?')) {
      return;
    }

    
    const deletedComments = comments.filter(c => {
      let current = c;
      while (current) {
        if (current.id === id) return true;
        current = comments.find(x => x.id === current.parentId)!;
      }
      return false;
    });

    
    setComments(prev => prev.filter(c => !deletedComments.includes(c)));

    try {
      await CommentService.deleteComment(id);
    } catch (err) {
      
      setComments(prev => [...prev, ...deletedComments]);
      alert('Failed to delete comment. Please try again.');
    }
  }, [comments]);

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>
          Loading discussion...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#ef4444' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '24px' 
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 700, 
          marginBottom: '8px' 
        }}>
          Nested Discussion Thread
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Total comments: {stats.total} | Max depth: {stats.maxDepth} levels
        </p>
      </div>

      {/* Comment Tree */}
      <div>
        {commentTree.length === 0 ? (
          <div style={{ 
            padding: '48px', 
            textAlign: 'center', 
            color: '#9ca3af' 
          }}>
            No comments yet. Be the first to comment!
          </div>
        ) : (
          commentTree.map(node => (
            <CommentItem
              key={node.id}
              node={node}
              onReply={handleReply}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

    </div>
  );
};