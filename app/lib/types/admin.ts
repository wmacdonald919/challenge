import type { Challenge } from '@/app/lib/types/challenge';
import type { Conversation } from '@/app/lib/types/conversation';

export interface ConversationStatusCounts {
  total: number;
  open: number;
  answered: number;
  resolved: number;
  closed: number;
}

export interface ChallengeSupportRow {
  challenge: Challenge;
  support_question_count: number;
  open_count: number;
}

export interface AdminDashboard {
  status_counts: ConversationStatusCounts;
  challenges: ChallengeSupportRow[];
  needs_attention: Conversation[];
}

export interface AdminApi {
  getDashboard(): Promise<AdminDashboard>;
}
