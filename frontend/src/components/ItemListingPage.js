import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  InputAdornment,
  IconButton, 
  Button,
  Chip,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Skeleton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Badge,
  Fab,
  Autocomplete,
  Slider,
  CardActions,
  Menu,
  Fade,
  Backdrop,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Search,
  FilterList,
  GridView,
  ViewList,
  Favorite,
  FavoriteBorder,
  Share,
  LocationOn,
  Star,
  Visibility,
  SwapHoriz,
  Close,
  ArrowBack,
  SortByAlpha,
  AccessTime,
  TrendingUp,
  Category,
  Home,
  AccountCircle,
  Settings,
  ShoppingCart,
  Checkroom,
  LocalOffer,
  Refresh,
  Add
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/apiService';
import { debounce } from 'lodash';

const ItemListingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

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
    sortBy: 'newest'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });
  const [viewMode, setViewMode] = useState('grid');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemDetailOpen, setItemDetailOpen] = useState(false);
  const [swapRequestOpen, setSwapRequestOpen] = useState(false);
  const [swapRequestItem, setSwapRequestItem] = useState(null);
  const [filterCounts, setFilterCounts] = useState({});
  const [likedItems, setLikedItems] = useState(new Set());
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Constants
  const categories = ['all', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear', 'Accessories', 'Other'];
  const sizes = ['all', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
  const conditions = ['all', 'Excellent', 'Good', 'Fair', 'Poor'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'pointsLowToHigh', label: 'Points: Low to High' },
    { value: 'pointsHighToLow', label: 'Points: High to Low' },
    { value: 'mostViewed', label: 'Most Viewed' },
    { value: 'mostLiked', label: 'Most Liked' },
    { value: 'alphabetical', label: 'A-Z' }
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
  const fetchItems = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: page.toString(),
        limit: pagination.itemsPerPage.toString(),
        ...filters
      };
      
      if (searchTerm) params.search = searchTerm;

      const data = await ApiService.get('/api/items', params);
      
      setItems(data.items);
      setPagination(data.pagination);
      setFilterCounts(data.filters);
      
      // Track liked items
      const userLikedItems = new Set();
      data.items.forEach(item => {
        if (item.likes.includes(user?.id)) {
          userLikedItems.add(item._id);
        }
      });
      setLikedItems(userLikedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm, pagination.itemsPerPage, user?.id]);

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
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handlePageChange = (event, page) => {
    fetchItems(page);
    window.scrollTo(0, 0);
  };

  const handleItemClick = async (item) => {
    setSelectedItem(item);
    setItemDetailOpen(true);
    
    // Fetch detailed item data
    try {
      const response = await ApiService.get(`/api/items/${item._id}`);
      setSelectedItem(response.item);
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  };

  const handleLikeToggle = async (itemId, event) => {
    event.stopPropagation();
    
    if (!user) {
      showSnackbar('Please sign in to like items', 'warning');
      return;
    }

    try {
      const data = await ApiService.post(`/api/items/${itemId}/like`, { userId: user.id });
      
      setLikedItems(prev => {
        const newSet = new Set(prev);
        if (data.isLiked) {
          newSet.add(itemId);
        } else {
          newSet.delete(itemId);
        }
        return newSet;
      });
      
      // Update item in list
      setItems(prev => prev.map(item => 
        item._id === itemId 
          ? { ...item, likes: data.isLiked 
              ? [...item.likes, user.id] 
              : item.likes.filter(id => id !== user.id) 
            }
          : item
      ));
      
      showSnackbar(data.message, 'success');
    } catch (error) {
      console.error('Error toggling like:', error);
      showSnackbar('Failed to update like', 'error');
    }
  };

  const handleSwapRequest = (item) => {
    if (!user) {
      showSnackbar('Please sign in to request swaps', 'warning');
      return;
    }
    
    // Open swap request dialog
    setSwapRequestItem(item);
    setSwapRequestOpen(true);
  };

  const handleSwapRequestSubmit = async () => {
    if (!swapRequestItem) return;
    
    try {
      // Call API to create swap request
      const response = await ApiService.post(`/api/swaps/request`, {
        itemId: swapRequestItem._id,
        requesterId: user.id,
        requesterItemId: swapRequestItem._id, // Temporary: using the same item ID
        message: `I'd like to swap for your ${swapRequestItem.title}`
      });
      
      showSnackbar('Swap request sent successfully!', 'success');
      setSwapRequestOpen(false);
      setSwapRequestItem(null);
    } catch (error) {
      console.error('Error sending swap request:', error);
      showSnackbar('Failed to send swap request. Please try again.', 'error');
    }
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      size: 'all',
      condition: 'all',
      minPoints: '',
      maxPoints: '',
      color: '',
      brand: '',
      location: '',
      sortBy: 'newest'
    });
    setSearchTerm('');
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Excellent': return 'success';
      case 'Good': return 'primary';
      case 'Fair': return 'warning';
      case 'Poor': return 'error';
      default: return 'default';
    }
  };

  const renderItemCard = (item) => (
    <Card 
      key={item._id}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8]
        }
      }}
      onClick={() => handleItemClick(item)}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={item.images?.[0] || 'https://via.placeholder.com/300x200/f5f5f5/999?text=No+Image'}
          alt={item.title}
          sx={{ 
            objectFit: 'cover',
            backgroundColor: 'grey.100'
          }}
        />
        <Box sx={{ 
          position: 'absolute', 
          top: 8, 
          right: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          <IconButton
            size="small"
            onClick={(e) => handleLikeToggle(item._id, e)}
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' }
            }}
          >
            {likedItems.has(item._id) ? 
              <Favorite sx={{ color: 'red' }} /> : 
              <FavoriteBorder />
            }
          </IconButton>
          <Chip
            label={`${item.pointsValue} pts`}
            size="small"
            color="success"
            sx={{ 
              bgcolor: 'rgba(76, 175, 80, 0.9)',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Box>
        <Box sx={{ 
          position: 'absolute', 
          bottom: 8, 
          left: 8,
          display: 'flex',
          gap: 1
        }}>
          <Chip
            label={item.condition}
            size="small"
            color={getConditionColor(item.condition)}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)' }}
          />
          <Chip
            label={item.isAvailable ? 'Available' : 'Unavailable'}
            size="small"
            color={item.isAvailable ? 'success' : 'warning'}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)' }}
          />
        </Box>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, pb: 1, px: 2, pt: 2 }}>
        <Typography variant="h6" component="h2" noWrap gutterBottom sx={{ fontSize: '1.1rem' }}>
          {item.title}
        </Typography>
        
        {/* Item details in a compact format */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          <Chip 
            label={item.category} 
            size="small" 
            variant="outlined" 
            sx={{ fontSize: '0.7rem', height: '20px' }}
          />
          <Chip 
            label={`Size ${item.size}`} 
            size="small" 
            variant="outlined" 
            sx={{ fontSize: '0.7rem', height: '20px' }}
          />
          {item.brand && (
            <Chip 
              label={item.brand} 
              size="small" 
              variant="outlined" 
              sx={{ fontSize: '0.7rem', height: '20px' }}
            />
          )}
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.5em',
            fontSize: '0.85rem'
          }}
        >
          {item.description}
        </Typography>
        
        {/* User info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Avatar 
            sx={{ width: 20, height: 20 }}
            src={item.userId?.avatar}
          >
            {item.userId?.name?.charAt(0)}
          </Avatar>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            {item.userId?.name}
          </Typography>
        </Box>
        
        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            {item.location?.city}, {item.location?.state}
          </Typography>
        </Box>
        
        {/* Stats */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Chip 
              icon={<Visibility />} 
              label={item.views} 
              size="small" 
              variant="outlined"
              sx={{ fontSize: '0.65rem', height: '18px' }}
            />
            <Chip 
              icon={<Favorite />} 
              label={item.likes?.length || 0} 
              size="small" 
              variant="outlined"
              sx={{ fontSize: '0.65rem', height: '18px' }}
            />
          </Box>
          {item.tags && item.tags.length > 0 && (
            <Chip
              label={item.tags[0]}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.65rem', height: '18px' }}
            />
          )}
        </Box>
      </CardContent>
      
      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<SwapHoriz />}
          onClick={(e) => {
            e.stopPropagation();
            handleSwapRequest(item);
          }}
          disabled={!item.isAvailable}
          sx={{ borderRadius: 2 }}
        >
          {item.isAvailable ? 'Request Swap' : 'Unavailable'}
        </Button>
      </CardActions>
    </Card>
  );

  const renderFilterDrawer = () => (
    <Drawer
      anchor="right"
      open={filterDrawerOpen}
      onClose={() => setFilterDrawerOpen(false)}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 }, p: 2 }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={() => setFilterDrawerOpen(false)}>
          <Close />
        </IconButton>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Category Filter */}
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Size Filter */}
        <FormControl fullWidth>
          <InputLabel>Size</InputLabel>
          <Select
            value={filters.size}
            onChange={(e) => handleFilterChange('size', e.target.value)}
          >
            {sizes.map(size => (
              <MenuItem key={size} value={size}>
                {size === 'all' ? 'All Sizes' : size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Condition Filter */}
        <FormControl fullWidth>
          <InputLabel>Condition</InputLabel>
          <Select
            value={filters.condition}
            onChange={(e) => handleFilterChange('condition', e.target.value)}
          >
            {conditions.map(cond => (
              <MenuItem key={cond} value={cond}>
                {cond === 'all' ? 'All Conditions' : cond}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Points Range */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Points Range
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="Min"
              type="number"
              size="small"
              value={filters.minPoints}
              onChange={(e) => handleFilterChange('minPoints', e.target.value)}
              inputProps={{ min: 1, max: 100 }}
            />
            <TextField
              label="Max"
              type="number"
              size="small"
              value={filters.maxPoints}
              onChange={(e) => handleFilterChange('maxPoints', e.target.value)}
              inputProps={{ min: 1, max: 100 }}
            />
          </Box>
        </Box>

        {/* Color Filter */}
        <TextField
          label="Color"
          value={filters.color}
          onChange={(e) => handleFilterChange('color', e.target.value)}
          placeholder="e.g., blue, red, black"
        />

        {/* Brand Filter */}
        <TextField
          label="Brand"
          value={filters.brand}
          onChange={(e) => handleFilterChange('brand', e.target.value)}
          placeholder="e.g., Nike, Zara, H&M"
        />

        {/* Location Filter */}
        <TextField
          label="Location"
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          placeholder="City or State"
        />

        {/* Sort By */}
        <FormControl fullWidth>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            {sortOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            variant="outlined"
            onClick={clearFilters}
            startIcon={<Refresh />}
          >
            Clear All
          </Button>
          <Button
            variant="contained"
            onClick={() => setFilterDrawerOpen(false)}
            sx={{ flex: 1 }}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>
    </Drawer>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Browse Items
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => navigate('/dashboard')}
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Search and Filter Bar */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search */}
            <Autocomplete
              freeSolo
              options={searchSuggestions}
              getOptionLabel={(option) => option.title || option}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      src={option.image}
                      sx={{ width: 32, height: 32 }}
                    >
                      <Checkroom />
                    </Avatar>
                    <Box>
                      <Typography variant="body2">{option.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.brand} • {option.category}
                      </Typography>
                    </Box>
                  </Box>
                </li>
              )}
              sx={{ minWidth: 300, flex: 1 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search items..."
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              inputValue={searchTerm}
              onInputChange={(event, newValue) => handleSearchChange(newValue)}
            />

            {/* Quick Filters */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant={filters.category === 'all' ? 'contained' : 'outlined'}
                onClick={() => handleFilterChange('category', 'all')}
                size="small"
              >
                All
              </Button>
              <Button
                variant={filters.category === 'Tops' ? 'contained' : 'outlined'}
                onClick={() => handleFilterChange('category', 'Tops')}
                size="small"
              >
                Tops
              </Button>
              <Button
                variant={filters.category === 'Bottoms' ? 'contained' : 'outlined'}
                onClick={() => handleFilterChange('category', 'Bottoms')}
                size="small"
              >
                Bottoms
              </Button>
              <Button
                variant={filters.category === 'Dresses' ? 'contained' : 'outlined'}
                onClick={() => handleFilterChange('category', 'Dresses')}
                size="small"
              >
                Dresses
              </Button>
            </Box>

            {/* Filter and View Controls */}
            <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setFilterDrawerOpen(true)}
              >
                Filters
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('grid')}
                size="small"
              >
                <GridView />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('list')}
                size="small"
              >
                <ViewList />
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Results Summary */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1">
            {loading ? 'Loading...' : `${pagination.totalItems} items found`}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              {sortOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Items Grid */}
        {loading ? (
          <Grid container spacing={2}>
            {Array(12).fill(0).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} xl={3} key={index}>
                <Card>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" height={28} />
                    <Skeleton variant="text" height={18} />
                    <Skeleton variant="text" height={18} />
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Skeleton variant="rounded" width={50} height={20} />
                      <Skeleton variant="rounded" width={30} height={20} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Checkroom sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No items found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your filters or search terms
            </Typography>
            <Button variant="outlined" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {items.map((item) => (
              <Grid item xs={12} sm={6} md={4} xl={3} key={item._id}>
                {renderItemCard(item)}
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Container>

      {/* Filter Drawer */}
      {renderFilterDrawer()}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => navigate('/dashboard')}
      >
        <Add />
      </Fab>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Swap Request Dialog */}
      <Dialog 
        open={swapRequestOpen} 
        onClose={() => setSwapRequestOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SwapHoriz color="primary" />
            Request Item Swap
          </Box>
        </DialogTitle>
        <DialogContent>
          {swapRequestItem && (
            <Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box
                  component="img"
                  src={swapRequestItem.images?.[0] || 'https://via.placeholder.com/100x100/f5f5f5/999?text=No+Image'}
                  alt={swapRequestItem.title}
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    objectFit: 'cover', 
                    borderRadius: 2,
                    backgroundColor: 'grey.100'
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {swapRequestItem.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {swapRequestItem.brand && `${swapRequestItem.brand} • `}
                    {swapRequestItem.category} • Size {swapRequestItem.size}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Condition: {swapRequestItem.condition}
                  </Typography>
                  <Typography variant="body2" color="success.main" fontWeight="bold">
                    {swapRequestItem.pointsValue} Points
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Owner: {swapRequestItem.userId?.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                You are about to request a swap for this item. The owner will be notified and can respond to your request.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setSwapRequestOpen(false)}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSwapRequestSubmit}
            variant="contained"
            startIcon={<SwapHoriz />}
          >
            Send Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ItemListingPage;
