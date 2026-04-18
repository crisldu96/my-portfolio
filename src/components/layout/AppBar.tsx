'use client';

import { cloneElement, useState, ReactElement } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  AppBar as MuiAppBar,
  Box,
  Button,
  Container,
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

// project imports
import Logo from '../Logo';

// assets
import { IconHome2, IconUser, IconBriefcase, IconCode, IconDeviceLaptop, IconMail, IconArticle } from '@tabler/icons-react';
import MenuIcon from '@mui/icons-material/Menu';
import LanguageSwitch from '../LanguageSwitch';
import useConfig from '@/hooks/useConfig';
import useLanguage from '@/hooks/useLanguage';

// elevation scroll
interface ElevationScrollProps {
  children: ReactElement;
  window?: Window | Node;
}

function ElevationScroll({ children, window }: ElevationScrollProps) {
  const theme = useTheme();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ?? undefined
  });

  return cloneElement(children, {
    elevation: trigger ? 1 : 0,
    style: {
      backgroundColor: theme.palette.mode === 'dark' && trigger ? theme.palette.dark[800] : theme.palette.background.default,
      color: theme.palette.text.primary
    }
  });
}

// ==============================|| MINIMAL LAYOUT APP BAR ||============================== //

const AppBar = ({ ...others }) => {
  const { locale, onChangeLocale } = useConfig();
  const { handleTranslation } = useLanguage();
  const [drawerToggle, setDrawerToggle] = useState<boolean>(false);

  const drawerToggler = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setDrawerToggle(open);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeLocale(event.target.checked ? 'es' : 'en');
  };

  const navItems = [
    { href: '/#home', labelKey: 'appBar.item1', icon: <IconHome2 /> },
    { href: '/#about', labelKey: 'appBar.item2', icon: <IconUser /> },
    { href: '/#experience', labelKey: 'appBar.item3', icon: <IconBriefcase /> },
    { href: '/#skills', labelKey: 'appBar.item4', icon: <IconCode /> },
    { href: '/#projects', labelKey: 'appBar.item5', icon: <IconDeviceLaptop /> },
    { href: '/#contact', labelKey: 'appBar.item6', icon: <IconMail /> },
    { href: '/blog', labelKey: 'appBar.item7', icon: <IconArticle /> },
  ];

  return (
    <ElevationScroll {...others}>
      <MuiAppBar>
        <Container>
          <Toolbar sx={{ py: 2.5, px: `0 !important` }}>
            <Typography component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
              <Logo />
            </Typography>
            <Stack direction="row" sx={{ display: { xs: 'none', sm: 'block' } }} spacing={{ xs: 1.5, md: 2.5 }}>
              <LanguageSwitch checked={locale === 'es'} onChange={handleChange} size="small" />
              {navItems.filter((_, i) => i !== 5).map(({ href, labelKey }) => (
                <Button key={href} color="inherit" component={Link} href={href}>
                  {handleTranslation(labelKey)}
                </Button>
              ))}
              <Button component={Link} href="/#contact" disableElevation variant="contained" color="secondary">
                {handleTranslation('appBar.item6')}
              </Button>
            </Stack>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <IconButton color="inherit" onClick={drawerToggler(true)} size="large">
                <MenuIcon />
              </IconButton>
              <Drawer anchor="top" open={drawerToggle} onClose={drawerToggler(false)}>
                {drawerToggle && (
                  <Box sx={{ width: 'auto' }} role="presentation" onClick={drawerToggler(false)} onKeyDown={drawerToggler(false)}>
                    <List>
                      {navItems.map(({ href, labelKey, icon }) => (
                        <Link key={href} style={{ textDecoration: 'none' }} href={href}>
                          <ListItemButton component="a">
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={handleTranslation(labelKey)} />
                          </ListItemButton>
                        </Link>
                      ))}
                    </List>
                  </Box>
                )}
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </MuiAppBar>
    </ElevationScroll>
  );
};

export default AppBar;
