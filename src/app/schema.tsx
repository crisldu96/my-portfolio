import { social } from '@/config/social';

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Cristopher Palacios',
  url: 'https://cristopherpalacios.dev',
  jobTitle: 'Full Stack & AI Developer',
  description:
    'Full Stack and AI Developer from Ecuador specializing in React, Next.js, Node.js, TypeScript, and AI-powered applications.',
  image: 'https://cristopherpalacios.dev/assets/images/og-image.png',
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
  url: 'https://cristopherpalacios.dev',
  description:
    'Portfolio of Cristopher Palacios, Full Stack & AI Developer from Ecuador.',
  author: {
    '@type': 'Person',
    name: 'Cristopher Palacios',
  },
  inLanguage: ['en', 'es'],
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://cristopherpalacios.dev/?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const profilePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  name: 'Cristopher Palacios | Full Stack & AI Developer',
  url: 'https://cristopherpalacios.dev',
  description:
    'Professional portfolio of Cristopher Palacios, a Full Stack and AI Developer based in Ecuador.',
  mainEntity: {
    '@type': 'Person',
    name: 'Cristopher Palacios',
    url: 'https://cristopherpalacios.dev',
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
