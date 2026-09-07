import Link from 'next/link';
import { notFound } from 'next/navigation';
import { challengesApi, conversationsApi } from '@/app/lib/api/client';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Challenge({ params }: Props) {
  const { id } = await params;

  let challenge;
  try {
    challenge = await challengesApi.getChallenge(id);
  } catch {
    notFound();
  }

  const { data: conversations, pagination } =
    await conversationsApi.getConversations({
      challenge_id: challenge.challenge_id,
      pageSize: 50,
    });

  return (
    <main className='p-8 w-full max-w-[1280px] flex flex-col  mx-auto'>
      <Link href='/challenges' className='text-sm underline'>
        Back to challenges
      </Link>

      <h1 className='mt-4 text-2xl font-semibold'>{challenge.title}</h1>
      <p className='mt-2 text-sm text-neutral-600'>
        {challenge.category} · {challenge.difficulty} · {challenge.points} pts
      </p>
      <p className='mt-4 max-w-2xl text-neutral-800'>
        <Markdown remarkPlugins={[remarkGfm]}>{challenge.description}</Markdown>
      </p>

      {challenge.tags.length > 0 && (
        <div className='mt-4 flex flex-wrap gap-2'>
          {challenge.tags.map((tag) => (
            <span
              key={tag}
              className='rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700'
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <section className='mt-10'>
        <h2 className='text-xl font-semibold'>Conversations</h2>
        <p className='mt-2 text-sm text-neutral-600'>
          {pagination.totalItems} related conversations
        </p>

        {conversations.length === 0 ? (
          <p className='mt-4 text-sm text-neutral-600'>
            No conversations for this challenge yet.
          </p>
        ) : (
          <ul className='mt-6 space-y-3'>
            {conversations.map((conversation) => (
              <li key={conversation.identifier}>
                <Link
                  href={`/conversation/${conversation.identifier}`}
                  className='block rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50'
                >
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <h3 className='font-medium'>{conversation.topic}</h3>
                      <p className='mt-1 text-sm text-neutral-600'>
                        {conversation.category}
                      </p>
                    </div>
                    <div className='shrink-0 text-right text-sm text-neutral-600'>
                      <p>{conversation.status}</p>
                      <p className='mt-1'>{conversation.posts.length} posts</p>
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
