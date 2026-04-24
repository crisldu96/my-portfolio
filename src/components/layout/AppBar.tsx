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
  const [collapsed, setCollapsed] = useState(true);

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
      setCollapsed(window.scrollY < 120);
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

  const desktopNavItems = navItems.filter(({ id }) => id !== 'home' && id !== 'contact');

  return (
    <ElevationScroll {...others}>
      <MuiAppBar style={{ boxShadow: 'none' }} data-collapsed={collapsed ? 'true' : 'false'}>
        <div
          className="appbar-inner"
          data-collapsed={collapsed ? 'true' : 'false'}
          style={{
            height: 64,
            minHeight: 64,
            paddingLeft: 32,
            paddingRight: 32,
            maxWidth: 1280,
            width: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Left: CP Monogram */}
          <a href="/" style={{ textDecoration: 'none', display: 'flex' }}>
            <CpMonogram />
          </a>

          {/* Center: Nav links (desktop) */}
          <div className="appbar-nav-center">
            {desktopNavItems.map(({ href, id, labelKey }) => (
              <a
                key={href}
                href={href}
                className={`appbar-nav-link${activeSection === id ? ' appbar-nav-link--active' : ''}${id === 'blog' ? ' appbar-nav-link--blog' : ''}`}
                suppressHydrationWarning
              >
                {id === 'blog' && <span className="appbar-nav-link__pulse" aria-hidden="true" />}
                <span suppressHydrationWarning>{handleTranslation(labelKey)}</span>
                {id === 'blog' && <span className="appbar-nav-link__badge">NEW</span>}
              </a>
            ))}
            <a
              href="/#contact"
              className="appbar-contact-btn"
              suppressHydrationWarning
            >
              <span suppressHydrationWarning>{handleTranslation('appBar.item6')}</span>
            </a>
          </div>

          {/* Right: Language toggle + social icons (desktop) */}
          <div className="desktop-right-group">
            <LanguageSwitch checked={locale === 'es'} onChange={handleChange} size="small" />
            <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
              {[
                { icon: <IconBrandGithub size={16} />, href: 'https://github.com/CristopherPalacios', label: 'GitHub' },
                { icon: <IconBrandLinkedin size={16} />, href: 'https://www.linkedin.com/in/cristopher-palacios-791704160', label: 'LinkedIn' },
                { icon: <IconBrandDeno size={16} />, href: 'https://dev.to/cristopherpalacios', label: 'Dev.to' },
              ].map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="appbar-social-icon"
                >
                  {icon}
                </a>
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
                    {navItems.map(({ href, id, labelKey, icon }) => (
                      <a key={href} style={{ textDecoration: 'none' }} href={href} suppressHydrationWarning>
                        <ListItemButton component="span">
                          <div style={{ color: id === 'blog' ? cosmic.cyan : cosmic.textSecondary, minWidth: 36, display: 'flex' }}>
                            {icon}
                          </div>
                          <span style={{ color: cosmic.textPrimary, display: 'inline-flex', alignItems: 'center', gap: 8 }} suppressHydrationWarning>
                            {handleTranslation(labelKey)}
                            {id === 'blog' && <span className="appbar-nav-link__badge">NEW</span>}
                          </span>
                        </ListItemButton>
                      </a>
                    ))}
                  </List>
                </div>
              )}
            </Drawer>
          </div>
        </div>
      </MuiAppBar>
    </ElevationScroll>
  );
};

export default AppBar;
