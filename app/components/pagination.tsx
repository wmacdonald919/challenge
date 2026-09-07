import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';

type Props = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  buildHref: (page: number) => string;
};

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  buildHref,
}: Props) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <nav
      className='mt-8 flex flex-wrap items-center justify-between gap-4 bottom-0 sticky bg-white py-2'
      aria-label='Pagination'
    >
      <p className='text-sm text-neutral-600'>
        Showing {start}–{end} of {totalItems}
      </p>

      <div className='flex items-center gap-2'>
        <Link
          href={buildHref(page - 1)}
          className='rounded-lg border border-neutral-200 px-3 py-1.5 text-sm transition-colors hover:bg-neutral-50'
          aria-disabled={page < 1}
        >
          <ArrowLeftIcon width={16} title='Previous page' />
        </Link>

        <span className='px-2 text-sm tabular-nums text-neutral-700'>
          Page {page} of {totalPages}
        </span>

        <Link
          href={buildHref(page + 1)}
          className='rounded-lg border border-neutral-200 px-3 py-1.5 text-sm transition-colors hover:bg-neutral-50'
          aria-disabled={page === totalPages}
        >
          <ArrowRightIcon width={16} title='Next page' />
        </Link>
      </div>
    </nav>
  );
}
