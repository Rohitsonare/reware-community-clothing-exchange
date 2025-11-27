import React from 'react';
import { Box, Container, Grid, Typography, Button, Stack, useTheme } from '@mui/material';
import { Recycling } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 6, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Recycling sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                ReWear
              </Typography>
            </Box>
            <Typography variant="body2" color="grey.400" sx={{ maxWidth: 400 }}>
              Making sustainable fashion accessible to everyone through community-driven clothing
              exchange. Join us in reducing textile waste and building a more sustainable future.
            </Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Button
                color="inherit"
                sx={{ justifyContent: 'flex-start', p: 0, minWidth: 0, color: 'grey.400' }}
                onClick={() => navigate('/')}
              >
                Home
              </Button>
              <Button
                color="inherit"
                sx={{ justifyContent: 'flex-start', p: 0, minWidth: 0, color: 'grey.400' }}
                onClick={() => navigate('/browse')}
              >
                Browse Items
              </Button>
              <Button
                color="inherit"
                sx={{ justifyContent: 'flex-start', p: 0, minWidth: 0, color: 'grey.400' }}
                onClick={() => navigate('/about')}
              >
                About Us
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Get Started
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/signin')}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: 'grey.300',
                    bgcolor: 'grey.800',
                  },
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate('/signup')}
                sx={{
                  textTransform: 'none',
                  bgcolor: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                Sign Up
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ borderTop: 1, borderColor: 'grey.800', mt: 4, pt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="grey.600">
            © {new Date().getFullYear()} ReWear Community Clothing Exchange. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
