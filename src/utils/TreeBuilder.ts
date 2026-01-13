import { Comment, CommentNode } from '@/types/Comment';

/**
 * TreeBuilder - Utility for converting flat comment arrays to tree structure
 * 
 * Algorithm complexity: O(n) time, O(n) space
 * where n is the number of comments
 */
export class TreeBuilder {
  /**
   * Build a tree structure from flat comment array
   * 
   * @param comments - Flat array of comments
   * @returns Array of root-level CommentNodes with nested children
   */
  static buildTree(comments: Comment[]): CommentNode[] {
    // Create a map for O(1) lookups
    const map = new Map<string, CommentNode>();
    const roots: CommentNode[] = [];

    comments.forEach(comment => {
      map.set(comment.id, {
        ...comment,
        children: [],
        depth: 0,
      });
    });

    comments.forEach(comment => {
      const node = map.get(comment.id)!;

      if (comment.parentId === null) {
        roots.push(node);
      } else {
        const parent = map.get(comment.parentId);
        if (parent) {
          node.depth = parent.depth + 1;
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      }
    });

    const sortChildren = (node: CommentNode) => {
      node.children.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      node.children.forEach(sortChildren);
    };

    roots.forEach(sortChildren);

    return roots.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  /**
   * Flatten tree back to array (useful for serialization)
   */
  static flattenTree(nodes: CommentNode[]): Comment[] {
    const result: Comment[] = [];

    const traverse = (node: CommentNode) => {
      const { children, depth, ...comment } = node;
      result.push(comment);
      children.forEach(traverse);
    };

    nodes.forEach(traverse);
    return result;
  }

  /**
   * Find maximum depth in tree
   */
  static getMaxDepth(nodes: CommentNode[]): number {
    if (nodes.length === 0) return 0;

    let maxDepth = 0;

    const traverse = (node: CommentNode) => {
      maxDepth = Math.max(maxDepth, node.depth);
      node.children.forEach(traverse);
    };

    nodes.forEach(traverse);
    return maxDepth;
  }

  /**
   * Count total nodes in tree
   */
  static countNodes(nodes: CommentNode[]): number {
    let count = 0;

    const traverse = (node: CommentNode) => {
      count++;
      node.children.forEach(traverse);
    };

    nodes.forEach(traverse);
    return count;
  }
}