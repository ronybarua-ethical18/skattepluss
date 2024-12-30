import React from 'react';
import MobileNav from './MobileNav';
import Link from 'next/link';
import CompanyLogo from './CompanyLogo';

import ProfileDropdown from './Dropdown';
import { useTranslation } from '@/lib/TranslationProvider';
import LanguageSwitcher from './LanguageSwitcher';
import { useSession } from 'next-auth/react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

interface TopbarProps {
  role: string;
}

const Topbar: React.FC<TopbarProps> = ({ role }) => {
  const { translate } = useTranslation();
  const { data: session } = useSession();
  const isGreaterThan1600: boolean = useMediaQuery('(min-width: 1601px)');

  console.log('session from topbar', session);
  return (
    <header
      className={cn(
        'flex bg-[#00104B] justify-between h-14 items-center  lg:h-[60px] px-8',
        isGreaterThan1600 && 'px-[128px]'
      )}
    >
      <MobileNav role={role || ''} />
      <div className="hidden md:flex items-center ">
        <Link href="/" className="">
          <CompanyLogo />
          <p className="text-xs text-white font-medium">
            {translate('page.welcome.message')}
          </p>
        </Link>
      </div>
      <div className="flex items-center space-x-8">
        <LanguageSwitcher />
        {session?.user?.role === 'auditor' && (
          <div className="border-l-2 border-r-2 px-2 py-1">
            <p className="text-xs text-white font-semibold">View Mode</p>
            <small className=" text-xs text-white font-extralight">
              {session?.user?.customer_email}
            </small>
          </div>
        )}
        <ProfileDropdown role={role || ''} />
      </div>
    </header>
  );
};

export default Topbar;
