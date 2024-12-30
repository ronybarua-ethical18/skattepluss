'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { MdLanguage } from 'react-icons/md';
import { i18n } from '../../i18n.config';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const languages = i18n.locales.map((locale) => ({
    code: locale,
    name: locale === 'en' ? 'English' : 'Norwegian',
  }));

  // Get the current locale from the pathname
  const currentLanguage = pathname.split('/')[1] || i18n.defaultLocale;

  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  useEffect(() => {
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);

  const switchLanguage = (language: string) => {
    if (language === selectedLanguage) return;

    // Save the language in a cookie
    document.cookie = `preferred-language=${language}; path=/;`;

    // Redirect to the same page with the new language prefix
    const newPathname = pathname.replace(
      `/${selectedLanguage}`,
      `/${language}`
    );
    router.push(newPathname);
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <MdLanguage className="mr-2 text-lg" />
            {languages.find((lang) => lang.code === selectedLanguage)?.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className="flex items-center gap-2"
            >
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default LanguageSwitcher;
