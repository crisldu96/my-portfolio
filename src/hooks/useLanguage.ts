'use client';
import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

// ==============================|| LANGUAGE - HOOKS  ||============================== //

const useLanguage = () => useContext(LanguageContext);

export default useLanguage;
