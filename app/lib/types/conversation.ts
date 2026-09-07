import type { PaginationParams } from './common';

export type ConversationStatus = 'open' | 'answered' | 'resolved' | 'closed';
export type ConversationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type UserRole = 'learner' | 'mentor' | 'support' | 'staff';

export interface PostReactions {
  upvotes: number;
  helpful: number;
}

export interface Post {
  post_id: number;
  user: string;
  timestamp: string;
  content: string;
  user_role: UserRole;
  reactions: PostReactions;
  is_accepted_answer: boolean;
}

export interface Conversation {
  identifier: string;
  topic: string;
  category: string;
  posts: Post[];
  challenge_id: string;
  status: ConversationStatus;
  priority: ConversationPriority;
  tags: string[];
  created_at: string;
  updated_at: string;
  last_activity_at: string;
  participant_count: number;
  participants: string[];
  view_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  assigned_to: string;
  resolution_time_hours: number;
  description: string;
}

export interface GetConversationsParams extends PaginationParams {
  challenge_id?: string;
  status?: ConversationStatus;
  search?: string;
}

export interface CreateConversationInput {
  topic: string;
  category: string;
  challenge_id: string;
  content: string;
  user: string;
  tags?: string[];
}

export interface CreateReplyInput {
  content: string;
  user: string;
  user_role?: UserRole;
}
