'use client';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import { IconBrandLinkedin, IconBrandGithub, IconBrandDeno, IconMail } from '@tabler/icons-react';
import SectionLabel from '../cosmic/SectionLabel';
import GlowCard from '../cosmic/GlowCard';
import { cosmic } from '@/themes/cosmicTokens';
import useLanguage from '@/hooks/useLanguage';
import { useGsapScrollTrigger } from '@/hooks/useGsapScrollTrigger';
import { social, socialHandles, mailto } from '@/config/social';

const ContactSection = () => {
  const { handleTranslation } = useLanguage();
  const contactMethods = [
    {
      id: 'linkedin',
      title: handleTranslation<string>('contactSection.methods.linkedin'),
      url: social.linkedin,
      icon: <IconBrandLinkedin size={24} />,
      handle: socialHandles.linkedin,
    },
    {
      id: 'github',
      title: handleTranslation<string>('contactSection.methods.github'),
      url: social.github,
      icon: <IconBrandGithub size={24} />,
      handle: socialHandles.github,
    },
    {
      id: 'dev',
      title: handleTranslation<string>('contactSection.methods.dev'),
      url: social.devto,
      icon: <IconBrandDeno size={24} />,
      handle: socialHandles.devto,
    },
    {
      id: 'email',
      title: handleTranslation<string>('contactSection.methods.email'),
      url: mailto,
      icon: <IconMail size={24} />,
      handle: social.email,
    },
  ];
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
          <SectionLabel number="06" label={handleTranslation('contactSection.sectionLabel')} />
          <h2 className="section-headline" style={{ marginBottom: 16 }}>
            <span className="reveal-on-scroll">
              <span>{handleTranslation('contactSection.title')}</span>
            </span>
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
            suppressHydrationWarning
          >
            {handleTranslation('contactSection.description')}
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
                      suppressHydrationWarning
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
