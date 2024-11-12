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
import dataContentEsp from '@/data/text-content-es.json';

// assets
import Offer1 from '../../assets/images/landing/offer/offer-1.png';
import Offer2 from '../../assets/images/landing/offer/offer-2.png';
import dashboard from '../../assets/images/landing/hero-dashboard.png';


interface OfferCardProps {
  title: string;
  caption: string;
  image: string;
}

const HeaderImage = styled('img')(({ theme }) => ({
  maxWidth: '100%',
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

const AboutMeSection = () => (
  <Container>
    <Grid container spacing={7.5} justifyContent="center">
      <Grid item xs={12} sx={{ textAlign: 'center' }}>
        <Grid container spacing={1.5}>
          <Grid item xs={12}>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
              {dataContentEsp.aboutMeSection.title}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ fontSize: '1rem' }}>
              {dataContentEsp.aboutMeSection.description}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={6} xs={12} sx={{ display: 'flex' }}>
        <HeaderImage src={dashboard.src} alt="Cristopher Palacios" />
      </Grid>
      <Grid item md={6} xs={12}>
        <Grid container direction="column" justifyContent="center" spacing={5} sx={{ '&> .MuiGrid-root > div': { height: '100%' } }}>
          <Grid item md={6} sm={12}>
            <OfferCard
              title={dataContentEsp.aboutMeSection.card1Subtitle}
              caption={dataContentEsp.aboutMeSection.card1Description}
              image={Offer1.src}
            />
          </Grid>
          <Grid item md={4} sm={6}>
            <OfferCard
              title={dataContentEsp.aboutMeSection.card2Subtitle}
              caption={dataContentEsp.aboutMeSection.card2Description}
              image={Offer2.src}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </Container>
);

export default AboutMeSection;