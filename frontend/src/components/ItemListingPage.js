import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Pagination,
  AppBar,
  Toolbar,
  Autocomplete,
  Avatar,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import { Search, FilterList, ArrowBack, AccountCircle, Checkroom } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/apiService';
import { debounce } from 'lodash';
import ItemCard from './items/ItemCard';
import FilterSidebar from './items/FilterSidebar';

const ItemListingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State management
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSuggestions] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    size: 'all',
    condition: 'all',
    minPoints: '',
    maxPoints: '',
    color: '',
    brand: '',
    location: '',
    sortBy: 'newest',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  });
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Constants
  const categories = [
    'all',
    'Tops',
    'Bottoms',
    'Dresses',
    'Outerwear',
    'Footwear',
    'Accessories',
    'Other',
  ];
  const sizes = ['all', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
  const conditions = ['all', 'Excellent', 'Good', 'Fair', 'Poor'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'pointsLowToHigh', label: 'Points: Low to High' },
    { value: 'pointsHighToLow', label: 'Points: High to Low' },
    { value: 'mostViewed', label: 'Most Viewed' },
    { value: 'mostLiked', label: 'Most Liked' },
    { value: 'alphabetical', label: 'A-Z' },
  ];

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (term.length >= 2) {
        try {
          const suggestions = await ApiService.get('/api/items/search/suggestions', { q: term });
          setSuggestions(suggestions);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    }, 300),
    []
  );

  // Fetch items
  const fetchItems = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          page: page.toString(),
          limit: pagination.itemsPerPage.toString(),
          ...filters,
        };

        if (searchTerm) params.search = searchTerm;

        const data = await ApiService.get('/api/items', params);

        setItems(data.items);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Error fetching items:', error);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [filters, searchTerm, pagination.itemsPerPage]
  );

  // Effects
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Handler functions
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setSuggestions([]);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: 'all',
      size: 'all',
      condition: 'all',
      minPoints: '',
      maxPoints: '',
      color: '',
      brand: '',
      location: '',
      sortBy: 'newest',
    });
    setSearchTerm('');
  };

  const handlePageChange = (event, page) => {
    fetchItems(page);
    window.scrollTo(0, 0);
  };

  const handleItemClick = (item) => {
    navigate(`/item/${item._id}`);
  };

  const handleLikeToggle = async (itemId, event) => {
    event.stopPropagation();

    if (!user) {
      showSnackbar('Please sign in to like items', 'warning');
      return;
    }

    try {
      const data = await ApiService.post(`/api/items/${itemId}/like`, { userId: user.id });

      // Update item in list
      setItems((prev) =>
        prev.map((item) =>
          item._id === itemId
            ? {
                ...item,
                likes: data.isLiked
                  ? [...(item.likes || []), user.id]
                  : (item.likes || []).filter((id) => id !== user.id),
              }
            : item
        )
      );

      showSnackbar(data.message, 'success');
    } catch (error) {
      console.error('Error toggling like:', error);
      showSnackbar('Failed to update like', 'error');
    }
  };

  const handleSwapRequest = async (item) => {
    if (!user) {
      showSnackbar('Please sign in to request swaps', 'warning');
      return;
    }

    // Logic for opening swap dialog would go here
    // For now just showing a message as the dialog component wasn't fully extracted yet
    showSnackbar('Swap request feature coming soon!', 'info');
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => navigate('/')}
            sx={{ mr: 2, color: 'text.primary' }}
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: 'text.primary', fontWeight: 'bold' }}
          >
            Browse Items
          </Typography>
          <IconButton onClick={() => navigate('/dashboard')} sx={{ color: 'text.primary' }}>
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Search and Filter Bar */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            mb: 4,
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Autocomplete
            freeSolo
            options={searchSuggestions}
            getOptionLabel={(option) => option.title || option}
            renderOption={(props, option) => (
              <li {...props}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                  <Avatar src={option.images?.[0]} variant="rounded" sx={{ width: 40, height: 40 }}>
                    <Checkroom />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {option.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.brand} • {option.category}
                    </Typography>
                  </Box>
                </Box>
              </li>
            )}
            sx={{ flex: 1, width: '100%' }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search items, brands, or categories..."
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            inputValue={searchTerm}
            onInputChange={(event, newValue) => handleSearchChange(newValue)}
          />

          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setFilterDrawerOpen(true)}
            sx={{
              height: 56,
              px: 4,
              width: { xs: '100%', md: 'auto' },
              borderColor: 'divider',
              color: 'text.primary',
            }}
          >
            Filters
          </Button>
        </Box>

        {/* Results Count */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Showing <strong>{items.length}</strong> of <strong>{pagination.totalItems}</strong>{' '}
            items
          </Typography>
        </Box>

        {/* Items Grid */}
        {loading ? (
          <Grid container spacing={3}>
            {[...Array(8)].map((_, i) => (
              <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
                <Box sx={{ height: 400, bgcolor: 'grey.100', borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
            <Button variant="outlined" onClick={() => fetchItems()}>
              Try Again
            </Button>
          </Box>
        ) : items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Checkroom sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No items found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your search or filters
            </Typography>
            <Button variant="contained" onClick={handleClearFilters}>
              Clear All Filters
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {items.map((item) => (
              <Grid item key={item._id} xs={12} sm={6} md={4} lg={3}>
                <ItemCard
                  item={item}
                  user={user}
                  onLikeToggle={handleLikeToggle}
                  onSwapRequest={handleSwapRequest}
                  onClick={handleItemClick}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={handlePageChange}
              color="primary"
              size={isMobile ? 'medium' : 'large'}
            />
          </Box>
        )}
      </Container>

      {/* Filter Sidebar */}
      <FilterSidebar
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        categories={categories}
        sizes={sizes}
        conditions={conditions}
        sortOptions={sortOptions}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ItemListingPage;
