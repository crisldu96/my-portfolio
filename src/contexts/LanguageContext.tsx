'use client';
import { createContext, ReactNode } from 'react';
import _ from 'lodash';
import useConfig from '@/hooks/useConfig';
import dataContentEsp from '@/data/text-content-es.json';

const initialState: any = {
  handleTraslation: () => { }
};

const LanguageContext = createContext(initialState);

type LanguageProviderProps = {
  children: ReactNode;
};

const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const { locale } = useConfig();

  const handleTraslation = (key: string): any => {
    const currentDictionary: any = locale === 'es' ? dataContentEsp : dataContentEsp;
    const value = _.get(currentDictionary, key);
    return value;
  };

  return (
    <LanguageContext.Provider
      value={{
        handleTraslation
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export { LanguageContext, LanguageProvider };