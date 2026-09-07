import Link from 'next/link';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { conversationsApi } from '@/app/lib/api/client';
import { ReplyForm } from '@/app/components/reply-form';

type Props = {
  params: Promise<{ id: string }>;
};

async function createReplyAction(formData: FormData) {
  'use server';

  const conversationId = String(formData.get('conversationId') ?? '');
  const content = String(formData.get('content') ?? '').trim();

  if (!conversationId || !content) {
    throw new Error('Reply content is required');
  }

  await conversationsApi.createReply(conversationId, {
    content,
    user: 'you',
    user_role: 'learner',
  });

  revalidatePath(`/conversation/${conversationId}`);
}

export default async function Conversation({ params }: Props) {
  const { id } = await params;

  let conversation;
  try {
    conversation = await conversationsApi.getConversation(id);
  } catch {
    notFound();
  }

  return (
    <main className='p-8 w-full max-w-[1280px] flex flex-col mx-auto'>
      <Link
        href={`/challenges/${conversation.challenge_id}`}
        className='text-sm underline'
      >
        Back to challenge
      </Link>

      <h1 className='mt-4 text-2xl font-semibold'>{conversation.topic}</h1>
      <p className='mt-2 text-sm text-neutral-600'>
        {conversation.category} · {conversation.status} ·{' '}
        {conversation.posts.length} posts
      </p>

      {conversation.tags.length > 0 && (
        <div className='mt-4 flex flex-wrap gap-2'>
          {conversation.tags.map((tag) => (
            <span
              key={tag}
              className='rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700'
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <ul className='mt-8 space-y-4'>
        {conversation.posts.map((post) => (
          <li
            key={post.post_id}
            className='rounded-lg border border-neutral-200 p-4'
          >
            <div className='flex flex-wrap items-center justify-between gap-2 text-sm text-neutral-600'>
              <p>
                <span className='font-medium text-neutral-900'>
                  {post.user}
                </span>
                <span className='mx-2'>·</span>
                {post.user_role}
              </p>
              <time dateTime={post.timestamp}>
                {new Date(post.timestamp).toLocaleString()}
              </time>
            </div>
            <div className='prose prose-sm mt-3 max-w-none text-neutral-800'>
              <Markdown remarkPlugins={[remarkGfm]}>{post.content}</Markdown>
            </div>
            {(post.reactions.upvotes > 0 || post.reactions.helpful > 0) && (
              <p className='mt-3 text-xs text-neutral-500'>
                {post.reactions.upvotes} upvotes · {post.reactions.helpful}{' '}
                helpful
              </p>
            )}
          </li>
        ))}
      </ul>

      <section className='mt-10'>
        <h2 className='text-lg font-semibold'>Add a reply</h2>
        <ReplyForm
          conversationId={conversation.identifier}
          disabled={conversation.is_locked}
          action={createReplyAction}
        />
      </section>
    </main>
  );
}
