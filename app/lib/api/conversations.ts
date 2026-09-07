import type {
  Conversation,
  CreateConversationInput,
  CreateReplyInput,
  GetConversationsParams,
  Post,
} from '@/app/lib/types/conversation';
import type { PaginatedResponse } from '@/app/lib/types/common';

export interface ConversationsApi {
  getConversations(
    params: GetConversationsParams
  ): Promise<PaginatedResponse<Conversation>>;

  getConversation(id: string): Promise<Conversation>;

  createConversation(input: CreateConversationInput): Promise<Conversation>;

  createReply(
    conversationId: string,
    input: CreateReplyInput
  ): Promise<Post>;
}
