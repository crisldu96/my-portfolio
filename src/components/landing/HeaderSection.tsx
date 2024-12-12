// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Button, CardMedia, Container, Grid, Link, Stack, Typography } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

// third party
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

// project imports
import AnimateButton from '../AnimateButton';
import dataContentEsp from '@/data/text-content-es.json';

// assets
import TechLight from '../../assets/images/landing/tech-light.svg';
import TechDark from '../../assets/images/landing/tech-dark.svg';
import developer from '../../assets/images/landing/header-1.png';
import ImageBackground from '../ImageBackground';

// styles
const HeaderImage = styled('img')({
  borderRadius: 20,
  marginLeft: '25%',
  maxWidth: '100%',
  opacity: 0.8,
  filter: 'drop-shadow(0px 0px 50px rgb(33 150 243 / 30%))',
  transform: 'rotateY(180deg)'
});

// ==============================|| LANDING - HEADER PAGE ||============================== //

const HeaderSection = () => {
  const theme = useTheme();
  const headerSX = { fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem', lg: '3.5rem' } };

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
                  <Typography textAlign={{ xs: 'center', md: 'left' }} variant="h1" sx={headerSX}>
                    {dataContentEsp.headerSection.title}
                  </Typography>
                  <Typography textAlign={{ xs: 'center', md: 'left' }} variant="h1" color="primary" sx={headerSX}>
                    {dataContentEsp.headerSection.title2}
                  </Typography>
                </Stack>
              </motion.div>
            </Grid>
            <Grid item xs={12} sx={{ mt: -2.5, textAlign: { xs: 'center', md: 'left' } }}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.2 }}
              >
                <Typography textAlign={{ xs: 'center', md: 'left' }}
                  color="text.secondary"
                  variant="subtitle2"
                  sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}
                >
                  {dataContentEsp.headerSection.subtitle}
                </Typography>
                <Typography
                  textAlign={{ xs: 'center', md: 'left' }}
                  color="text.primary"
                  variant="body1"
                  sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}
                >
                  {dataContentEsp.headerSection.description}
                </Typography>
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
                        href="https://ec.linkedin.com/in/cristopher-palacios-791704160"
                        target="_blank"
                        size="large"
                        variant="contained"
                        color="secondary"
                        startIcon={<LinkedInIcon />}
                      >
                        {dataContentEsp.headerSection.button}
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
                      {dataContentEsp.headerSection.button2}
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
                      dataContentEsp.headerSection.typingStart,
                      3000,
                      dataContentEsp.headerSection.typingEnd,
                      12000,
                    ]}
                    speed={60}
                    deletionSpeed={80}
                    wrapper="h2"
                    repeat={Infinity}
                  />
                  <CardMedia
                    component="img"
                    image={theme.palette.mode === 'dark' ? TechDark.src : TechLight.src}
                    alt="Cristopher Palacios Tech"
                    sx={{ width: { xs: '75%', sm: '50%', md: '75%' } }}
                  />
                </Stack>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Box sx={{ position: 'relative', mt: 1.75, zIndex: 9 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.2 }}
            >
              <HeaderImage src={developer.src} alt="Cristopher Palacios" />
            </motion.div>
          </Box>
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
