export interface Comment {
  id: string;
  parentId: string | null;
  content: string;
  author: string;
  createdAt: string;
  optimistic?: boolean;
}

export interface CommentNode extends Comment {
  children: CommentNode[];
  depth: number;
}