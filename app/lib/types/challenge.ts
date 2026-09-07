import type { PaginationParams } from './common';

export type ChallengeStatus = 'published' | 'draft' | 'archived';
export type ChallengeDifficulty =
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced'
  | 'Expert';

  export type ChallengeCategory =  'Hamiltonians'
   | 'Photonics'
   | 'Quantum'
   | 'Algorithms'
   | 'Quantum Chemistry'
   | 'Quantum Circuits'
   | 'Error Correction'
   | 'Getting Started'
   | 'Optimization'
   | 'Compilation'
   | 'Hardware'

export interface Challenge {
  challenge_id: string;
  title: string;
  description: string;
  category: string;
  difficulty: ChallengeDifficulty;
  points: number;
  tags: string[];
  learning_objectives: string[];
  hints: string[];
  status: ChallengeStatus;
  estimated_minutes: number;
  completion_rate: number;
  attempt_count: number;
  average_attempts_to_pass: number;
  created_at: string;
  updated_at: string;
  author: string;
  prerequisite_challenge_ids: string[];
}

export interface GetChallengesParams extends PaginationParams {
  status?: ChallengeStatus;
  difficulty?: ChallengeDifficulty;
  category?: string;
  search?: string;
}
