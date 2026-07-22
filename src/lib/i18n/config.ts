export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ar';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
};

export const rtlLocales: Locale[] = ['ar'];

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return rtlLocales.includes(locale) ? 'rtl' : 'ltr';
}

export function getDateLocale(locale: Locale): string {
  return locale === 'ar' ? 'ar-EG' : 'en-US';
}

export function getNumberFormatter(locale: Locale) {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US');
}

export const mealNames: Record<Locale, Record<string, string>> = {
  en: {
    suhoor: 'Pre-Dawn Meal',
    iftar: 'Sunset Meal',
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
  },
  ar: {
    suhoor: 'وجبة السحور',
    iftar: 'وجبة الإفطار',
    breakfast: 'الفطور',
    lunch: 'الغداء',
    dinner: 'العشاء',
    snack: 'وجبة خفيفة',
  },
};
