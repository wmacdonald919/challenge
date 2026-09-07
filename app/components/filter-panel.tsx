'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

interface Filters {
  search: string;
  category: string;
  difficulty: string;
}

export default function FilterPanel({
  currentFilters,
}: {
  currentFilters: Filters;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset to first page when filters change
    params.delete('page');

    startTransition(() => {
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  };

  return (
    <div
      className={`mb-8 flex flex-wrap gap-4 transition-opacity ${
        isPending ? 'opacity-70' : 'opacity-100'
      }`}
    >
      <input
        type='text'
        placeholder='Search challenges...'
        defaultValue={currentFilters.search}
        onChange={(e) => updateFilter('search', e.target.value)}
        className='min-w-64 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
      />

      <select
        value={currentFilters.category}
        onChange={(e) => updateFilter('category', e.target.value)}
        className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
      >
        <option value='all'>All Categories</option>
        <option value='Hamiltonians'>Hamiltonians</option>
        <option value='Photonics'>Photonics</option>
        <option value='Quantum Machine Learning'>
          Quantum Machine Learning
        </option>
        <option value='Algorithms'>Algorithms</option>
        <option value='Quantum Chemistry'>Quantum Chemistry</option>
        <option value='Quantum Circuits'>Quantum Circuits</option>
        <option value='Error Correction'>Error Correction</option>
        <option value='Getting Started'>Getting Started</option>
        <option value='Optimization'>Optimization</option>
        <option value='Compilation'>Compilation</option>
        <option value='Hardware'>Hardware</option>
      </select>

      <select
        value={currentFilters.difficulty}
        onChange={(e) => updateFilter('difficulty', e.target.value)}
        className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
      >
        <option value=''>All Difficulties</option>
        <option value='Beginner'>Beginner</option>
        <option value='Intermediate'>Intermediate</option>
        <option value='Advanced'>Advanced</option>
        <option value='Expert'>Expert</option>
      </select>
    </div>
  );
}
