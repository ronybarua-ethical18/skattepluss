import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './ui/accordion';
import { Dot, Menu } from 'lucide-react';
import CompanyLogo from './CompanyLogo';
import HelpAskingCard from './HelpAskingCard';
import { usePathname } from 'next/navigation';
import { menuConfig } from '@/utils/dummy';
import { cn } from '@/lib/utils';

type MenuItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  subItems?: MenuItem[];
};

type MenuConfig = {
  [role: string]: MenuItem[];
};
interface MobileNavProps {
  role: string;
}
function MobileNav({ role }: MobileNavProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems: MenuItem[] = useMemo(
    () => (menuConfig as MenuConfig)[role] || [],
    [role]
  );

  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);

  useEffect(() => {
    if (menuRef.current) {
      const activeLink = menuRef.current.querySelector('.active');
      activeLink?.scrollIntoView({ block: 'nearest' });
    }

    const currentMenu = menuItems.find((item) => pathname.includes(item.href));
    if (currentMenu) {
      setSelectedMenu(currentMenu.href);
    }
  }, [pathname, menuItems]);

  const handleMenuClick = (href: string) => {
    setSelectedMenu(href);
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col pb-9">
        <Link href="/" className="">
          <CompanyLogo color="#5B52F9" />
          <p className="text-xs text-[#5B52F9] font-medium">Welcome</p>
        </Link>
        <nav className="grid mt-8 items-start text-sm font-medium gap-2">
          {menuItems.map(({ href, label, icon: Icon, badge, subItems }) =>
            subItems ? (
              <Accordion
                type="single"
                collapsible
                className="space-y-4"
                key={label}
              >
                <AccordionItem value={label} className="border-none">
                  <AccordionTrigger className="flex hover:hover:no-underline text-[#71717A] justify-between items-center p-2 rounded-lg hover:bg-violet-100">
                    <span className="flex items-center">
                      <Icon className="mr-2 h-[20px] w-[20px] text-[#71717A]" />
                      {label}
                    </span>
                    {badge && (
                      <Badge className="ml-auto flex h-6 w-6 border-red-700 shrink-0 items-center justify-center rounded-full">
                        {badge}
                      </Badge>
                    )}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="ml-4 space-y-2 mt-2">
                      {subItems.map(({ href: subHref, label: subLabel }) => (
                        <Link
                          href={'#'}
                          key={subLabel}
                          onClick={() => handleMenuClick(subHref)}
                          className={cn(
                            'pl-4 py-1 flex items-center text-sm  rounded-md transition-colors duration-200 w-full text-left hover:bg-violet-100',
                            selectedMenu === subHref
                              ? 'bg-[#5B52F9] text-white'
                              : 'text-gray-600'
                          )}
                        >
                          <span className="flex items-center">
                            <Dot />
                            <p>{subLabel}</p>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <Link
                key={href}
                href={'#'}
                onClick={() => handleMenuClick(href)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 hover:bg-violet-100 py-2 text-muted-foreground transition-all hover:text-primary w-full text-left',
                  selectedMenu === href ? 'bg-[#5B52F9] text-white' : ''
                )}
              >
                <Icon
                  className={cn(
                    'h-[20px] w-[20px] text-[#71717A]',
                    selectedMenu === href && 'text-white'
                  )}
                />
                <span
                  className={cn(
                    'font-semibold text-sm text-[#71717A]',
                    selectedMenu === href && 'text-white'
                  )}
                >
                  {label}
                </span>
                {badge && (
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    {badge}
                  </Badge>
                )}
              </Link>
            )
          )}
        </nav>
        <div className="mt-auto ">
          <HelpAskingCard />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
