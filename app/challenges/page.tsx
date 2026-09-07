import Link from 'next/link';
import { challengesApi } from '@/app/lib/api/client';
import FilterPanel from '@/app/components/filter-panel';
import { Pagination } from '@/app/components/pagination';
import type {
  ChallengeCategory,
  ChallengeDifficulty,
  GetChallengesParams,
} from '@/app/lib/types/challenge';

type SearchParams = {
  search?: string;
  category?: string;
  difficulty?: string;
  page?: string;
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

function buildChallengesHref(
  filters: {
    search?: string;
    category?: string;
    difficulty?: string;
  },
  page: number,
) {
  const params = new URLSearchParams();

  if (filters.search) params.set('search', filters.search);
  if (filters.category && filters.category !== 'all') {
    params.set('category', filters.category);
  }
  if (filters.difficulty && filters.difficulty !== 'all') {
    params.set('difficulty', filters.difficulty);
  }
  if (page > 1) params.set('page', String(page));

  const query = params.toString();
  return query ? `/challenges?${query}` : '/challenges';
}

export default async function Challenges({ searchParams }: PageProps) {
  const { search, category, difficulty, page: pageParam } = await searchParams;

  const requestedPage = Math.max(1, Number(pageParam) || 1);
  const pageSize = 10;

  const filters = {
    search: search || '',
    category: category || 'all',
    difficulty: difficulty || 'all',
  };

  const query: GetChallengesParams = {
    status: 'published',
    pageSize,
    ...(search && { search }),
    ...(category &&
      category !== 'all' && { category: category as ChallengeCategory }),
    ...(difficulty &&
      difficulty !== 'all' && {
        difficulty: difficulty as ChallengeDifficulty,
      }),
  };

  let { data: challenges, pagination } = await challengesApi.getChallenges({
    ...query,
    page: requestedPage,
  });

  const page = Math.min(requestedPage, pagination.totalPages);

  if (page !== requestedPage) {
    ({ data: challenges, pagination } = await challengesApi.getChallenges({
      ...query,
      page,
    }));
  }

  return (
    <main className='p-8 w-full max-w-[1280px] flex flex-col  mx-auto'>
      <Link href='/' className='text-sm underline'>
        Back to Home
      </Link>
      <h1 className='text-2xl font-semibold'>Challenges</h1>
      <p className='mt-2 text-sm text-neutral-600'>
        {pagination.totalItems} published challenges
      </p>

      <FilterPanel currentFilters={filters} />

      <ul className='space-y-3'>
        {challenges.map((challenge) => (
          <li key={challenge.challenge_id}>
            <Link
              href={`/challenges/${challenge.challenge_id}`}
              className='block rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50'
            >
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <h2 className='font-medium'>{challenge.title}</h2>
                  <p className='mt-1 text-sm text-neutral-600'>
                    {challenge.category}
                  </p>
                </div>
                <div>
                  <div className='text-right text-sm text-neutral-600'>
                    <p>{challenge.difficulty}</p>
                    <p className='mt-1'>{challenge.points} pts</p>
                  </div>
                  <div className='shrink-0 text-right text-sm text-neutral-600'>
                    <p className='mt-1'>{challenge.estimated_minutes} min</p>
                  </div>
                </div>
              </div>
              <div className='mt-2 flex flex-wrap gap-2'>
                {challenge.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className='rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <Pagination
        page={page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        pageSize={pagination.pageSize}
        buildHref={(nextPage) => buildChallengesHref(filters, nextPage)}
      />
    </main>
  );
}
