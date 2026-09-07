'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

type Props = {
  conversationId: string;
  disabled?: boolean;
  action: (formData: FormData) => Promise<void>;
};

export function ReplyForm({ conversationId, disabled, action }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className='mt-6 space-y-3 w-full'
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          try {
            await action(formData);
            router.refresh();
          } catch {
            setError('Could not post reply. Please try again.');
          }
        });
      }}
    >
      <input type='hidden' name='conversationId' value={conversationId} />
      <textarea
        id='reply'
        name='content'
        required
        disabled={disabled || isPending}
        rows={4}
        placeholder={
          disabled ? 'This conversation is locked.' : 'Write your reply…'
        }
        className='w-full rounded-lg border border-neutral-300 p-3 text-sm outline-none focus:border-neutral-500 disabled:bg-neutral-50 disabled:text-neutral-500'
      />
      {error && <p className='text-sm text-red-600'>{error}</p>}
      <button
        type='submit'
        disabled={disabled || isPending}
        className='rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-neutral-400'
      >
        {isPending ? 'Posting…' : 'Post reply'}
      </button>
    </form>
  );
}
