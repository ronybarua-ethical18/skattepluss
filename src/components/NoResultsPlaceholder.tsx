import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import looking from '../../public/Looking.svg';

interface NoResultsPlaceholderProps {
  message?: string;
  actionText?: string;
  onActionClick?: () => void;
  className?: string;
}

export function NoResultsPlaceholder({
  message = 'No results found.',
  className,
}: NoResultsPlaceholderProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 text-center py-8',
        className
      )}
    >
      <div className="relative w-full max-w-[150px] h-auto aspect-[150/100]">
        <Image
          src={looking}
          alt="Looking illustration"
          fill
          className="rounded object-contain"
          priority
        />
      </div>
      <p className="text-sm text-muted-foreground sm:text-base">{message}</p>
    </div>
  );
}
