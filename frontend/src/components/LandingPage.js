import React from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  AppBar,
  Toolbar,
  useTheme,
  Stack,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Recycling,
  People,
  Star,
  SwapHoriz,
  Nature,
  Favorite,
  Groups,
  Search,
  Home,
  Category,
  Login,
  PersonAdd,
  Woman,
  Man,
  ChildCare,
  Checkroom,
  Diamond,
  SportsBasketball,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Check if user is already authenticated
  React.useEffect(() => {
    if (AuthService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const categories = [
    {
      icon: <Woman sx={{ fontSize: 50, color: '#FF6B9D' }} />,
      title: 'Women\'s Clothing',
      description: 'Dresses, tops, bottoms, outerwear',
      color: '#FF6B9D',
    },
    {
      icon: <Man sx={{ fontSize: 50, color: '#4A90E2' }} />,
      title: 'Men\'s Clothing',
      description: 'Shirts, pants, jackets, suits',
      color: '#4A90E2',
    },
    {
      icon: <ChildCare sx={{ fontSize: 50, color: '#FFD93D' }} />,
      title: 'Kids & Baby',
      description: 'Children\'s clothes, baby wear',
      color: '#FFD93D',
    },
    {
      icon: <Checkroom sx={{ fontSize: 50, color: '#6BCF7F' }} />,
      title: 'Accessories',
      description: 'Bags, jewelry, belts, scarves',
      color: '#6BCF7F',
    },
    {
      icon: <Diamond sx={{ fontSize: 50, color: '#9B59B6' }} />,
      title: 'Luxury & Designer',
      description: 'High-end fashion pieces',
      color: '#9B59B6',
    },
    {
      icon: <SportsBasketball sx={{ fontSize: 50, color: '#E67E22' }} />,
      title: 'Activewear',
      description: 'Sportswear, gym clothes',
      color: '#E67E22',
    },
  ];

  const featuredItems = [
    {
      id: 1,
      title: 'Vintage Denim Jacket',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=300&h=400&fit=crop',
      owner: 'Sarah M.',
      condition: 'Like New',
      points: 45,
    },
    {
      id: 2,
      title: 'Designer Handbag',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=400&fit=crop',
      owner: 'Mike K.',
      condition: 'Excellent',
      points: 80,
    },
    {
      id: 3,
      title: 'Casual Summer Dress',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=400&fit=crop',
      owner: 'Emma L.',
      condition: 'Good',
      points: 35,
    },
    {
      id: 4,
      title: 'Leather Boots',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5c?w=300&h=400&fit=crop',
      owner: 'James R.',
      condition: 'Like New',
      points: 60,
    },
  ];

  const features = [
    {
      icon: <SwapHoriz sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Clothing Exchange',
      description: 'Trade your pre-loved clothes with community members and discover new styles.',
    },
    {
      icon: <Nature sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Sustainable Fashion',
      description: 'Reduce textile waste by giving clothes a second life in your community.',
    },
    {
      icon: <People sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Community Driven',
      description: 'Connect with like-minded people who care about sustainable fashion.',
    },
    {
      icon: <Star sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Points System',
      description: 'Earn points for sharing clothes and use them to get new items.',
    },
  ];

  const stats = [
    { number: '1,000+', label: 'Items Exchanged', icon: <SwapHoriz /> },
    { number: '500+', label: 'Community Members', icon: <Groups /> },
    { number: '75%', label: 'Waste Reduction', icon: <Recycling /> },
    { number: '95%', label: 'User Satisfaction', icon: <Favorite /> },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Recycling sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              ReWear
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Button
              color="inherit"
              startIcon={<Home />}
              sx={{ color: 'text.primary', textTransform: 'none' }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              startIcon={<Category />}
              onClick={() => navigate('/browse')}
              sx={{ color: 'text.primary', textTransform: 'none' }}
            >
              Browse
            </Button>
            <Button
              color="inherit"
              sx={{ color: 'text.primary', textTransform: 'none' }}
            >
              About
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Login />}
              onClick={() => navigate('/signin')}
              sx={{ textTransform: 'none' }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => navigate('/signup')}
              sx={{ textTransform: 'none' }}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            Community Clothing Exchange
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
          >
            Discover, exchange, and share clothing within your community. 
            Sustainable fashion made simple and accessible for everyone.
          </Typography>
          
          {/* Search Bar */}
          <Box sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            <TextField
              fullWidth
              placeholder="Search for clothing items, brands, or styles..."
              variant="outlined"
              sx={{ 
                bgcolor: 'white',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" color="primary">
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* CTA Buttons */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            sx={{ justifyContent: 'center', mb: 6 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                textTransform: 'none',
                py: 1.5,
                px: 4,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
            >
              Start Swapping
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/browse')}
              sx={{
                textTransform: 'none',
                py: 1.5,
                px: 4,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 'bold',
              }}
            >
              Browse Items
            </Button>
          </Stack>
        </Box>

        {/* Hero Image/Illustration */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
            borderRadius: 4,
            p: 6,
            textAlign: 'center',
            minHeight: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px dashed ${theme.palette.primary.main}30`,
          }}
        >
          <Box>
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', mb: 3 }}>
              <Recycling sx={{ fontSize: 60, color: theme.palette.primary.main }} />
              <SwapHoriz sx={{ fontSize: 60, color: theme.palette.secondary.main }} />
              <Groups sx={{ fontSize: 60, color: theme.palette.primary.main }} />
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
              Featured Community Items
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Browse through hundreds of clothing items shared by your community
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          Shop by Category
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
        >
          Find exactly what you're looking for in our organized categories
        </Typography>

        <Grid container spacing={3}>
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                onClick={() => navigate(`/browse?category=${category.title.toLowerCase().replace(/[^a-z0-9]/g, '')}`)}
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.3s ease-in-out',
                  cursor: 'pointer',
                  border: `2px solid transparent`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                    border: `2px solid ${category.color}`,
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {category.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {category.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Items Section */}
      <Paper sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{ fontWeight: 'bold', mb: 2 }}
          >
            Featured Items
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            Discover these popular items shared by our community members
          </Typography>

          <Grid container spacing={4}>
            {featuredItems.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.id}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="250"
                    image={item.image}
                    alt={item.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Shared by {item.owner}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        label={item.condition}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {item.points} pts
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/browse')}
              sx={{
                textTransform: 'none',
                py: 1.5,
                px: 4,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 'bold',
              }}
            >
              View All Items
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          Why Choose ReWear?
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
        >
          Our platform makes sustainable fashion accessible, fun, and rewarding for everyone.
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Paper sx={{ py: 6, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{ fontWeight: 'bold', mb: 6 }}
          >
            Our Community Impact
          </Typography>
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ color: theme.palette.primary.main, mb: 1 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {stat.number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Paper>

      {/* CTA Section */}
      <Paper
        sx={{
          py: 8,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Ready to Start Your Sustainable Fashion Journey?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of fashion-conscious individuals making a difference.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/signup')}
            sx={{
              bgcolor: 'white',
              color: theme.palette.primary.main,
              textTransform: 'none',
              py: 2,
              px: 6,
              borderRadius: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            Join ReWear Today
          </Button>
        </Container>
      </Paper>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Recycling sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  ReWear
                </Typography>
              </Box>
              <Typography variant="body2" color="grey.400">
                Making sustainable fashion accessible to everyone through community-driven clothing exchange.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Get Started
              </Typography>
              <Stack direction="row" spacing={2}>
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
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
