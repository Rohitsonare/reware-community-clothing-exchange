import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Button,
  Chip,
  CardActions,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  LocationOn,
  Visibility,
  SwapHoriz,
  Checkroom,
} from '@mui/icons-material';

const ItemCard = ({ item, user, onLikeToggle, onSwapRequest, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const isLiked = item.likes?.includes(user?.id);

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Excellent':
        return 'success';
      case 'Good':
        return 'primary';
      case 'Fair':
        return 'warning';
      case 'Poor':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={() => onClick(item)}
    >
      <Box sx={{ position: 'relative', height: 260, overflow: 'hidden' }}>
        {/* Image Loading Skeleton */}
        {imageLoading && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.100',
              zIndex: 1,
            }}
          >
            <CircularProgress size={24} />
          </Box>
        )}

        {/* Main Image */}
        {!imageError && item.images && item.images.length > 0 ? (
          <CardMedia
            component="img"
            height="260"
            image={item.images[0]}
            alt={item.title}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
            onLoad={() => setImageLoading(false)}
            sx={{
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
        ) : (
          <Box
            sx={{
              height: '100%',
              bgcolor: 'grey.100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Checkroom sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No Image
            </Typography>
          </Box>
        )}

        {/* Overlay Gradient */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)',
            pointerEvents: 'none',
          }}
        />

        {/* Top Actions */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            zIndex: 2,
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => onLikeToggle(item._id, e)}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              '&:hover': { bgcolor: 'white' },
            }}
          >
            {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
          <Chip
            label={`${item.pointsValue} pts`}
            size="small"
            color="primary"
            sx={{
              fontWeight: 'bold',
              boxShadow: 2,
            }}
          />
        </Box>

        {/* Bottom Status */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            zIndex: 2,
          }}
        >
          <Chip
            label={item.condition}
            size="small"
            color={getConditionColor(item.condition)}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(4px)' }}
          />
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 2.5, pb: 1 }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}
        >
          <Typography variant="h6" noWrap sx={{ maxWidth: '70%', fontWeight: 700 }}>
            {item.title}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
          <Chip
            label={item.size}
            size="small"
            variant="outlined"
            sx={{ borderRadius: 1, height: 24 }}
          />
          <Chip
            label={item.category}
            size="small"
            variant="outlined"
            sx={{ borderRadius: 1, height: 24 }}
          />
          {item.brand && (
            <Chip
              label={item.brand}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 1, height: 24 }}
            />
          )}
        </Box>

        {/* User & Location */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }} src={item.userId?.avatar}>
              {item.userId?.name?.charAt(0)}
            </Avatar>
            <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 100 }}>
              {item.userId?.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {item.location?.city}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          color={item.isAvailable ? 'primary' : 'inherit'}
          startIcon={<SwapHoriz />}
          onClick={(e) => {
            e.stopPropagation();
            onSwapRequest(item);
          }}
          disabled={!item.isAvailable}
        >
          {item.isAvailable ? 'Request Swap' : 'Unavailable'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ItemCard;
