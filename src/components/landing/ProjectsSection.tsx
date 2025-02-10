
// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, IconButton, Link, Typography, Stack, useMediaQuery } from '@mui/material';

// third-party
import { Carousel } from 'react-responsive-carousel';

// assets
import { IconChevronRight, IconChevronLeft, IconLink } from '@tabler/icons-react';

// project imports
import App1 from '../../assets/images/landing/projects/app-1-portal.png';
import App2 from '../../assets/images/landing/projects/app-2-kin.png';
import App3 from '../../assets/images/landing/projects/app-3-arupo.png';
import App4 from '../../assets/images/landing/projects/app-4-af.png';
import App5 from '../../assets/images/landing/projects/app-5-provisiones.png';
import useLanguage from '@/hooks/useLanguage';

// styles
const Images = styled('img')({
  width: '100%',
  height: 'auto',
  marginBottom: 32,
  backgroundSize: 'cover',
  objectFit: 'cover'
});

function SampleNextArrow(props: any) {
  const theme = useTheme();
  const { onClickHandler } = props;

  return (
    <IconButton
      onClick={onClickHandler}
      sx={{
        position: 'absolute',
        zIndex: 2,
        top: 'calc(50% - 70px)',
        cursor: 'pointer',
        background: `${theme.palette.background.paper} !important`,
        width: { xs: '40px !important', xl: '65px !important' },
        height: { xs: '40px !important', xl: '65px !important' },
        boxShadow: '0px 24px 38px rgba(9, 15, 37, 0.07)',
        '&:after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          transform: 'scale(9)'
        },
        svg: {
          height: { md: 20, lg: 40, xl: '40px' },
          width: { md: 20, lg: 40, xl: '40px' }
        },
        right: { xs: '50px', md: '80px', lg: '120px', xl: '220px' }
      }}
    >
      <IconChevronRight fontSize={25} color={theme.palette.grey[900]} />
    </IconButton>
  );
}

function SamplePrevArrow(props: any) {
  const { onClickHandler } = props;
  const theme = useTheme();
  return (
    <IconButton
      onClick={onClickHandler}
      sx={{
        position: 'absolute',
        zIndex: 2,
        top: 'calc(50% - 70px)',
        cursor: 'pointer',
        background: `${theme.palette.background.paper} !important`,
        width: { xs: '40px !important', xl: '65px !important' },
        height: { xs: '40px !important', xl: '65px !important' },
        boxShadow: '0px 24px 38px rgba(9, 15, 37, 0.07)',
        '&:after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          transform: 'scale(9)'
        },
        svg: {
          height: { md: 20, lg: 40, xl: '40px' },
          width: { md: 20, lg: 40, xl: '40px' }
        },
        left: { xs: '50px', md: '80px', lg: '120px', xl: '220px' }
      }}
    >
      <IconChevronLeft fontSize={25} color={theme.palette.grey[900]} />
    </IconButton>
  );
}

interface ItemProps {
  title: string;
  caption?: string;
  image: string;
  link: string;
}

const Items = ({ title, caption, image, link }: ItemProps) => {
  const theme = useTheme();
  return (
    <>
      <Images
        src={image}
        alt="dashboard"
        sx={{
          width: { xs: '100%', xl: 743 },
          objectFit: 'contain',
          direction: 'initial'
        }}
      />
      <Stack spacing={1} sx={{ pt: 1 }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          component={Link}
          href={link}
          target="_blank"
          sx={{ textDecoration: 'none' }}
        >
          <Typography variant="h3" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          <IconButton size="small">
            <IconLink size={18} color={theme.palette.text.primary} />
          </IconButton>
        </Stack>
        <Typography variant="subtitle2" color="text.primary" sx={{ fontSize: { xs: '1rem', xl: '1.125rem' } }}>
          {caption}
        </Typography>
      </Stack>
    </>
  );
};

const ProjectsSection = () => {
  const theme = useTheme();
  const { handleTraslation } = useLanguage();
  const matchUpSM = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <Grid container spacing={7.5} justifyContent="center" sx={{ px: 1.25 }}>
        <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
          <Grid container spacing={1.5}>
            <Grid item xs={12}>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                {handleTraslation('projectSection.title')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ fontWeight: 400 }} align="center">
                {handleTraslation('projectSection.description')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Box
            className="preBuildDashBoard-slider"
            sx={{
              direction: 'initial',
              '.slider': { height: { xs: 'auto' }, '& .slide:not(.selected)': { transformOrigin: 'center !important' } }
            }}
          >
            <Carousel
              showArrows={true}
              showThumbs={false}
              showIndicators={false}
              centerMode={matchUpSM ? false : true}
              centerSlidePercentage={50}
              infiniteLoop={true}
              autoFocus={true}
              emulateTouch={true}
              swipeable={true}
              autoPlay={true}
              interval={2000}
              renderArrowPrev={(onClickHandler, hasPrev, label) =>
                hasPrev && <SamplePrevArrow onClickHandler={onClickHandler} hasPrev={hasPrev} label={label} />
              }
              renderArrowNext={(onClickHandler, hasNext, label) =>
                hasNext && <SampleNextArrow onClickHandler={onClickHandler} hasNext={hasNext} label={label} />
              }
            >
              <Items title="Data collection App" image={App1.src} link="https://portal.actuaria.com/authentication/login" />
              <Items title="Web Page" image={App2.src} link="https://www.kinanalytics.com/" />
              <Items title="Legaltech automation App" image={App3.src} link="https://www.arupo.io" />
              <Items title="Actuarial Platform App" image={App4.src} link="https://actuaria.com" />
              <Items title="Data management App" image={App5.src} link="https://sistema-provisiones.actuaria.com.ec" />
            </Carousel>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default ProjectsSection;
