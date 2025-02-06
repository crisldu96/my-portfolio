import useConfig from '@/hooks/useConfig';
import { createContext, ReactNode } from 'react';
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

  const handleTraslation = (key: string): string => {
    const currentDictionary: any = locale === 'es' ? dataContentEsp : dataContentEsp;
    return currentDictionary[key];
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