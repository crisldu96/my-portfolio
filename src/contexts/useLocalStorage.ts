'use client';
import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------

export default function useLocalStorage<ValueType>(key: string, defaultValue: ValueType) {
  // Always start from defaultValue so SSR and first client render match.
  // Hydrate from localStorage after mount to avoid React hydration mismatches.
  const [value, setValue] = useState<ValueType>(defaultValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) setValue(JSON.parse(stored));
    } catch {
      // ignore malformed value
    }
    const listener = (e: StorageEvent) => {
      if (e.storageArea === localStorage && e.key === key) {
        setValue(e.newValue ? JSON.parse(e.newValue) : defaultValue);
      }
    };
    window.addEventListener('storage', listener);
    return () => {
      window.removeEventListener('storage', listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValueInLocalStorage = (newValue: ValueType) => {
    setValue((currentValue: ValueType) => {
      const result =
        typeof newValue === 'function'
          ? (newValue as (prev: ValueType) => ValueType)(currentValue)
          : newValue;
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(key, JSON.stringify(result));
        }
      } catch {
        // ignore quota / disabled storage
      }
      return result;
    });
  };

  return [value, setValueInLocalStorage] as const;
}
