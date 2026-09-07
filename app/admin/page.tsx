import Link from 'next/link';
import { adminApi } from '@/app/lib/api/client';

function formatPercent(rate: number) {
  return `${Math.round(rate * 100)}%`;
}

function formatNumber(value: number) {
  return value.toLocaleString();
}

export default async function Admin() {
  const { status_counts, challenges, needs_attention } =
    await adminApi.getDashboard();

  const summaryCards = [
    { label: 'Total conversations', value: status_counts.total },
    { label: 'Open conversations', value: status_counts.open },
    { label: 'Answered', value: status_counts.answered },
    { label: 'Resolved', value: status_counts.resolved },
  ];

  return (
    <main className='p-8 w-full max-w-[1280px] flex flex-col  mx-auto'>
      <div className='flex items-end justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold'>Admin</h1>
          <p className='mt-2 text-sm text-neutral-600'>
            Challenge support overview
          </p>
        </div>
        <Link href='/challenges' className='text-sm underline'>
          View challenges
        </Link>
      </div>

      <section className='mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className='rounded-lg border border-neutral-200 bg-white p-4'
          >
            <p className='text-sm text-neutral-600'>{card.label}</p>
            <p className='mt-2 text-3xl font-semibold tabular-nums'>
              {formatNumber(card.value)}
            </p>
          </div>
        ))}
      </section>

      <section className='mt-10'>
        <h2 className='text-xl font-semibold'>Challenges</h2>
        <p className='mt-2 text-sm text-neutral-600'>
          Support volume, completion, and attempts by challenge
        </p>

        <div className='mt-4 overflow-x-auto rounded-lg border border-neutral-200'>
          <table className='min-w-full text-left text-sm'>
            <thead className='border-b border-neutral-200 bg-neutral-50 text-neutral-600'>
              <tr>
                <th className='px-4 py-3 font-medium'>Challenge</th>
                <th className='px-4 py-3 font-medium'>Difficulty</th>
                <th className='px-4 py-3 font-medium text-right'>
                  Support questions
                </th>
                <th className='px-4 py-3 font-medium text-right'>Open</th>
                <th className='px-4 py-3 font-medium text-right'>Completion</th>
                <th className='px-4 py-3 font-medium text-right'>Attempts</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map(
                ({ challenge, support_question_count, open_count }) => (
                  <tr
                    key={challenge.challenge_id}
                    className='border-b border-neutral-100 last:border-b-0'
                  >
                    <td className='px-4 py-3'>
                      <Link
                        href={`/challenges/${challenge.challenge_id}`}
                        className='font-medium underline-offset-2 hover:underline'
                      >
                        {challenge.title}
                      </Link>
                      <p className='mt-0.5 text-xs text-neutral-500'>
                        {challenge.challenge_id} · {challenge.category}
                      </p>
                    </td>
                    <td className='px-4 py-3 text-neutral-700'>
                      {challenge.difficulty}
                    </td>
                    <td className='px-4 py-3 text-right tabular-nums'>
                      {formatNumber(support_question_count)}
                    </td>
                    <td className='px-4 py-3 text-right tabular-nums'>
                      {formatNumber(open_count)}
                    </td>
                    <td className='px-4 py-3 text-right tabular-nums'>
                      {formatPercent(challenge.completion_rate)}
                    </td>
                    <td className='px-4 py-3 text-right tabular-nums'>
                      {formatNumber(challenge.attempt_count)}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className='mt-10'>
        <h2 className='text-xl font-semibold'>Needs attention</h2>
        <p className='mt-2 text-sm text-neutral-600'>
          High and urgent open questions with no answer yet
        </p>

        {needs_attention.length === 0 ? (
          <p className='mt-4 text-sm text-neutral-600'>
            No high-priority unanswered conversations right now.
          </p>
        ) : (
          <ul className='mt-4 space-y-3'>
            {needs_attention.map((conversation) => (
              <li key={conversation.identifier}>
                <Link
                  href={`/conversation/${conversation.identifier}`}
                  className='block rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50'
                >
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <h3 className='font-medium'>{conversation.topic}</h3>
                      <p className='mt-1 text-sm text-neutral-600'>
                        {conversation.identifier} · {conversation.challenge_id}{' '}
                        · {conversation.category}
                      </p>
                    </div>
                    <div className='shrink-0 text-right text-sm'>
                      <p
                        className={
                          conversation.priority === 'urgent'
                            ? 'font-medium text-red-700'
                            : 'font-medium text-amber-700'
                        }
                      >
                        {conversation.priority}
                      </p>
                      <p className='mt-1 text-neutral-600'>
                        {conversation.posts.length} posts
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
