import challengesData from '@/app/lib/mock-data/pennylane_coding_challenges.json';
import type { ChallengesApi } from '@/app/lib/api/challenges';
import type { Challenge, GetChallengesParams } from '@/app/lib/types/challenge';
import type { PaginatedResponse } from '@/app/lib/types/common';

const challenges = challengesData.coding_challenges as Challenge[];

function filterChallenges(params: GetChallengesParams): Challenge[] {
  let results = [...challenges];

  if (params.status) {
    results = results.filter((c) => c.status === params.status);
  }

  if (params.difficulty) {
    results = results.filter((c) => c.difficulty === params.difficulty);
  }

  if (params.category) {
    results = results.filter((c) => c.category === params.category);
  }

  if (params.search) {
    const query = params.search.toLowerCase();
    results = results.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  return results;
}

export const mockChallengesApi: ChallengesApi = {
  async getChallenges(
    params: GetChallengesParams
  ): Promise<PaginatedResponse<Challenge>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const filtered = filterChallenges(params);
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

  async getChallenge(id: string): Promise<Challenge> {
    const challenge = challenges.find((c) => c.challenge_id === id);

    if (!challenge) {
      throw new Error(`Challenge not found: ${id}`);
    }

    return challenge;
  },
};
