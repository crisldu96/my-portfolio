'use client';
import { createContext, ReactNode } from 'react';
import _ from 'lodash';
import useConfig from '@/hooks/useConfig';
import dataContentEsp from '@/data/text-content-es.json';
import dataContentEng from '@/data/text-content-en.json';

type TextContent = typeof dataContentEng;

interface LanguageContextType {
  handleTranslation: <T = string>(key: string) => T;
}

const initialState: LanguageContextType = {
  handleTranslation: () => '' as never
};

const LanguageContext = createContext(initialState);

type LanguageProviderProps = {
  children: ReactNode;
};

const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const { locale } = useConfig();

  const handleTranslation = <T = string>(key: string): T => {
    const currentDictionary: TextContent = locale === 'es' ? dataContentEsp : dataContentEng;
    return _.get(currentDictionary, key) as T;
  };

  return (
    <LanguageContext.Provider value={{ handleTranslation }}>
      {children}
    </LanguageContext.Provider>
  );
};

export { LanguageContext, LanguageProvider };
