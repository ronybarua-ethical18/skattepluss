import 'server-only';
import { Locale } from '../../i18n.config';

// Define the dictionary type
type Dictionary = Record<Locale, () => Promise<unknown>>;

const dictionaries: Dictionary = {
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  no: () => import('../dictionaries/no.json').then((module) => module.default),
} as const;

export const getDictionary = async (locale: Locale) => {
  if (!dictionaries[locale]) {
    return;
  }
  return dictionaries[locale]();
};
