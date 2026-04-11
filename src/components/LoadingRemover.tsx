'use client';
import { useEffect } from 'react';

export default function LoadingRemover() {
  useEffect(() => {
    const el = document.getElementById('app-loading');
    if (!el) return;
    el.classList.add('fade-out');
    const timer = setTimeout(() => el.remove(), 450);
    return () => clearTimeout(timer);
  }, []);
  return null;
}
