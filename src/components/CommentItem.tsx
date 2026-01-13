'use client';

import React, { useState } from 'react';
import { CommentNode } from '@/types/Comment';

interface CommentItemProps {
  node: CommentNode;
  onReply: (parentId: string, content: string, author: string) => void;
  onDelete: (id: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ 
  node, 
  onReply, 
  onDelete 
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');

  const handleSubmitReply = () => {
    if (replyContent.trim() && replyAuthor.trim()) {
      onReply(node.id, replyContent, replyAuthor);
      setReplyContent('');
      setReplyAuthor('');
      setIsReplying(false);
    }
  };

  const indentStyle: React.CSSProperties = {
    marginLeft: `${node.depth * 24}px`,
    borderLeft: node.depth > 0 ? '2px solid #e5e7eb' : 'none',
    paddingLeft: node.depth > 0 ? '16px' : '0',
  };

  const commentStyle: React.CSSProperties = {
    padding: '12px',
    marginBottom: '8px',
    backgroundColor: node.optimistic ? '#fef3c7' : '#f9fafb',
    borderRadius: '6px',
    opacity: node.optimistic ? 0.7 : 1,
    transition: 'all 0.2s ease',
  };

  return (
    <div style={indentStyle}>
      <div style={commentStyle}>
        {/* Comment Header & Actions */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'start' 
        }}>
          <div style={{ flex: 1 }}>
            {/* Author & Metadata */}
            <div style={{ 
              fontWeight: 600, 
              fontSize: '14px', 
              marginBottom: '4px' 
            }}>
              {node.author}
              <span style={{ 
                fontWeight: 400, 
                color: '#6b7280', 
                marginLeft: '8px', 
                fontSize: '12px' 
              }}>
                {new Date(node.createdAt).toLocaleString()}
              </span>
              {node.depth > 0 && (
                <span style={{ 
                  color: '#9ca3af', 
                  marginLeft: '8px', 
                  fontSize: '12px' 
                }}>
                  Level {node.depth}
                </span>
              )}
              {node.optimistic && (
                <span style={{ 
                  color: '#f59e0b', 
                  marginLeft: '8px', 
                  fontSize: '12px' 
                }}>
                  (Posting...)
                </span>
              )}
            </div>
            
            {/* Comment Content */}
            <div style={{ color: '#374151', fontSize: '14px' }}>
              {node.content}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setIsReplying(!isReplying)}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Reply
            </button>
            <button
              onClick={() => onDelete(node.id)}
              disabled={node.optimistic}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: node.optimistic ? 'not-allowed' : 'pointer',
                opacity: node.optimistic ? 0.5 : 1,
              }}
            >
              Delete
            </button>
          </div>
        </div>

        {/* Reply Form */}
        {isReplying && (
          <div style={{ marginTop: '12px' }}>
            <input
              type="text"
              placeholder="Your name"
              value={replyAuthor}
              onChange={(e) => setReplyAuthor(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
            <textarea
              placeholder="Write your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleSubmitReply}
                style={{
                  padding: '6px 16px',
                  fontSize: '14px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Submit
              </button>
              <button
                onClick={() => setIsReplying(false)}
                style={{
                  padding: '6px 16px',
                  fontSize: '14px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recursive rendering of children */}
      {node.children.map(child => (
        <CommentItem
          key={child.id}
          node={child}
          onReply={onReply}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};