const DEFAULTS = {
  github: 'https://github.com/crisldu96',
  linkedin: 'https://www.linkedin.com/in/cristopher-palacios-791704160',
  devto: 'https://dev.to/crisldu96',
  email: 'cristopher.palacios@actuaria.com',
} as const;

export const social = {
  github: process.env.NEXT_PUBLIC_GITHUB_URL || DEFAULTS.github,
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || DEFAULTS.linkedin,
  devto: process.env.NEXT_PUBLIC_DEVTO_URL || DEFAULTS.devto,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || DEFAULTS.email,
} as const;

export const socialHandles = {
  github: '@' + social.github.split('/').filter(Boolean).pop(),
  linkedin: '@' + social.linkedin.split('/').filter(Boolean).pop(),
  devto: '@' + social.devto.split('/').filter(Boolean).pop(),
} as const;

export const mailto = `mailto:${social.email}`;
