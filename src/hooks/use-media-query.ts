'use client';
import { useState, useEffect } from 'react';

export const useMediaQuery = (
  query: string,
  defaultMatches: boolean = false
): boolean => {
  const [matches, setMatches] = useState<boolean>(defaultMatches);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      setMatches(media.matches);

      const listener = () => setMatches(media.matches);
      media.addEventListener('change', listener);

      return () => media.removeEventListener('change', listener);
    }
  }, [query]);

  return matches;
};
