import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Divider,
  Rating,
  ImageList,
  ImageListItem,
  AppBar,
  Toolbar,
  Skeleton,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge
} from '@mui/material';
import {
  ArrowBack,
  Favorite,
  FavoriteBorder,
  Share,
  SwapHoriz,
  LocationOn,
  Star,
  Visibility,
  Message,
  Report,
  Close,
  PhotoCamera,
  ZoomIn,
  NavigateNext,
  NavigateBefore,
  Person,
  CheckCircle,
  Schedule,
  LocalOffer
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/apiService';

const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [similarItems, setSimilarItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [swapDialogOpen, setSwapDialogOpen] = useState(false);
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      const data = await ApiService.get(`/api/items/${id}`);
      setItem(data.item);
      setSimilarItems(data.similarItems || []);
      setLiked(data.item.likes.includes(user?.id));
    } catch (error) {
      console.error('Error fetching item details:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!user) {
      showSnackbar('Please sign in to like items', 'warning');
      return;
    }

    try {
      const data = await ApiService.post(`/api/items/${id}/like`, { userId: user.id });
      
      setLiked(data.isLiked);
      setItem(prev => ({
        ...prev,
        likes: data.isLiked 
          ? [...prev.likes, user.id]
          : prev.likes.filter(id => id !== user.id)
      }));
      showSnackbar(data.message, 'success');
    } catch (error) {
      console.error('Error toggling like:', error);
      showSnackbar('Failed to update like', 'error');
    }
  };

  const handleSwapRequest = () => {
    if (!user) {
      showSnackbar('Please sign in to request swaps', 'warning');
      return;
    }
    
    if (item.userId._id === user.id) {
      showSnackbar('You cannot swap with yourself', 'warning');
      return;
    }

    if (!item.isAvailable) {
      showSnackbar('This item is not available for swap', 'warning');
      return;
    }

    setSwapDialogOpen(true);
  };

  const handleRedeemViaPoints = () => {
    if (!user) {
      showSnackbar('Please sign in to redeem items', 'warning');
      return;
    }
    
    if (item.userId._id === user.id) {
      showSnackbar('You cannot redeem your own item', 'warning');
      return;
    }

    if (!item.isAvailable) {
      showSnackbar('This item is not available for redemption', 'warning');
      return;
    }

    // Check if user has enough points
    if (user.points < item.pointsValue) {
      showSnackbar(`You need ${item.pointsValue - user.points} more points to redeem this item`, 'warning');
      return;
    }

    setRedeemDialogOpen(true);
  };

  const handleRedeemConfirm = async () => {
    try {
      const data = await ApiService.post(`/api/items/${id}/redeem`, { 
        userId: user.id 
      });
      
      showSnackbar(data.message, 'success');
      setRedeemDialogOpen(false);
      
      // Update item availability
      setItem(prev => ({
        ...prev,
        isAvailable: false
      }));
      
    } catch (error) {
      console.error('Error redeeming item:', error);
      showSnackbar(error.response?.data?.message || 'Failed to redeem item', 'error');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      showSnackbar('Link copied to clipboard', 'success');
    }
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

  const renderImageGallery = () => {
    if (!item?.images || item.images.length === 0) {
      return (
        <Card sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
            <PhotoCamera sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h6">No images available</Typography>
          </Box>
        </Card>
      );
    }

    return (
      <Box>
        <Card 
          sx={{ 
            mb: 2, 
            cursor: 'pointer',
            position: 'relative',
            '&:hover .zoom-icon': {
              opacity: 1
            }
          }}
          onClick={() => setImageDialogOpen(true)}
        >
          <CardMedia
            component="img"
            height="400"
            image={item.images[selectedImageIndex]}
            alt={item.title}
            sx={{ objectFit: 'cover' }}
          />
          <IconButton
            className="zoom-icon"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              opacity: 0,
              transition: 'opacity 0.3s'
            }}
          >
            <ZoomIn />
          </IconButton>
        </Card>

        {item.images.length > 1 && (
          <ImageList cols={4} gap={8}>
            {item.images.map((image, index) => (
              <ImageListItem
                key={index}
                sx={{
                  cursor: 'pointer',
                  border: selectedImageIndex === index ? '2px solid' : '1px solid',
                  borderColor: selectedImageIndex === index ? 'primary.main' : 'grey.300',
                  borderRadius: 1,
                  overflow: 'hidden'
                }}
                onClick={() => setSelectedImageIndex(index)}
              >
                <img
                  src={image}
                  alt={`${item.title} ${index + 1}`}
                  style={{ 
                    width: '100%', 
                    height: '80px', 
                    objectFit: 'cover' 
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </Box>
    );
  };

  const renderSimilarItems = () => {
    if (!similarItems || similarItems.length === 0) return null;

    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Similar Items
        </Typography>
        <Grid container spacing={2}>
          {similarItems.map((similarItem) => (
            <Grid item xs={12} sm={6} md={3} key={similarItem._id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  },
                  transition: 'all 0.3s'
                }}
                onClick={() => navigate(`/item/${similarItem._id}`)}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={similarItem.images?.[0] || 'https://via.placeholder.com/300x160'}
                  alt={similarItem.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" noWrap>
                    {similarItem.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {similarItem.pointsValue} points
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton color="inherit" onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Item Details
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={400} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" height={40} />
              <Skeleton variant="text" height={20} />
              <Skeleton variant="text" height={20} />
              <Box sx={{ mt: 2 }}>
                <Skeleton variant="rectangular" height={60} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton color="inherit" onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Item Details
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {item?.title}
          </Typography>
          <IconButton color="inherit" onClick={handleShare}>
            <Share />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Images */}
          <Grid item xs={12} md={6}>
            {renderImageGallery()}
          </Grid>

          {/* Item Details */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'sticky', top: 20 }}>
              <Typography variant="h4" gutterBottom>
                {item?.title}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip
                  label={`${item?.pointsValue} Points`}
                  color="success"
                  size="large"
                  icon={<LocalOffer />}
                />
                <Chip
                  label={item?.condition}
                  color={getConditionColor(item?.condition)}
                  size="large"
                />
                <Chip
                  label={item?.category}
                  variant="outlined"
                  size="large"
                />
                <Chip
                  label={`Size ${item?.size}`}
                  variant="outlined"
                  size="large"
                />
              </Box>

              <Typography variant="body1" paragraph>
                {item?.description}
              </Typography>

              <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Item Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Brand
                    </Typography>
                    <Typography variant="body1">
                      {item?.brand || 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Color
                    </Typography>
                    <Typography variant="body1">
                      {item?.color}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Views
                    </Typography>
                    <Typography variant="body1">
                      {item?.views} views
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Likes
                    </Typography>
                    <Typography variant="body1">
                      {item?.likes?.length || 0} likes
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Owner Info */}
              <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Owner Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={item?.userId?.avatar}
                    sx={{ width: 56, height: 56 }}
                  >
                    {item?.userId?.name?.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">
                      {item?.userId?.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn sx={{ fontSize: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        {item?.location?.city}, {item?.location?.state}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Rating
                        value={item?.userId?.stats?.rating || 5}
                        readOnly
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({item?.userId?.stats?.totalSwaps || 0} swaps)
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>

              {/* Tags */}
              {item?.tags && item.tags.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {item.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/browse?search=${tag}`)}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SwapHoriz />}
                  onClick={handleSwapRequest}
                  disabled={item?.userId?._id === user?.id || !item?.isAvailable}
                  sx={{ flex: 1 }}
                >
                  Request Swap
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<LocalOffer />}
                  onClick={handleRedeemViaPoints}
                  disabled={item?.userId?._id === user?.id || !item?.isAvailable}
                  sx={{ flex: 1 }}
                >
                  Redeem ({item?.pointsValue} pts)
                </Button>
                <IconButton
                  size="large"
                  onClick={handleLikeToggle}
                  sx={{ 
                    bgcolor: liked ? 'error.light' : 'action.hover',
                    '&:hover': { bgcolor: liked ? 'error.main' : 'action.selected' }
                  }}
                >
                  {liked ? <Favorite color="error" /> : <FavoriteBorder />}
                </IconButton>
              </Box>

              {/* Status */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {item?.isAvailable ? (
                  <>
                    <CheckCircle color="success" />
                    <Typography variant="body2" color="success.main">
                      Available for swap
                    </Typography>
                  </>
                ) : (
                  <>
                    <Schedule color="warning" />
                    <Typography variant="body2" color="warning.main">
                      Currently unavailable
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Similar Items */}
        {renderSimilarItems()}
      </Container>

      {/* Image Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              {item?.title} - Image {selectedImageIndex + 1} of {item?.images?.length}
            </Typography>
            <IconButton onClick={() => setImageDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'relative' }}>
            <img
              src={item?.images?.[selectedImageIndex]}
              alt={item?.title}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            {item?.images?.length > 1 && (
              <>
                <IconButton
                  sx={{
                    position: 'absolute',
                    left: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' }
                  }}
                  onClick={() => setSelectedImageIndex(prev => 
                    prev === 0 ? item.images.length - 1 : prev - 1
                  )}
                >
                  <NavigateBefore />
                </IconButton>
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' }
                  }}
                  onClick={() => setSelectedImageIndex(prev => 
                    prev === item.images.length - 1 ? 0 : prev + 1
                  )}
                >
                  <NavigateNext />
                </IconButton>
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Swap Dialog */}
      <Dialog
        open={swapDialogOpen}
        onClose={() => setSwapDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Request Swap</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to request a swap for "{item?.title}"?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You will be redirected to select your items for the swap.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSwapDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setSwapDialogOpen(false);
              navigate(`/swap-request/${item._id}`);
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Redeem Dialog */}
      <Dialog
        open={redeemDialogOpen}
        onClose={() => setRedeemDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Redeem Item</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to redeem "{item?.title}" for {item?.pointsValue} points?
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            This action cannot be undone. Your points will be deducted and the item will be reserved for you.
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="body2">
              <strong>Your current points:</strong> {user?.points || 0}
            </Typography>
            <Typography variant="body2">
              <strong>Item cost:</strong> {item?.pointsValue} points
            </Typography>
            <Typography variant="body2">
              <strong>Points after redemption:</strong> {(user?.points || 0) - (item?.pointsValue || 0)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRedeemDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleRedeemConfirm}
            disabled={!user || user.points < item?.pointsValue}
          >
            Redeem Now
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
};

export default ItemDetailPage;
