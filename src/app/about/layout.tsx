import React from 'react'
import { Metadata } from 'next'
import { siteUrl } from '@/lib/site'

const aboutUrl = siteUrl('/about')

export const metadata: Metadata = {
  title: 'About Cristopher Palacios | Full Stack & AI Developer',
  description:
    'Learn about Cristopher Palacios, a Full Stack and AI Developer from Ecuador with expertise in React, Next.js, Node.js, TypeScript, AWS, Docker, and AI integrations.',
  alternates: {
    canonical: aboutUrl,
  },
  openGraph: {
    title: 'About Cristopher Palacios | Full Stack & AI Developer',
    description:
      'Full Stack and AI Developer from Ecuador. Expert in React, Next.js, Node.js, TypeScript, AWS, and AI-powered applications. Available for freelance and full-time roles.',
    url: aboutUrl,
    type: 'profile',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
