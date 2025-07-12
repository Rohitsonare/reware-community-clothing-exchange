import React, { useState, useEffect } from 'react';
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
  Paper,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Pagination,
} from '@mui/material';
import {
  Recycling,
  Search,
  Home,
  FilterList,
  ArrowBack,
  Favorite,
  Share,
  LocationOn,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';

const BrowseItems = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  // Handle category from URL parameters
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      const categoryMap = {
        'womensclothing': 'women',
        'mensclothing': 'men',
        'kidsbaby': 'kids',
        'accessories': 'accessories',
        'luxurydesigner': 'luxury',
        'activewear': 'activewear',
      };
      setCategory(categoryMap[categoryFromUrl] || 'all');
    }
  }, [searchParams]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'women', label: 'Women\'s Clothing' },
    { value: 'men', label: 'Men\'s Clothing' },
    { value: 'kids', label: 'Kids & Baby' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'luxury', label: 'Luxury & Designer' },
    { value: 'activewear', label: 'Activewear' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'points-low', label: 'Points: Low to High' },
    { value: 'points-high', label: 'Points: High to Low' },
    { value: 'distance', label: 'Distance' },
  ];

  const allItems = [
    {
      id: 1,
      title: 'Vintage Denim Jacket',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=300&h=400&fit=crop',
      owner: 'Sarah M.',
      condition: 'Like New',
      points: 45,
      category: 'women',
      distance: '0.5 miles',
      description: 'Classic vintage denim jacket in excellent condition',
      size: 'M',
      brand: 'Levi\'s',
    },
    {
      id: 2,
      title: 'Designer Handbag',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=400&fit=crop',
      owner: 'Mike K.',
      condition: 'Excellent',
      points: 80,
      category: 'accessories',
      distance: '1.2 miles',
      description: 'Authentic designer handbag with original packaging',
      size: 'One Size',
      brand: 'Coach',
    },
    {
      id: 3,
      title: 'Casual Summer Dress',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=400&fit=crop',
      owner: 'Emma L.',
      condition: 'Good',
      points: 35,
      category: 'women',
      distance: '2.1 miles',
      description: 'Light and breezy summer dress, perfect for warm weather',
      size: 'S',
      brand: 'H&M',
    },
    {
      id: 4,
      title: 'Leather Boots',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5c?w=300&h=400&fit=crop',
      owner: 'James R.',
      condition: 'Like New',
      points: 60,
      category: 'accessories',
      distance: '0.8 miles',
      description: 'High-quality leather boots, barely worn',
      size: '9',
      brand: 'Dr. Martens',
    },
    {
      id: 5,
      title: 'Men\'s Polo Shirt',
      image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=400&fit=crop',
      owner: 'Alex T.',
      condition: 'Very Good',
      points: 25,
      category: 'men',
      distance: '1.5 miles',
      description: 'Classic polo shirt in navy blue',
      size: 'L',
      brand: 'Ralph Lauren',
    },
    {
      id: 6,
      title: 'Kids Winter Coat',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
      owner: 'Lisa P.',
      condition: 'Good',
      points: 40,
      category: 'kids',
      distance: '3.2 miles',
      description: 'Warm winter coat for kids, size 6-7 years',
      size: '6-7Y',
      brand: 'North Face',
    },
    {
      id: 7,
      title: 'Yoga Leggings',
      image: 'https://images.unsplash.com/photo-1506629905851-f4ca00225e34?w=300&h=400&fit=crop',
      owner: 'Maya S.',
      condition: 'Like New',
      points: 30,
      category: 'activewear',
      distance: '1.8 miles',
      description: 'High-waisted yoga leggings with side pockets',
      size: 'M',
      brand: 'Lululemon',
    },
    {
      id: 8,
      title: 'Business Blazer',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop',
      owner: 'David H.',
      condition: 'Excellent',
      points: 55,
      category: 'men',
      distance: '2.5 miles',
      description: 'Professional blazer perfect for business meetings',
      size: 'L',
      brand: 'Hugo Boss',
    },
  ];

  const filteredItems = allItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={() => navigate('/')}
              sx={{ mr: 2, color: 'text.primary' }}
            >
              <ArrowBack />
            </IconButton>
            <Recycling sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              ReWear
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Button
              color="inherit"
              startIcon={<Home />}
              onClick={() => navigate('/')}
              sx={{ color: 'text.primary', textTransform: 'none' }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              sx={{ color: 'text.primary', textTransform: 'none', fontWeight: 'bold' }}
            >
              Browse
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/signin')}
              sx={{ textTransform: 'none' }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/signup')}
              sx={{ textTransform: 'none' }}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Search and Filter Section */}
      <Paper sx={{ py: 4, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
            Browse Community Items
          </Typography>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search items, brands, or descriptions..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ bgcolor: 'white' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                  sx={{ bgcolor: 'white' }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                  sx={{ bgcolor: 'white' }}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Items Grid */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h6" color="text.secondary">
            {filteredItems.length} items found
          </Typography>
          <Button
            startIcon={<FilterList />}
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            More Filters
          </Button>
        </Box>

        <Grid container spacing={3}>
          {paginatedItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      {item.title}
                    </Typography>
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                      <Favorite />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {item.brand} • Size {item.size}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Shared by {item.owner}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {item.distance}
                    </Typography>
                  </Box>
                  
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
                  
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      sx={{ textTransform: 'none' }}
                    >
                      View Details
                    </Button>
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                      <Share />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Container>

      {/* Call to Action */}
      <Paper
        sx={{
          py: 6,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Ready to Share Your Own Items?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join our community and start exchanging today!
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
            Join ReWear
          </Button>
        </Container>
      </Paper>
    </Box>
  );
};

export default BrowseItems;
