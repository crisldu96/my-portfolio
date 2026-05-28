const FALLBACK_SITE_URL = 'https://cristopher-palacios.vercel.app';

const stripTrailingSlash = (url: string) => url.replace(/\/+$/, '');

export const SITE_URL = stripTrailingSlash(
  process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL,
);

export const siteUrl = (path = ''): string => {
  if (!path) return SITE_URL;
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${suffix}`;
};
