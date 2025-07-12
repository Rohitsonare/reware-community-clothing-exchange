import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  LinearProgress,
  Badge,
  Tooltip,
  Alert,
  Snackbar,
  Fab,
  CardActions,
  CardHeader,
} from '@mui/material';
import {
  AccountCircle,
  Add,
  SwapHoriz,
  TrendingUp,
  People,
  Notifications,
  Settings,
  ExitToApp,
  Edit,
  Delete,
  Visibility,
  Favorite,
  LocationOn,
  Schedule,
  CheckCircle,
  Cancel,
  Star,
  StarBorder,
  PhotoCamera,
  FilterList,
  Search,
  MoreVert,
  AccessTime,
  MonetizationOn,
  LocalShipping,
  ThumbUp,
  ThumbDown,
  Message,
  Share,
  Bookmark,
  BookmarkBorder,
  Checkroom,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthService from '../../services/authService';
import dashboardService from '../../services/dashboardService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [profileDialog, setProfileDialog] = useState(false);
  const [itemDialog, setItemDialog] = useState(false);
  const [swapDialog, setSwapDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSwap, setSelectedSwap] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    bio: '',
    location: { city: '', state: '', country: 'USA' },
    preferences: { sizes: [], categories: [], brands: [] }
  });

  const [itemForm, setItemForm] = useState({
    title: '',
    description: '',
    category: '',
    size: '',
    condition: '',
    brand: '',
    color: '',
    pointsValue: 10,
    location: { city: '', state: '', country: 'USA' },
    tags: ''
  });

  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear', 'Accessories', 'Other'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
  const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      
      // For demo purposes, we'll use mock data if API fails
      try {
        const data = await dashboardService.getDashboardData(currentUser.id);
        setDashboardData(data);
        console.log('Dashboard data loaded successfully:', data);
      } catch (apiError) {
        console.error('Dashboard API error:', apiError);
        console.log('API not available, using mock data');
        setDashboardData(getMockDashboardData(currentUser));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      AuthService.signout();
      navigate('/signin');
    } finally {
      setLoading(false);
    }
  };

  const getMockDashboardData = (user) => ({
    user,
    items: [
      {
        _id: '1',
        title: 'Vintage Denim Jacket',
        description: 'Classic blue denim jacket in excellent condition',
        category: 'Outerwear',
        size: 'M',
        condition: 'Excellent',
        brand: 'Levi\'s',
        color: 'Blue',
        pointsValue: 25,
        isAvailable: true,
        images: ['https://images.unsplash.com/photo-1544441893-675973e31985?w=300&h=400&fit=crop'],
        views: 15,
        likes: ['user1', 'user2'],
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        _id: '2',
        title: 'Summer Floral Dress',
        description: 'Beautiful floral print dress, perfect for summer',
        category: 'Dresses',
        size: 'S',
        condition: 'Good',
        brand: 'Zara',
        color: 'Multicolor',
        pointsValue: 20,
        isAvailable: false,
        images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=400&fit=crop'],
        views: 8,
        likes: ['user3'],
        createdAt: '2024-01-20T14:15:00Z'
      },
      {
        _id: '3',
        title: 'Nike Running Shoes',
        description: 'Barely worn running shoes, size 9',
        category: 'Footwear',
        size: 'M',
        condition: 'Excellent',
        brand: 'Nike',
        color: 'Black',
        pointsValue: 35,
        isAvailable: true,
        images: ['https://images.unsplash.com/photo-1544966503-7cc5ac882d5c?w=300&h=400&fit=crop'],
        views: 22,
        likes: ['user4', 'user5', 'user6'],
        createdAt: '2024-01-10T09:00:00Z'
      }
    ],
    swaps: {
      ongoing: [
        {
          _id: '1',
          status: 'pending',
          requesterItemId: { title: 'Vintage Denim Jacket', images: ['https://images.unsplash.com/photo-1544441893-675973e31985?w=150&h=100&fit=crop'], pointsValue: 25 },
          ownerItemId: { title: 'Leather Boots', images: ['https://images.unsplash.com/photo-1544966503-7cc5ac882d5c?w=150&h=100&fit=crop'], pointsValue: 30 },
          requesterId: { name: 'John Doe', profilePicture: '' },
          ownerId: { name: 'Jane Smith', profilePicture: '' },
          createdAt: '2024-01-25T12:00:00Z'
        },
        {
          _id: '2',
          status: 'accepted',
          requesterItemId: { title: 'Summer Dress', images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=150&h=100&fit=crop'], pointsValue: 20 },
          ownerItemId: { title: 'Casual Shirt', images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&h=100&fit=crop'], pointsValue: 15 },
          requesterId: { name: 'Alice Johnson', profilePicture: '' },
          ownerId: user,
          createdAt: '2024-01-22T16:30:00Z'
        }
      ],
      completed: [
        {
          _id: '3',
          status: 'completed',
          requesterItemId: { title: 'Winter Coat', images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=150&h=100&fit=crop'], pointsValue: 40 },
          ownerItemId: { title: 'Wool Sweater', images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=150&h=100&fit=crop'], pointsValue: 35 },
          requesterId: user,
          ownerId: { name: 'Bob Wilson', profilePicture: '' },
          completedAt: '2024-01-15T11:00:00Z',
          rating: { requesterRating: 5, ownerRating: 4 }
        }
      ]
    },
    stats: {
      totalPoints: user.points || 150,
      totalItems: 3,
      totalSwaps: 3,
      ongoingSwaps: 2,
      completedSwaps: 1,
      successRate: 100
    }
  });

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    AuthService.signout();
    navigate('/signin');
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleProfileEdit = () => {
    setProfileForm({
      name: user.name || '',
      bio: user.bio || '',
      location: user.location || { city: '', state: '', country: 'USA' },
      preferences: user.preferences || { sizes: [], categories: [], brands: [] }
    });
    setProfileDialog(true);
  };

  const handleProfileSave = async () => {
    try {
      // Update user data in mock data
      const updatedUser = { ...user, ...profileForm };
      setUser(updatedUser);
      setDashboardData({
        ...dashboardData,
        user: updatedUser
      });
      setProfileDialog(false);
      showSnackbar('Profile updated successfully!', 'success');
    } catch (error) {
      showSnackbar('Error updating profile', 'error');
    }
  };

  const handleItemAdd = () => {
    navigate('/add-item');
  };

  const handleItemEdit = (item) => {
    setSelectedItem(item);
    setItemForm({
      title: item.title,
      description: item.description,
      category: item.category,
      size: item.size,
      condition: item.condition,
      brand: item.brand,
      color: item.color,
      pointsValue: item.pointsValue,
      location: item.location || { city: '', state: '', country: 'USA' },
      tags: item.tags ? item.tags.join(', ') : ''
    });
    setItemDialog(true);
  };

  const handleItemSave = async () => {
    try {
      const itemData = {
        ...itemForm,
        userId: user.id,
        tags: itemForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        images: ['https://via.placeholder.com/300x200/e0e0e0/757575?text=' + encodeURIComponent(itemForm.title)],
        views: 0,
        likes: [],
        createdAt: new Date().toISOString(),
        isAvailable: true
      };

      if (selectedItem) {
        // Update existing item in mock data
        const updatedItems = dashboardData.items.map(item => 
          item._id === selectedItem._id ? { ...item, ...itemData, _id: selectedItem._id } : item
        );
        setDashboardData({
          ...dashboardData,
          items: updatedItems
        });
        showSnackbar('Item updated successfully!', 'success');
      } else {
        // Add new item to mock data
        const newItem = {
          ...itemData,
          _id: Date.now().toString() // Simple ID generation
        };
        setDashboardData({
          ...dashboardData,
          items: [...dashboardData.items, newItem],
          stats: {
            ...dashboardData.stats,
            totalItems: dashboardData.items.length + 1
          }
        });
        showSnackbar('Item added successfully!', 'success');
      }
      
      setItemDialog(false);
    } catch (error) {
      showSnackbar('Error saving item', 'error');
    }
  };

  const handleItemDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        // Remove item from mock data
        const updatedItems = dashboardData.items.filter(item => item._id !== itemId);
        setDashboardData({
          ...dashboardData,
          items: updatedItems,
          stats: {
            ...dashboardData.stats,
            totalItems: updatedItems.length
          }
        });
        showSnackbar('Item deleted successfully!', 'success');
      } catch (error) {
        showSnackbar('Error deleting item', 'error');
      }
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSwapView = (swap) => {
    setSelectedSwap(swap);
    setSwapDialog(true);
  };

  const handleSwapAction = (swapId, action) => {
    // Update swap status based on action
    const updatedOngoingSwaps = dashboardData.swaps.ongoing.map(swap => {
      if (swap._id === swapId) {
        let newStatus = swap.status;
        if (action === 'accept') {
          newStatus = 'accepted';
        } else if (action === 'decline') {
          newStatus = 'declined';
        } else if (action === 'complete') {
          newStatus = 'completed';
        }
        return { ...swap, status: newStatus };
      }
      return swap;
    });

    // If swap is completed or declined, move it to completed swaps
    let newCompletedSwaps = [...dashboardData.swaps.completed];
    let newOngoingSwaps = updatedOngoingSwaps;

    if (action === 'complete' || action === 'decline') {
      const completedSwap = updatedOngoingSwaps.find(swap => swap._id === swapId);
      if (completedSwap) {
        newCompletedSwaps.push({
          ...completedSwap,
          completedAt: new Date().toISOString(),
          rating: action === 'complete' ? { requesterRating: 5, ownerRating: 5 } : null
        });
        newOngoingSwaps = updatedOngoingSwaps.filter(swap => swap._id !== swapId);
      }
    }

    setDashboardData({
      ...dashboardData,
      swaps: {
        ongoing: newOngoingSwaps,
        completed: newCompletedSwaps
      },
      stats: {
        ...dashboardData.stats,
        ongoingSwaps: newOngoingSwaps.length,
        completedSwaps: newCompletedSwaps.length
      }
    });

    setSwapDialog(false);
    showSnackbar(`Swap ${action}ed successfully!`, 'success');
  };

  const getSwapStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'info';
      case 'completed': return 'success';
      case 'declined': return 'error';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getSwapStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Schedule />;
      case 'accepted': return <CheckCircle />;
      case 'completed': return <Star />;
      case 'declined': return <Cancel />;
      case 'cancelled': return <Cancel />;
      default: return <SwapHoriz />;
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            ReWear Dashboard
          </Typography>
          <Badge badgeContent={2} color="error">
            <IconButton color="inherit" sx={{ mr: 2 }}>
              <Notifications />
            </IconButton>
          </Badge>
          <IconButton
            size="large"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleProfileEdit}>
              <AccountCircle sx={{ mr: 2 }} />
              Edit Profile
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Settings sx={{ mr: 2 }} />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleSignOut}>
              <ExitToApp sx={{ mr: 2 }} />
              Sign Out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Profile Section */}
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {user?.name} 👋
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {user?.bio || 'Welcome to your ReWear dashboard! Start exchanging clothes and make a positive impact.'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<MonetizationOn />} 
                  label={`${dashboardData?.stats?.totalPoints || 0} Points`} 
                  color="success" 
                  variant="outlined"
                />
                <Chip 
                  icon={<Star />} 
                  label={`${user?.stats?.rating || 5.0} Rating`} 
                  color="warning" 
                  variant="outlined"
                />
                <Chip 
                  icon={<LocationOn />} 
                  label={user?.location?.city ? `${user.location.city}, ${user.location.state}` : 'Location not set'} 
                  variant="outlined"
                />
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<Search />} 
                  onClick={() => navigate('/items')}
                  sx={{ mr: 1 }}
                >
                  Browse Items
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<Edit />} 
                  onClick={handleProfileEdit}
                >
                  Edit Profile
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Quick Actions */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Search />}
                onClick={() => navigate('/items')}
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                Browse Items
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Add />}
                onClick={handleItemAdd}
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                Add New Item
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<SwapHoriz />}
                onClick={() => setCurrentTab(1)}
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                View Swaps
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AccountCircle />}
                onClick={handleProfileEdit}
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                Edit Profile
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2, height: '100%' }}>
              <CardContent>
                <MonetizationOn sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {dashboardData?.stats?.totalPoints || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Points
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(dashboardData?.stats?.totalPoints || 0) / 10} 
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2, height: '100%' }}>
              <CardContent>
                <Add sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {dashboardData?.stats?.totalItems || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Items Listed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2, height: '100%' }}>
              <CardContent>
                <SwapHoriz sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                  {dashboardData?.stats?.totalSwaps || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Swaps
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2, height: '100%' }}>
              <CardContent>
                <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                  {dashboardData?.stats?.successRate || 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Success Rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs Section */}
        <Paper elevation={2} sx={{ borderRadius: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} onChange={handleTabChange} centered>
              <Tab label="My Items" />
              <Tab label="Ongoing Swaps" />
              <Tab label="Completed Swaps" />
            </Tabs>
          </Box>

          {/* My Items Tab */}
          {currentTab === 0 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  My Items ({dashboardData?.items?.length || 0})
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<Search />} 
                    onClick={() => navigate('/items')}
                  >
                    Browse Items
                  </Button>
                  <Button 
                    variant="contained" 
                    startIcon={<Add />} 
                    onClick={handleItemAdd}
                  >
                    Add New Item
                  </Button>
                </Box>
              </Box>
              
              <Grid container spacing={3}>
                {dashboardData?.items?.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item._id}>
                    <Card sx={{ height: '100%' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.images?.[0] || 'https://via.placeholder.com/300x200/e0e0e0/757575?text=No+Image'}
                        alt={item.title}
                        sx={{ 
                          objectFit: 'cover',
                          backgroundColor: 'grey.100'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200/e0e0e0/757575?text=No+Image';
                        }}
                      />
                      <CardContent>
                        <Typography variant="h6" gutterBottom noWrap>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {item.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                          <Chip label={item.category} size="small" color="primary" />
                          <Chip label={item.size} size="small" />
                          <Chip label={item.condition} size="small" color="secondary" />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="success.main" fontWeight="bold">
                            {item.pointsValue} Points
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip 
                              icon={<Visibility />} 
                              label={item.views || 0} 
                              size="small" 
                              variant="outlined" 
                            />
                            <Chip 
                              icon={<Favorite />} 
                              label={item.likes?.length || 0} 
                              size="small" 
                              variant="outlined" 
                            />
                          </Box>
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          startIcon={<Edit />} 
                          onClick={() => handleItemEdit(item)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="small" 
                          color="error" 
                          startIcon={<Delete />} 
                          onClick={() => handleItemDelete(item._id)}
                        >
                          Delete
                        </Button>
                        <Box sx={{ ml: 'auto' }}>
                          <Chip 
                            label={item.isAvailable ? 'Available' : 'Unavailable'} 
                            color={item.isAvailable ? 'success' : 'default'}
                            size="small"
                          />
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              {(!dashboardData?.items || dashboardData.items.length === 0) && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No items yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Start by adding your first item to exchange
                  </Typography>
                  <Button variant="contained" startIcon={<Add />} onClick={handleItemAdd}>
                    Add Your First Item
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {/* Ongoing Swaps Tab */}
          {currentTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Ongoing Swaps ({dashboardData?.swaps?.ongoing?.length || 0})
              </Typography>
              
              <List>
                {dashboardData?.swaps?.ongoing?.map((swap) => (
                  <Paper key={swap._id} sx={{ mb: 2, p: 2 }}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar 
                          src={swap.requesterItemId.images?.[0]} 
                          sx={{ width: 56, height: 56 }}
                        >
                          <Checkroom />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {swap.requesterItemId.title}
                            </Typography>
                            <SwapHoriz />
                            <Typography variant="subtitle1" fontWeight="bold">
                              {swap.ownerItemId.title}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2">
                              With: {swap.requesterId.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(swap.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: 1 }}>
                          <Chip 
                            label={swap.status} 
                            color={getSwapStatusColor(swap.status)}
                            size="small"
                            icon={getSwapStatusIcon(swap.status)}
                          />
                          <Button size="small" variant="outlined" onClick={() => handleSwapView(swap)}>
                            View Details
                          </Button>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </Paper>
                ))}
              </List>
              
              {(!dashboardData?.swaps?.ongoing || dashboardData.swaps.ongoing.length === 0) && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No ongoing swaps
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Browse items to start new swaps
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Completed Swaps Tab */}
          {currentTab === 2 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Completed Swaps ({dashboardData?.swaps?.completed?.length || 0})
              </Typography>
              
              <List>
                {dashboardData?.swaps?.completed?.map((swap) => (
                  <Paper key={swap._id} sx={{ mb: 2, p: 2 }}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar 
                          src={swap.requesterItemId.images?.[0]} 
                          sx={{ width: 56, height: 56 }}
                        >
                          <Checkroom />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {swap.requesterItemId.title}
                            </Typography>
                            <SwapHoriz />
                            <Typography variant="subtitle1" fontWeight="bold">
                              {swap.ownerItemId.title}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2">
                              With: {swap.ownerId.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Completed: {new Date(swap.completedAt).toLocaleDateString()}
                            </Typography>
                            {swap.rating && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <Typography variant="body2">Rating:</Typography>
                                <Box sx={{ display: 'flex' }}>
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      sx={{ 
                                        color: i < (swap.rating.requesterRating || 0) ? 'warning.main' : 'grey.300',
                                        fontSize: 16
                                      }} 
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: 1 }}>
                          <Chip 
                            label="Completed" 
                            color="success"
                            size="small"
                            icon={<CheckCircle />}
                          />
                          <Button size="small" variant="outlined" onClick={() => handleSwapView(swap)}>
                            View Details
                          </Button>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </Paper>
                ))}
              </List>
              
              {(!dashboardData?.swaps?.completed || dashboardData.swaps.completed.length === 0) && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No completed swaps yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Complete your first swap to see it here
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </Container>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleItemAdd}
      >
        <Add />
      </Fab>

      {/* Profile Edit Dialog */}
      <Dialog open={profileDialog} onClose={() => setProfileDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={profileForm.name}
                onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={3}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="City"
                value={profileForm.location.city}
                onChange={(e) => setProfileForm({
                  ...profileForm, 
                  location: {...profileForm.location, city: e.target.value}
                })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="State"
                value={profileForm.location.state}
                onChange={(e) => setProfileForm({
                  ...profileForm, 
                  location: {...profileForm.location, state: e.target.value}
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileDialog(false)}>Cancel</Button>
          <Button onClick={handleProfileSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Item Add/Edit Dialog */}
      <Dialog open={itemDialog} onClose={() => setItemDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Title"
                value={itemForm.title}
                onChange={(e) => setItemForm({...itemForm, title: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Brand"
                value={itemForm.brand}
                onChange={(e) => setItemForm({...itemForm, brand: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={itemForm.description}
                onChange={(e) => setItemForm({...itemForm, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={itemForm.category}
                  onChange={(e) => setItemForm({...itemForm, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Size</InputLabel>
                <Select
                  value={itemForm.size}
                  onChange={(e) => setItemForm({...itemForm, size: e.target.value})}
                >
                  {sizes.map(size => (
                    <MenuItem key={size} value={size}>{size}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Condition</InputLabel>
                <Select
                  value={itemForm.condition}
                  onChange={(e) => setItemForm({...itemForm, condition: e.target.value})}
                >
                  {conditions.map(cond => (
                    <MenuItem key={cond} value={cond}>{cond}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Color"
                value={itemForm.color}
                onChange={(e) => setItemForm({...itemForm, color: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Points Value"
                type="number"
                value={itemForm.pointsValue}
                onChange={(e) => setItemForm({...itemForm, pointsValue: parseInt(e.target.value)})}
                inputProps={{ min: 1, max: 100 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                value={itemForm.tags}
                onChange={(e) => setItemForm({...itemForm, tags: e.target.value})}
                placeholder="vintage, summer, casual"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setItemDialog(false)}>Cancel</Button>
          <Button onClick={handleItemSave} variant="contained">
            {selectedItem ? 'Update' : 'Add'} Item
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({...snackbar, open: false})}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Swap Details Dialog */}
      <Dialog open={swapDialog} onClose={() => setSwapDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SwapHoriz />
            Swap Details
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedSwap && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Swap Overview */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip 
                      label={selectedSwap.status} 
                      color={getSwapStatusColor(selectedSwap.status)}
                      icon={getSwapStatusIcon(selectedSwap.status)}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Created: {new Date(selectedSwap.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6">
                      {selectedSwap.requesterItemId.title}
                    </Typography>
                    <SwapHoriz />
                    <Typography variant="h6">
                      {selectedSwap.ownerItemId.title}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* Your Item */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Your Item
                </Typography>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={selectedSwap.requesterItemId.images?.[0] || 'https://via.placeholder.com/300x200/e0e0e0/757575?text=No+Image'}
                    alt={selectedSwap.requesterItemId.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {selectedSwap.requesterItemId.title}
                    </Typography>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      {selectedSwap.requesterItemId.pointsValue} Points
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Their Item */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Their Item
                </Typography>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={selectedSwap.ownerItemId.images?.[0] || 'https://via.placeholder.com/300x200/e0e0e0/757575?text=No+Image'}
                    alt={selectedSwap.ownerItemId.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {selectedSwap.ownerItemId.title}
                    </Typography>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      {selectedSwap.ownerItemId.pointsValue} Points
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Swap Partner */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Swap Partner
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {selectedSwap.requesterId.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedSwap.requesterId.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Community Member
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Swap Actions */}
              {selectedSwap.status === 'pending' && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Actions
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => handleSwapAction(selectedSwap._id, 'accept')}
                    >
                      Accept Swap
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={() => handleSwapAction(selectedSwap._id, 'decline')}
                    >
                      Decline Swap
                    </Button>
                  </Box>
                </Grid>
              )}

              {selectedSwap.status === 'accepted' && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Next Steps
                  </Typography>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    This swap has been accepted! Contact your swap partner to arrange the exchange.
                  </Alert>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={() => handleSwapAction(selectedSwap._id, 'complete')}
                  >
                    Mark as Completed
                  </Button>
                </Grid>
              )}

              {selectedSwap.status === 'completed' && selectedSwap.rating && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Rating
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">Your Rating:</Typography>
                    <Box sx={{ display: 'flex' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          sx={{ 
                            color: i < (selectedSwap.rating?.requesterRating || 0) ? 'warning.main' : 'grey.300',
                            fontSize: 20
                          }} 
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSwapDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
