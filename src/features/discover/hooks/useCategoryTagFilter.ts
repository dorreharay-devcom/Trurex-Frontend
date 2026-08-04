import { useCallback, useState } from 'react';
import { ALL_CATEGORIES } from '~/features/discover/types';

export function useCategoryTagFilter() {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const toggleCategory = useCallback((code: string) => {
    setActiveCategory((prev) => (prev === code ? ALL_CATEGORIES : code));
  }, []);

  const toggleTag = useCallback((slug: string) => {
    setActiveTag((prev) => (prev === slug ? null : slug));
  }, []);

  return { activeCategory, activeTag, toggleCategory, toggleTag };
}
