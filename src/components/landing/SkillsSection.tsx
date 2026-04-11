// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Badge, CardMedia, Container, Stack, Typography } from '@mui/material';

// third-party
import Slider from 'react-slick';

// project imports
import SubCard from '../SubCard';
import FadeInWhenVisible from '@/components/Animation';

// assets
import Bootstrap from '../../assets/images/landing/frameworks/bootstrap.svg';
import FullStack from '../../assets/images/landing/frameworks/full-stack.svg';
import AWS from '../../assets/images/landing/logos/aws.svg';
import CSS from '../../assets/images/landing/logos/css3.svg';
import Figma from '../../assets/images/landing/logos/figma.svg';
import GCP from '../../assets/images/landing/logos/gcp.svg';
import HTML from '../../assets/images/landing/logos/html.svg';
import Java from '../../assets/images/landing/logos/java.svg';
import JS from '../../assets/images/landing/logos/javascript.svg';
import MUI from '../../assets/images/landing/logos/material-ui.svg';
import SQL from '../../assets/images/landing/logos/mysql.svg';
import NativeBase from '../../assets/images/landing/logos/nativebase.svg';
import Next from '../../assets/images/landing/logos/nextjs.svg';
import Python from '../../assets/images/landing/logos/python.svg';
import React from '../../assets/images/landing/logos/react.svg';
import SASS from '../../assets/images/landing/logos/sass.svg';
import Spring from '../../assets/images/landing/logos/springboot.svg';
import Tailwind from '../../assets/images/landing/logos/tailwind.svg';
import TS from '../../assets/images/landing/logos/typescript.svg';
import useLanguage from '@/hooks/useLanguage';

export const frameworks = [
  {
    title: 'React',
    logo: React
  },
  {
    title: 'TypeScript',
    logo: TS
  },
  {
    title: 'HTML 5',
    logo: HTML
  },
  {
    title: 'Next.js',
    logo: Next
  },
  {
    title: 'JavaScript',
    logo: JS
  },
  {
    title: 'MUI',
    logo: MUI
  },
  {
    title: 'GCP',
    logo: GCP
  },
  {
    title: 'Node.js',
    logo: FullStack,
  },
  {
    title: 'AWS',
    logo: AWS
  },
  {
    title: 'Bootstrap 5',
    logo: Bootstrap,
  },
  {
    title: 'Java',
    logo: Java
  },
  {
    title: 'CSS 3',
    logo: CSS
  },
  {
    title: 'Figma',
    logo: Figma
  },
  {
    title: 'MySQL',
    logo: SQL
  },
  {
    title: 'NativeBase',
    logo: NativeBase
  },
  {
    title: 'Python',
    logo: Python
  },

  {
    title: 'SASS',
    logo: SASS
  },
  {
    title: 'Spring Boot',
    logo: Spring
  },
  {
    title: 'Tailwind CSS',
    logo: Tailwind,
    isUpcoming: true
  }
];

// =============================|| LANDING - FRAMWORK SECTION ||============================= //

const SkillsSection = () => {
  const theme = useTheme();
  const { handleTranslation } = useLanguage();
  const settings = {
    dots: true,
    className: 'center',
    infinite: true,
    slidesToShow: 7,
    slidesToScroll: 7,
    speed: 500,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1534,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
          dots: true
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          dots: true
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: true
        }
      }
    ]
  };

  return (
    <>
      <Container sx={{ mb: 6 }}>
        <FadeInWhenVisible direction="up">
          <Stack spacing={1.5} alignItems="center">
            <Typography variant="h2" align="center" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
              {handleTranslation('skillsSection.title')}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 400 }} align="center">
              {handleTranslation('skillsSection.subtitle')}
            </Typography>
          </Stack>
        </FadeInWhenVisible>
      </Container>
      <Box
        className="slider-container"
        component="div"
        sx={{
          overflow: 'hidden',
          div: {
            textAlign: 'center'
          },
          '.slick-track': {
            display: { xs: 'flex', xl: 'inherit' }
          },
          '& .slick-dots': {
            position: 'initial',
            mt: 4,
            '& li button:before': {
              fontSize: '0.75rem'
            },
            '& li.slick-active button:before': {
              opacity: 1,
              color: 'primary.main'
            }
          }
        }}
      >
        <Slider {...settings}>
          {frameworks.map((item, index) => (
            <Badge
              key={index}
              color="primary"
              badgeContent={item.isUpcoming ? 'Coming Soon' : 0}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              sx={{
                '& .MuiBadge-badge': {
                  left: '50%',
                  transform: 'scale(1) translate(-50%, 0)',
                  ...(item.isUpcoming && {
                    bgcolor: 'background.paper',
                    color: 'primary.main',
                    border: '1px solid',
                    borderColor: theme.palette.primary.main
                  })
                }
              }}
            >
              <SubCard
                content={false}
                sx={{
                  width: '180px !important',
                  height: 140,
                  boxShadow: '0px 4px 15px 0px rgba(3, 99, 242, 0.15)',
                  border: 'none',
                  display: 'inline-flex !important',
                  alignItems: 'center',
                  justifyContent: 'center',
                  my: 1,
                  borderRadius: 2,
                  cursor: 'pointer',
                  bgcolor: theme.palette.mode === 'dark' ? 'dark.800' : 'grey.100',
                  transition: 'transform 0.22s ease, box-shadow 0.22s ease, background-color 0.22s ease',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? 'primary.main' : 'primary.light',
                    transform: 'translateY(-6px) scale(1.03)',
                    boxShadow: '0px 16px 32px rgba(59, 130, 246, 0.28)',
                  }
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flex: 1,
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Stack spacing={2} alignItems="center">
                    <Stack sx={{ width: 'auto', height: 48 }} alignItems="center" justifyContent="center">
                      <CardMedia
                        alt={item.title}
                        src={item.logo.src}
                        component="img"
                        sx={{ height: '100%', p: 0.5 }}
                      />
                    </Stack>
                    <Typography variant="h4" sx={{ width: 'max-content' }}>
                      {item.title}
                    </Typography>
                  </Stack>
                </Box>
              </SubCard>
            </Badge>
          ))}
        </Slider>
      </Box>
    </>
  );
};

export default SkillsSection;
