// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Button, Container, Grid, Link, Stack } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

// third party
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

// project imports
import AnimateButton from '../AnimateButton';

// assets
import TechLight from '../../assets/images/landing/tech-light.svg';
import TechDark from '../../assets/images/landing/tech-dark.svg';
import developer from '../../assets/images/landing/header-1.png';
import ImageBackground from '../ImageBackground';
import useLanguage from '@/hooks/useLanguage';
import { social } from '@/config/social';

// styles
const HeaderImage = styled('img')({
  borderRadius: 300,
  marginLeft: '25%',
  maxWidth: '100%',
  opacity: 0.8,
  filter: 'drop-shadow(0px 0px 50px rgb(33 150 243 / 30%))',
  transform: 'rotateY(180deg)'
});

// ==============================|| LANDING - HEADER PAGE ||============================== //

const HeaderSection = () => {
  const theme = useTheme();
  const { handleTranslation } = useLanguage();
  const headerStyle: React.CSSProperties = { fontSize: 'clamp(2rem, 5vw, 3.5rem)' };

  return (
    <Container sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: { xs: 10, sm: 6, md: 18.75 }, mb: { xs: 2.5, md: 10 } }}>
        <Grid item xs={12} md={6}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 30 }}
              >
                <Stack spacing={1}>
                  <h1 style={{ ...headerStyle, margin: 0 }}>
                    {handleTranslation('headerSection.title')}
                  </h1>
                  <h1 style={{ ...headerStyle, margin: 0, color: theme.palette.primary.main }}>
                    {handleTranslation('headerSection.title2')}
                  </h1>
                </Stack>
              </motion.div>
            </Grid>
            <Grid item xs={12} sx={{ mt: -2.5, textAlign: { xs: 'center', md: 'left' } }}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.2 }}
              >
                <p style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', color: theme.palette.text.secondary, margin: 0 }}>
                  {handleTranslation('headerSection.subtitle')}
                </p>
                <p style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', color: theme.palette.text.primary, margin: 0 }}>
                  {handleTranslation('headerSection.description')}
                </p>
              </motion.div>
            </Grid>
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.4 }}
              >
                <Grid container spacing={2} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Grid item>
                    <AnimateButton>
                      <Button
                        component={Link}
                        href={social.linkedin}
                        target="_blank"
                        size="large"
                        variant="contained"
                        color="secondary"
                        startIcon={<LinkedInIcon />}
                      >
                        {handleTranslation('headerSection.button')}
                      </Button>
                    </AnimateButton>
                  </Grid>
                  <Grid item>
                    <Button
                      component={Link}
                      href="/assets/cv.pdf"
                      target="_blank"
                      size="large"
                      variant="contained"
                      color="primary"
                      startIcon={<FileDownloadIcon />}
                    >
                      {handleTranslation('headerSection.button2')}
                    </Button>
                  </Grid>
                </Grid>
              </motion.div>
            </Grid>
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.6 }}
              >
                <Stack spacing={3} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                  <TypeAnimation
                    style={{ fontSize: '1rem' }}
                    cursor={false}
                    sequence={[
                      1000,
                      handleTranslation('headerSection.typingStart'),
                      3000,
                      handleTranslation('headerSection.typingEnd'),
                      12000,
                    ]}
                    speed={60}
                    deletionSpeed={80}
                    wrapper="h2"
                    repeat={Infinity}
                  />
                  <img
                    src={theme.palette.mode === 'dark' ? TechDark.src : TechLight.src}
                    alt="Cristopher Palacios Tech"
                    style={{ width: '75%', maxWidth: '100%' }}
                  />
                </Stack>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'flex' } }}>
          <div style={{ position: 'relative', marginTop: 14, zIndex: 9 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.2 }}
            >
              <HeaderImage src={developer.src} alt="Cristopher Palacios" />
            </motion.div>
          </div>
          <ImageBackground
            sx={{
              bottom: { md: 0 },
              right: 0
            }}
          />
        </Grid>
      </Grid>
    </Container >
  );
};

export default HeaderSection;
