'use client';

import { useForm } from 'react-hook-form';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SearchInput({
  className,
  placeholder = 'Search',
  onChange, // Accept onChange as a prop
}: {
  className?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Define the type
}) {
  const form = useForm({
    defaultValues: {
      search: '',
    },
  });

  const searchValue = form.watch('search');

  return (
    <form>
      <div className={cn('relative w-[332px]', className)}>
        {!searchValue && (
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-[#71717A]" />
        )}
        <Input
          type="search"
          placeholder={placeholder}
          className="w-full appearance-none bg-background py-2 pl-3 shadow-none placeholder:text-[#71717A] placeholder:text-sm"
          {...form.register('search')}
          onChange={(e) => {
            form.setValue('search', e.target.value); // Update internal state
            if (onChange) {
              onChange(e); // Call the parent's onChange handler
            }
          }}
        />
      </div>
    </form>
  );
}
