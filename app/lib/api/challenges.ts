import type { Challenge, GetChallengesParams } from '@/app/lib/types/challenge';
import type { PaginatedResponse } from '@/app/lib/types/common';

export interface ChallengesApi {
  getChallenges(
    params: GetChallengesParams
  ): Promise<PaginatedResponse<Challenge>>;

  getChallenge(id: string): Promise<Challenge>;
}
