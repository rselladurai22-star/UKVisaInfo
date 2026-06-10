import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const MAX = 6;

export function useRecentVisas() {
  const [recent, setRecent] = useLocalStorage<string[]>('ukvh.recent', []);

  const add = useCallback((id: string) => {
    setRecent((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, MAX));
  }, [setRecent]);

  const clear = useCallback(() => setRecent([]), [setRecent]);

  return { recent, add, clear };
}
