// material-ui
import { useTheme } from '@mui/material/styles';
import { CardMedia, Container, Grid, Stack, Typography } from '@mui/material';

// project import
import useLanguage from '@/hooks/useLanguage';
import FadeInWhenVisible from '@/components/Animation';

// assets
import { IconCircleCheck } from '@tabler/icons-react';

import LayerLeft from '../../assets/images/landing/customization-left.png';
import LayerRight from '../../assets/images/landing/customization-right.png';

// ==============================|| LANDING - CUSTOMIZE ||============================== //

const ExperienceSection = () => {
  const theme = useTheme();
  const { handleTranslation } = useLanguage();
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
          <FadeInWhenVisible direction="up">
            <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' }, mb: 3 }}>
              {handleTranslation('experienceSection.title')}
            </Typography>
          </FadeInWhenVisible>
        </Grid>

        <Grid item xs={12} md={6}>
          <FadeInWhenVisible direction="right" delay={0.05}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontSize: { xs: '1.5rem' }, mb: 2 }}>
                  {handleTranslation('experienceSection.subtitle1')}
                </Typography>
                <Typography
                  align="justify"
                  variant="subtitle2"
                  color="text.primary"
                  sx={{ fontSize: '1rem', zIndex: 99, width: '100%' }}
                >
                  {handleTranslation('experienceSection.description1')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {handleTranslation<string[]>('experienceSection.items1').map((item: string, index: number) => (
                  <FadeInWhenVisible key={index} direction="right" delay={0.1 + index * 0.05}>
                    <Typography sx={listSX} variant="body1">
                      <IconCircleCheck />
                      {item}
                    </Typography>
                  </FadeInWhenVisible>
                ))}
              </Grid>
            </Grid>
          </FadeInWhenVisible>
        </Grid>

        <Grid item xs={12} md={6} sx={{ img: { width: '100%' } }}>
          <FadeInWhenVisible direction="left" delay={0.1}>
            <Stack sx={{ width: '75%', mx: 'auto' }}>
              <CardMedia component="img" image={LayerLeft.src} alt="Layer" />
            </Stack>
          </FadeInWhenVisible>
        </Grid>

        <Grid item xs={12} md={6} sx={{ img: { width: '100%' } }}>
          <FadeInWhenVisible direction="right" delay={0.1}>
            <Stack sx={{ width: '70%', mx: 'auto' }}>
              <CardMedia component="img" image={LayerRight.src} alt="Layer" />
            </Stack>
          </FadeInWhenVisible>
        </Grid>

        <Grid item xs={12} md={6}>
          <FadeInWhenVisible direction="left" delay={0.05}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontSize: { xs: '1.5rem' }, mb: 2 }}>
                  {handleTranslation('experienceSection.subtitle2')}
                </Typography>
                <Typography
                  align="justify"
                  variant="subtitle2"
                  color="text.primary"
                  sx={{ fontSize: '1rem', zIndex: 99, width: '100%' }}
                >
                  {handleTranslation('experienceSection.description2')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {handleTranslation<string[]>('experienceSection.items2').map((item: string, index: number) => (
                  <FadeInWhenVisible key={index} direction="left" delay={0.1 + index * 0.05}>
                    <Typography sx={listSX} variant="body1">
                      <IconCircleCheck />
                      {item}
                    </Typography>
                  </FadeInWhenVisible>
                ))}
              </Grid>
            </Grid>
          </FadeInWhenVisible>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ExperienceSection;
