import challengesData from '@/app/lib/mock-data/pennylane_coding_challenges.json';
import conversationsData from '@/app/lib/mock-data/pennylane_support_conversations.json';
import type { AdminApi } from '@/app/lib/api/admin';
import type {
  AdminDashboard,
  ChallengeSupportRow,
} from '@/app/lib/types/admin';
import type { Challenge } from '@/app/lib/types/challenge';
import type { Conversation } from '@/app/lib/types/conversation';

const challenges = challengesData.coding_challenges as Challenge[];
const conversations =
  conversationsData.support_conversations as Conversation[];

function hasAnswer(conversation: Conversation): boolean {
  return conversation.posts.some(
    (post) =>
      post.is_accepted_answer ||
      post.user_role === 'support' ||
      post.user_role === 'staff' ||
      post.user_role === 'mentor'
  );
}

export const mockAdminApi: AdminApi = {
  async getDashboard(): Promise<AdminDashboard> {
    const status_counts = {
      total: conversations.length,
      open: 0,
      answered: 0,
      resolved: 0,
      closed: 0,
    };

    const countsByChallenge = new Map<
      string,
      { support_question_count: number; open_count: number }
    >();

    for (const conversation of conversations) {
      if (conversation.status === 'open') status_counts.open += 1;
      else if (conversation.status === 'answered') status_counts.answered += 1;
      else if (conversation.status === 'resolved') status_counts.resolved += 1;
      else if (conversation.status === 'closed') status_counts.closed += 1;

      const current = countsByChallenge.get(conversation.challenge_id) ?? {
        support_question_count: 0,
        open_count: 0,
      };
      current.support_question_count += 1;
      if (conversation.status === 'open') current.open_count += 1;
      countsByChallenge.set(conversation.challenge_id, current);
    }

    const challengeRows: ChallengeSupportRow[] = challenges.map(
      (challenge) => {
        const counts = countsByChallenge.get(challenge.challenge_id) ?? {
          support_question_count: 0,
          open_count: 0,
        };

        return {
          challenge,
          support_question_count: counts.support_question_count,
          open_count: counts.open_count,
        };
      }
    );

    challengeRows.sort(
      (a, b) => b.support_question_count - a.support_question_count
    );

    const needs_attention = conversations
      .filter(
        (conversation) =>
          conversation.status === 'open' &&
          (conversation.priority === 'high' ||
            conversation.priority === 'urgent') &&
          !hasAnswer(conversation)
      )
      .sort((a, b) => {
        if (a.priority === b.priority) {
          return (
            new Date(b.last_activity_at).getTime() -
            new Date(a.last_activity_at).getTime()
          );
        }
        return a.priority === 'urgent' ? -1 : 1;
      });

    return {
      status_counts,
      challenges: challengeRows,
      needs_attention,
    };
  },
};
