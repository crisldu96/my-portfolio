'use client';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import { IconBrandLinkedin, IconBrandGithub, IconBrandDeno, IconMail } from '@tabler/icons-react';
import SectionLabel from '../cosmic/SectionLabel';
import GlowCard from '../cosmic/GlowCard';
import { cosmic } from '@/themes/cosmicTokens';
import useLanguage from '@/hooks/useLanguage';
import { useGsapScrollTrigger } from '@/hooks/useGsapScrollTrigger';

const contactMethods = [
  {
    id: 'linkedin',
    title: 'LinkedIn',
    url: 'https://www.linkedin.com/in/cristopher-palacios-791704160',
    icon: <IconBrandLinkedin size={24} />,
    handle: '@cristopher-palacios',
  },
  {
    id: 'github',
    title: 'GitHub',
    url: 'https://github.com/CristopherPalacios',
    icon: <IconBrandGithub size={24} />,
    handle: '@CristopherPalacios',
  },
  {
    id: 'dev',
    title: 'Dev Community',
    url: 'https://dev.to/cristopher_palacios_4a172',
    icon: <IconBrandDeno size={24} />,
    handle: '@cristopher_palacios',
  },
  {
    id: 'email',
    title: 'Email',
    url: 'mailto:cristopher.palacios@actuaria.com',
    icon: <IconMail size={24} />,
    handle: 'cristopher.palacios@actuaria.com',
  },
];

const ContactSection = () => {
  const { handleTranslation } = useLanguage();
  const gridRef = useGsapScrollTrigger<HTMLDivElement>({
    childSelector: '.contact-card',
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
    stagger: 0.1,
  });

  return (
    <div className="project-info">
      <Container maxWidth="md">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <SectionLabel number="05" label="Contact" />
          <h2 className="section-headline" style={{ marginBottom: 16 }}>
            {handleTranslation('contactSection.title')}
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: cosmic.textSecondary,
              maxWidth: 480,
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            Let&apos;s build something together. Reach out through any of the platforms below.
          </p>
        </div>

        <Grid ref={gridRef} container spacing={2}>
          {contactMethods.map((method) => (
            <Grid key={method.id} item xs={12} sm={6} className="contact-card">
              <a
                href={method.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <GlowCard
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `${cosmic.blue}15`,
                      border: `1px solid ${cosmic.line}`,
                      color: cosmic.cyan,
                      flexShrink: 0,
                    }}
                  >
                    {method.icon}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-space-grotesk), sans-serif',
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: cosmic.textPrimary,
                      }}
                    >
                      {method.title}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-jetbrains-mono), monospace',
                        fontSize: '0.6875rem',
                        color: cosmic.textSecondary,
                        letterSpacing: '0.02em',
                      }}
                    >
                      {method.handle}
                    </span>
                  </div>
                </GlowCard>
              </a>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default ContactSection;
