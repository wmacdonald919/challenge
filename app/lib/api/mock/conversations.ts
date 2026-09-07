import conversationsData from '@/app/lib/mock-data/pennylane_support_conversations.json';
import type { ConversationsApi } from '@/app/lib/api/conversations';
import type {
  Conversation,
  CreateConversationInput,
  CreateReplyInput,
  GetConversationsParams,
  Post,
} from '@/app/lib/types/conversation';
import type { PaginatedResponse } from '@/app/lib/types/common';

const conversations = conversationsData.support_conversations as Conversation[];

function filterConversations(params: GetConversationsParams): Conversation[] {
  let results = [...conversations];

  if (params.challenge_id) {
    results = results.filter((c) => c.challenge_id === params.challenge_id);
  }

  if (params.status) {
    results = results.filter((c) => c.status === params.status);
  }

  if (params.search) {
    const query = params.search.toLowerCase();
    results = results.filter(
      (c) =>
        c.topic.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  return results;
}

export const mockConversationsApi: ConversationsApi = {
  async getConversations(
    params: GetConversationsParams
  ): Promise<PaginatedResponse<Conversation>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const filtered = filterConversations(params);
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return {
      data,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
      },
    };
  },

  async getConversation(id: string): Promise<Conversation> {
    const conversation = conversations.find((c) => c.identifier === id);

    if (!conversation) {
      throw new Error(`Conversation not found: ${id}`);
    }

    return conversation;
  },

  async createConversation(
    input: CreateConversationInput
  ): Promise<Conversation> {
    const now = new Date().toISOString();
    const identifier = `CONV_${String(conversations.length + 1).padStart(4, '0')}`;
    const firstPost: Post = {
      post_id: 1,
      user: input.user,
      timestamp: now,
      content: input.content,
      user_role: 'learner',
      reactions: { upvotes: 0, helpful: 0 },
      is_accepted_answer: false,
    };

    const conversation: Conversation = {
      identifier,
      topic: input.topic,
      category: input.category,
      posts: [firstPost],
      challenge_id: input.challenge_id,
      status: 'open',
      priority: 'medium',
      tags: input.tags ?? [],
      created_at: now,
      updated_at: now,
      last_activity_at: now,
      participant_count: 1,
      participants: [input.user],
      view_count: 0,
      is_pinned: false,
      is_locked: false,
      assigned_to: '',
      resolution_time_hours: 0,
      description: input.content,
    };

    conversations.push(conversation);
    return conversation;
  },

  async createReply(
    conversationId: string,
    input: CreateReplyInput
  ): Promise<Post> {
    const conversation = conversations.find(
      (c) => c.identifier === conversationId
    );

    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    const now = new Date().toISOString();
    const post: Post = {
      post_id: conversation.posts.length + 1,
      user: input.user,
      timestamp: now,
      content: input.content,
      user_role: input.user_role ?? 'learner',
      reactions: { upvotes: 0, helpful: 0 },
      is_accepted_answer: false,
    };

    conversation.posts.push(post);
    conversation.updated_at = now;
    conversation.last_activity_at = now;

    if (!conversation.participants.includes(input.user)) {
      conversation.participants.push(input.user);
      conversation.participant_count = conversation.participants.length;
    }

    return post;
  },
};
