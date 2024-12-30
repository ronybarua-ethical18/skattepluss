'use client';

import { createContext, useContext } from 'react';

// More specific type for nested translations
export type NestedTranslation = {
  [key: string]: string | NestedTranslation;
};

export const TranslationContext = createContext<NestedTranslation | null>(null);

export const TranslationProvider = ({
  children,
  dict,
}: {
  children: React.ReactNode;
  dict: NestedTranslation;
}) => {
  return (
    <TranslationContext.Provider value={dict}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }

  const translate = (key: string, fallback?: string): string => {
    const parts = key.split('.');
    let current: NestedTranslation | string | undefined = context;

    for (const part of parts) {
      if (current && typeof current === 'object') {
        current = current[part];
      } else {
        current = undefined;
        break;
      }
    }

    // Ensure we return a string
    if (typeof current === 'string') {
      return current;
    }

    return fallback ?? key;
  };

  return { translate };
};
