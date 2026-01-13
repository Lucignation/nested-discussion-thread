import { Comment } from '@/types/Comment';

/**
 * CommentService - Data layer abstraction
 * 
 * In production, this would connect to API endpoints.
 * For this demo, I will use localStorage to simulate a backend.
 */
export class CommentService {
  private static STORAGE_KEY = 'discussion_comments';

  /**
   * Simulate network delay
   */
  private static delay = (ms: number) => 
    new Promise(resolve => setTimeout(resolve, ms));

  /**
   * Fetch all comments
   */
  static async getComments(): Promise<Comment[]> {
    await this.delay(300);
    
    if (typeof window === 'undefined') {
      return [];
    }

    const stored = localStorage.getItem(this.STORAGE_KEY);
    
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Initialize with sample data
    const initial = this.getInitialData();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  /**
   * Add a new comment
   */
  static async addComment(
    comment: Omit<Comment, 'id' | 'createdAt'>
  ): Promise<Comment> {
    await this.delay(500);

    const comments = await this.getComments();
    
    const newComment: Comment = {
      ...comment,
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    comments.push(newComment);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(comments));
    
    return newComment;
  }

  /**
   * Delete a comment (cascade delete children)
   */
  static async deleteComment(id: string): Promise<void> {
    await this.delay(300);

    let comments = await this.getComments();
    
    // Find all child comment IDs recursively
    const findAllChildIds = (parentId: string): string[] => {
      const children = comments.filter(c => c.parentId === parentId);
      const childIds = children.map(c => c.id);
      const grandchildIds = children.flatMap(c => findAllChildIds(c.id));
      return [...childIds, ...grandchildIds];
    };

    const idsToDelete = [id, ...findAllChildIds(id)];
    
    comments = comments.filter(c => !idsToDelete.includes(c.id));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(comments));
  }

  /**
   * Initial sample data
   */
  private static getInitialData(): Comment[] {
    return [
      {
        id: '1',
        parentId: null,
        content: 'This is the root comment of our discussion thread. It demonstrates how we can build infinitely nested conversations.',
        author: 'Alice',
        createdAt: '2024-01-10T10:00:00Z'
      },
      {
        id: '2',
        parentId: '1',
        content: 'Great point! I have a follow-up question about the implementation details...',
        author: 'Bob',
        createdAt: '2024-01-10T10:05:00Z'
      },
      {
        id: '3',
        parentId: '2',
        content: 'Let me answer that. The key is using a recursive component structure.',
        author: 'Charlie',
        createdAt: '2024-01-10T10:10:00Z'
      },
      {
        id: '4',
        parentId: '3',
        content: 'Thanks for clarifying! This makes a lot of sense now.',
        author: 'Bob',
        createdAt: '2024-01-10T10:15:00Z'
      },
      {
        id: '5',
        parentId: '4',
        content: 'This is getting deep! We\'re at level 4 now.',
        author: 'David',
        createdAt: '2024-01-10T10:20:00Z'
      },
      {
        id: '6',
        parentId: '1',
        content: 'Another top-level reply here, starting a different branch of the conversation.',
        author: 'Eve',
        createdAt: '2024-01-10T10:25:00Z'
      },
      {
        id: '7',
        parentId: '6',
        content: 'Nested under Eve\'s comment, this demonstrates parallel conversation threads.',
        author: 'Frank',
        createdAt: '2024-01-10T10:30:00Z'
      },
    ];
  }

  /**
   * Clear all comments
   */
  static async clearAll(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}