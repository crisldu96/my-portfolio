// material-ui
import { useTheme } from '@mui/material/styles';
import { CardMedia, Container, Grid, Stack, Typography } from '@mui/material';

// project import
import dataContentEsp from '@/data/text-content-es.json';

// assets
import { IconCircleCheck } from '@tabler/icons-react';

import LayerLeft from '../../assets/images/landing/customization-left.png';
import LayerRight from '../../assets/images/landing/customization-right.png';

// ==============================|| LANDING - CUSTOMIZE ||============================== //

const ExperienceSection = () => {
  const theme = useTheme();
  const listSX = {
    display: 'flex',
    alignItems: 'left',
    gap: '0.5rem',
    padding: '10px 0',
    fontSize: '0.9rem',
    color: theme.palette.grey[900],
    svg: { color: theme.palette.primary.main },
    p: { textAlign: 'justify' }
  };

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Grid container justifyContent="space-between" alignItems="center" spacing={{ xs: 1.5, sm: 2.5, md: 3, lg: 5 }}>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' }, mb: 3 }}>
            {dataContentEsp.experienceSection.title}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontSize: { xs: '1.5rem' }, mb: 2 }}>
                {dataContentEsp.experienceSection.subtitle1}
              </Typography>
              <Typography
                align="justify"
                variant="subtitle2"
                color="text.primary"
                sx={{
                  fontSize: '1rem',
                  zIndex: '99',
                  width: { xs: '100%', sm: '100%', md: '100%' }
                }}
              >
                {dataContentEsp.experienceSection.description1}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {dataContentEsp.experienceSection.items1.map((item, index) => (
                <Typography key={index} sx={listSX} variant="body1">
                  <IconCircleCheck />
                  {item}
                </Typography>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} sx={{ img: { width: '100%' } }}>
          <Stack sx={{ width: '75%', mx: 'auto' }}>
            <CardMedia component="img" image={LayerLeft.src} alt="Layer" />
          </Stack>
        </Grid>
        <Grid item xs={12} md={6} sx={{ img: { width: '100%' } }}>
          <Stack sx={{ width: '70%', mx: 'auto' }}>
            <CardMedia component="img" image={LayerRight.src} alt="Layer" />
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontSize: { xs: '1.5rem' }, mb: 2 }}>
                {dataContentEsp.experienceSection.subtitle2}
              </Typography>
              <Typography
                align="justify"
                variant="subtitle2"
                color="text.primary"
                sx={{
                  fontSize: '1rem',
                  zIndex: '99',
                  width: { xs: '100%', md: '100%' }
                }}
              >
                {dataContentEsp.experienceSection.description2}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {dataContentEsp.experienceSection.items2.map((item, index) => (
                <Typography key={index} sx={listSX} variant="body1">
                  <IconCircleCheck />
                  {item}
                </Typography>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ExperienceSection;
