'use client';

import { cloneElement, useState, useEffect, ReactElement } from 'react';

import { useTheme } from '@mui/material/styles';
import {
  AppBar as MuiAppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useScrollTrigger
} from '@mui/material';

import CpMonogram from '../cosmic/CpMonogram';
import { cosmic } from '@/themes/cosmicTokens';

import { IconHome2, IconUser, IconBriefcase, IconCode, IconDeviceLaptop, IconMail, IconArticle } from '@tabler/icons-react';
import { IconBrandLinkedin, IconBrandGithub, IconBrandDeno } from '@tabler/icons-react';
import MenuIcon from '@mui/icons-material/Menu';
import LanguageSwitch from '../LanguageSwitch';
import useConfig from '@/hooks/useConfig';
import useLanguage from '@/hooks/useLanguage';

interface ElevationScrollProps {
  children: ReactElement;
  window?: Window | Node;
}

function ElevationScroll({ children, window }: ElevationScrollProps) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ?? undefined
  });

  return cloneElement(children, {
    elevation: 0,
    style: {
      backgroundColor: trigger ? 'rgba(8, 12, 26, 0.85)' : 'rgba(8, 12, 26, 0.6)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${cosmic.line}`,
      transition: 'background-color 0.3s ease',
    }
  });
}

const AppBar = ({ ...others }) => {
  const { locale, onChangeLocale } = useConfig();
  const { handleTranslation } = useLanguage();
  const [drawerToggle, setDrawerToggle] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const drawerToggler = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setDrawerToggle(open);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeLocale(event.target.checked ? 'es' : 'en');
  };

  useEffect(() => {
    const sectionIds = ['contact', 'projects', 'skills', 'experience', 'about', 'home'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/#home', id: 'home', labelKey: 'appBar.item1', icon: <IconHome2 /> },
    { href: '/#about', id: 'about', labelKey: 'appBar.item2', icon: <IconUser /> },
    { href: '/#experience', id: 'experience', labelKey: 'appBar.item3', icon: <IconBriefcase /> },
    { href: '/#skills', id: 'skills', labelKey: 'appBar.item4', icon: <IconCode /> },
    { href: '/#projects', id: 'projects', labelKey: 'appBar.item5', icon: <IconDeviceLaptop /> },
    { href: '/#contact', id: 'contact', labelKey: 'appBar.item6', icon: <IconMail /> },
    { href: '/blog', id: 'blog', labelKey: 'appBar.item7', icon: <IconArticle /> },
  ];

  const desktopNavItems = navItems.filter((_, i) => i !== 0);

  return (
    <ElevationScroll {...others}>
      <MuiAppBar sx={{ boxShadow: 'none' }}>
        <Toolbar
          sx={{
            height: 64,
            minHeight: '64px !important',
            px: { xs: 2, md: 4 },
            maxWidth: 1280,
            width: '100%',
            mx: 'auto',
          }}
        >
          {/* Left: CP Monogram */}
          <Link href="/" sx={{ textDecoration: 'none', display: 'flex' }}>
            <CpMonogram />
          </Link>

          {/* Center: Nav links (desktop) */}
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {desktopNavItems.filter((_, i) => i !== 4).map(({ href, id, labelKey }) => (
              <Button
                key={href}
                component={Link}
                href={href}
                sx={{
                  color: activeSection === id ? cosmic.textPrimary : cosmic.textSecondary,
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                  textTransform: 'none',
                  px: 1.5,
                  py: 0.75,
                  minWidth: 'auto',
                  position: 'relative',
                  borderRadius: '8px',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: cosmic.textPrimary,
                    background: 'rgba(59, 130, 246, 0.06)',
                  },
                  '&::after': activeSection === id ? {
                    content: '""',
                    position: 'absolute',
                    bottom: 2,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: cosmic.cyan,
                    boxShadow: `0 0 6px ${cosmic.cyan}`,
                  } : {},
                }}
              >
                {handleTranslation(labelKey)}
              </Button>
            ))}
            <Button
              component={Link}
              href="/#contact"
              variant="contained"
              color="primary"
              disableElevation
              sx={{
                ml: 1,
                fontSize: '0.8125rem',
                fontWeight: 500,
                textTransform: 'none',
                px: 2.5,
                py: 0.75,
              }}
            >
              {handleTranslation('appBar.item6')}
            </Button>
          </Stack>

          {/* Right: Language toggle + social icons (desktop) */}
          <div className="desktop-right-group">
            <LanguageSwitch checked={locale === 'es'} onChange={handleChange} size="small" />
            <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
              {[
                { icon: <IconBrandGithub size={16} />, href: 'https://github.com/CristopherPalacios', label: 'GitHub' },
                { icon: <IconBrandLinkedin size={16} />, href: 'https://www.linkedin.com/in/cristopher-palacios-791704160', label: 'LinkedIn' },
                { icon: <IconBrandDeno size={16} />, href: 'https://dev.to/cristopherpalacios', label: 'Dev.to' },
              ].map(({ icon, href, label }) => (
                <IconButton
                  key={label}
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  size="small"
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    border: `1px solid ${cosmic.line}`,
                    color: cosmic.textSecondary,
                    background: 'rgba(22, 32, 64, 0.4)',
                    '&:hover': {
                      color: cosmic.cyan,
                      borderColor: cosmic.cyan,
                    },
                  }}
                >
                  {icon}
                </IconButton>
              ))}
            </div>
          </div>

          {/* Mobile: hamburger */}
          <div className="mobile-menu-toggle">
            <IconButton color="inherit" onClick={drawerToggler(true)} size="large">
              <MenuIcon />
            </IconButton>
            <Drawer anchor="top" open={drawerToggle} onClose={drawerToggler(false)}>
              {drawerToggle && (
                <div
                  style={{
                    width: 'auto',
                    background: cosmic.bg0,
                    borderBottom: `1px solid ${cosmic.line}`,
                  }}
                  role="presentation"
                  onClick={drawerToggler(false)}
                  onKeyDown={drawerToggler(false)}
                >
                  <List>
                    {navItems.map(({ href, labelKey, icon }) => (
                      <Link key={href} style={{ textDecoration: 'none' }} href={href}>
                        <ListItemButton component="a">
                          <ListItemIcon sx={{ color: cosmic.textSecondary, minWidth: 36 }}>
                            {icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={handleTranslation(labelKey)}
                            sx={{ '& .MuiTypography-root': { color: cosmic.textPrimary } }}
                          />
                        </ListItemButton>
                      </Link>
                    ))}
                  </List>
                </div>
              )}
            </Drawer>
          </div>
        </Toolbar>
      </MuiAppBar>
    </ElevationScroll>
  );
};

export default AppBar;
