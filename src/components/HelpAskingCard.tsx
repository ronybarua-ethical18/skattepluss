import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ExpertIcon from '../../public/xpert_assist.svg';
import DocumentImage from '../../public/document.svg';
import { useTranslation } from '@/lib/TranslationProvider';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

const HelpAskingCard = () => {
  const { translate } = useTranslation();
  const isGreaterThan1600: boolean = useMediaQuery('(min-width: 1601px)');

  return (
    <div className="flex flex-col items-center px-6 py-6 w-full bg-indigo-50 rounded-2xl max-h-[213px]">
      <Image
        src={ExpertIcon}
        alt="Expert Icon"
        width={51}
        height={51}
        className="object-contain aspect-square"
      />
      <div
        className={cn(
          'flex flex-col mt-6 w-full max-w-[165px]',
          !isGreaterThan1600 && 'mt-2'
        )}
      >
        <div className="flex flex-col items-center self-center text-zinc-500">
          <p className="text-sm font-semibold leading-none">
            {translate('page.dashboard.help')}
          </p>
          <p className="text-xs leading-loose text-center">
            {translate('page.dashboard.check')}
          </p>
        </div>
        <Link
          href="/documentation"
          className={cn(
            'flex gap-2.5 justify-center items-center px-4 py-1.5 mt-4 w-full text-sm font-medium leading-6 text-white whitespace-nowrap bg-indigo-500 rounded-md min-h-[36px]',
            !isGreaterThan1600 && 'mt-2'
          )}
        >
          <Image
            src={DocumentImage}
            alt="Documentation Icon"
            width={20}
            height={20}
            className="object-contain shrink-0 self-stretch my-auto"
          />
          <span className="self-stretch my-auto">
            {translate('page.dashboard.documentation')}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default HelpAskingCard;
