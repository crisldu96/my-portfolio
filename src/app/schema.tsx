import { social } from '@/config/social';
import { SITE_URL, siteUrl } from '@/lib/site';

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Cristopher Palacios',
  url: SITE_URL,
  jobTitle: 'Full Stack & AI Developer',
  description:
    'Full Stack and AI Developer from Ecuador specializing in React, Next.js, Node.js, TypeScript, and AI-powered applications.',
  image: siteUrl('/assets/images/og-image.png'),
  sameAs: [social.linkedin, social.github, social.devto],
  knowsAbout: [
    'React',
    'Next.js',
    'Node.js',
    'TypeScript',
    'JavaScript',
    'NestJS',
    'Express',
    'PostgreSQL',
    'MongoDB',
    'AWS',
    'Docker',
    'GraphQL',
    'Python',
    'Artificial Intelligence',
    'Machine Learning',
    'CI/CD',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'Freelance',
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'EC',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Cristopher Palacios Portfolio',
  url: SITE_URL,
  description:
    'Portfolio of Cristopher Palacios, Full Stack & AI Developer from Ecuador.',
  author: {
    '@type': 'Person',
    name: 'Cristopher Palacios',
  },
  inLanguage: 'en',
};

const profilePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  name: 'Cristopher Palacios | Full Stack & AI Developer',
  url: SITE_URL,
  description:
    'Professional portfolio of Cristopher Palacios, a Full Stack and AI Developer based in Ecuador.',
  mainEntity: {
    '@type': 'Person',
    name: 'Cristopher Palacios',
    url: SITE_URL,
  },
};

export default function Schema() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
    </>
  );
}
