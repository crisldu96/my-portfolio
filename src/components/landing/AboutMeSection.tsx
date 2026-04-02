// material-ui
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CardMedia from '@mui/material/CardMedia';
import { useTheme, styled } from '@mui/material/styles';


// project imports
import FadeInWhenVisible from '../Animation';
import SubCard from '../SubCard';
import Avatar from '../Avatar';

// assets
import Offer1 from '../../assets/images/landing/offer/offer-1.png';
import Offer2 from '../../assets/images/landing/offer/offer-2.png';
import ImageBackground from '../ImageBackground';
import { Box } from '@mui/material';
import useLanguage from '@/hooks/useLanguage';


interface OfferCardProps {
  title: string;
  caption: string;
  image: string;
}

const HeaderImage = styled('img')(() => ({
  maxWidth: '100%',
  filter: 'drop-shadow(0px 0px 50px rgb(33 150 243 / 30%))',
  opacity: 0.9,
  borderRadius: 25
}));

const OfferCard = ({ title, caption, image }: OfferCardProps) => {
  const theme = useTheme();
  const AvaterSx = { bgcolor: 'transparent', color: 'secondary.main', width: 56, height: 56 };

  return (
    <FadeInWhenVisible>
      <SubCard
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? 'dark.800' : 'grey.100',
          borderColor: 'divider',
          '&:hover': { boxShadow: 'none' },
          height: '100%'
        }}
      >
        <Stack spacing={4}>
          <Avatar variant="rounded" sx={AvaterSx}>
            <CardMedia component="img" src={image} alt="Beautiful User Interface" />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h3" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '1rem' }}>
              {caption}
            </Typography>
          </Stack>
        </Stack>
      </SubCard>
    </FadeInWhenVisible>
  );
};

const AboutMeSection = () => {
  const { handleTranslation } = useLanguage();
  return (
    <Container>
      <Grid container spacing={7.5} justifyContent="center">
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Grid container spacing={1.5}>
            <Grid item xs={12}>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                {handleTranslation('aboutMeSection.title')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                {handleTranslation('aboutMeSection.description')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={6} xs={12} sx={{ display: 'flex' }}>
          <Box sx={{ position: 'relative', mt: 1.75, zIndex: 9 }}>
            <HeaderImage src="/assets/images/paisaje.jpg" alt="Cristopher Palacios" />
          </Box>
          <ImageBackground
            sx={{
              left: 0,
              transform: 'rotateY(180deg)',
            }}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Grid container direction="column" justifyContent="center" spacing={5} sx={{ '&> .MuiGrid-root > div': { height: '100%' } }}>
            <Grid item md={6} sm={12}>
              <OfferCard
                title={handleTranslation('aboutMeSection.card1Subtitle')}
                caption={handleTranslation('aboutMeSection.card1Description')}
                image={Offer1.src}
              />
            </Grid>
            <Grid item md={4} sm={6}>
              <OfferCard
                title={handleTranslation('aboutMeSection.card2Subtitle')}
                caption={handleTranslation('aboutMeSection.card2Description')}
                image={Offer2.src}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AboutMeSection;