import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  LinearProgress,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  AppBar,
  Toolbar,
  Paper,
  Divider,
  Autocomplete
} from '@mui/material';
import {
  ArrowBack,
  CloudUpload,
  Delete,
  Add,
  PhotoCamera,
  Save,
  Preview
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/apiService';

const AddItemPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    size: '',
    condition: '',
    color: '',
    brand: '',
    pointsValue: '',
    tags: []
  });

  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [tagInput, setTagInput] = useState('');

  // Predefined options
  const categories = [
    'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Underwear', 'Swimwear', 'Activewear', 'Other'
  ];

  const conditions = [
    'Excellent', 'Good', 'Fair', 'Poor'
  ];

  const sizes = [
    'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
    '0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20',
    '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13', '14',
    '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
    'One Size'
  ];

  const popularTags = [
    'vintage', 'designer', 'casual', 'formal', 'trendy', 'classic', 'retro', 'bohemian', 'minimalist',
    'streetwear', 'luxury', 'sustainable', 'handmade', 'rare', 'limited edition', 'new with tags',
    'summer', 'winter', 'spring', 'fall', 'party', 'work', 'vacation', 'wedding'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + images.length > 5) {
      showSnackbar('Maximum 5 images allowed', 'warning');
      return;
    }

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages(prev => [...prev, e.target.result]);
          setImageFiles(prev => [...prev, file]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagSelect = (event, newValue) => {
    if (newValue && !formData.tags.includes(newValue)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newValue]
      }));
    }
  };

  const validateForm = () => {
    const requiredFields = ['title', 'description', 'category', 'size', 'condition', 'pointsValue'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      showSnackbar(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
      return false;
    }

    if (images.length === 0) {
      showSnackbar('Please add at least one image', 'error');
      return false;
    }

    if (formData.pointsValue <= 0) {
      showSnackbar('Points value must be greater than 0', 'error');
      return false;
    }

    return true;
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];

    setUploading(true);
    const uploadedUrls = [];

    try {
      for (const file of imageFiles) {
        const formData = new FormData();
        formData.append('image', file);

        // For now, we'll use placeholder URLs since we don't have a real image upload service
        // In a real app, you'd upload to a service like Cloudinary, AWS S3, etc.
        const placeholderUrl = `https://via.placeholder.com/400x400/f5f5f5/999?text=${encodeURIComponent(file.name)}`;
        uploadedUrls.push(placeholderUrl);
      }

      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      showSnackbar('Failed to upload images', 'error');
      return [];
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;

    if (!user) {
      showSnackbar('Please sign in to add items', 'error');
      return;
    }

    setLoading(true);

    try {
      // Upload images first
      const imageUrls = await uploadImages();
      
      // Create item data
      const itemData = {
        ...formData,
        images: imageUrls.length > 0 ? imageUrls : images, // Use uploaded URLs or base64 for demo
        userId: user.id,
        location: user.location || { city: 'Unknown', state: 'Unknown', country: 'USA' },
        views: 0,
        likes: [],
        isAvailable: true,
        pointsValue: parseInt(formData.pointsValue)
      };

      // Submit item to backend
      const response = await ApiService.post('/api/items', itemData);
      
      showSnackbar('Item added successfully!', 'success');
      
      // Redirect to item detail page after a short delay
      setTimeout(() => {
        navigate(`/item/${response.item._id}`);
      }, 1500);

    } catch (error) {
      console.error('Error adding item:', error);
      showSnackbar(error.response?.data?.message || 'Failed to add item', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handlePreview = () => {
    // Simple preview functionality - could be enhanced with a modal
    console.log('Preview item:', formData);
    showSnackbar('Preview feature coming soon!', 'info');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Add New Item
          </Typography>
          <Button color="inherit" onClick={handlePreview} startIcon={<Preview />}>
            Preview
          </Button>
        </Toolbar>
      </AppBar>

      {/* Loading bar */}
      {(loading || uploading) && (
        <LinearProgress sx={{ position: 'fixed', top: 64, left: 0, right: 0, zIndex: 1000 }} />
      )}

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Image Upload Section */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Images *
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Add up to 5 images of your item. First image will be the main photo.
                  </Typography>

                  {/* Image Upload Button */}
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    sx={{ mb: 2 }}
                    disabled={images.length >= 5}
                  >
                    Upload Images
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={handleImageUpload}
                    />
                  </Button>

                  {/* Image Preview */}
                  {images.length > 0 && (
                    <ImageList cols={3} gap={8}>
                      {images.map((image, index) => (
                        <ImageListItem key={index}>
                          <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            style={{
                              width: '100%',
                              height: 120,
                              objectFit: 'cover',
                              borderRadius: 8
                            }}
                          />
                          <ImageListItemBar
                            position="top"
                            sx={{
                              background: 'rgba(0, 0, 0, 0.7)',
                              borderRadius: '8px 8px 0 0'
                            }}
                            actionIcon={
                              <IconButton
                                sx={{ color: 'white' }}
                                onClick={() => removeImage(index)}
                              >
                                <Delete />
                              </IconButton>
                            }
                          />
                          {index === 0 && (
                            <Chip
                              label="Main"
                              size="small"
                              color="primary"
                              sx={{
                                position: 'absolute',
                                bottom: 4,
                                left: 4
                              }}
                            />
                          )}
                        </ImageListItem>
                      ))}
                    </ImageList>
                  )}

                  {images.length === 0 && (
                    <Paper
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        border: '2px dashed',
                        borderColor: 'grey.300',
                        bgcolor: 'grey.50'
                      }}
                    >
                      <PhotoCamera sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                      <Typography variant="body1" color="text.secondary">
                        No images uploaded yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Click "Upload Images" to add photos
                      </Typography>
                    </Paper>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Item Details Section */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Item Details
                  </Typography>

                  <Grid container spacing={2}>
                    {/* Title */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Title *"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="e.g., Vintage Denim Jacket"
                        required
                      />
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description *"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe your item in detail..."
                        multiline
                        rows={4}
                        required
                      />
                    </Grid>

                    {/* Category */}
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Category *</InputLabel>
                        <Select
                          value={formData.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          label="Category *"
                        >
                          {categories.map(category => (
                            <MenuItem key={category} value={category}>
                              {category}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Size */}
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Size *</InputLabel>
                        <Select
                          value={formData.size}
                          onChange={(e) => handleInputChange('size', e.target.value)}
                          label="Size *"
                        >
                          {sizes.map(size => (
                            <MenuItem key={size} value={size}>
                              {size}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Condition */}
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Condition *</InputLabel>
                        <Select
                          value={formData.condition}
                          onChange={(e) => handleInputChange('condition', e.target.value)}
                          label="Condition *"
                        >
                          {conditions.map(condition => (
                            <MenuItem key={condition} value={condition}>
                              {condition}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Points Value */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Points Value *"
                        type="number"
                        value={formData.pointsValue}
                        onChange={(e) => handleInputChange('pointsValue', e.target.value)}
                        placeholder="25"
                        required
                        inputProps={{ min: 1, max: 1000 }}
                      />
                    </Grid>

                    {/* Color */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Color"
                        value={formData.color}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        placeholder="e.g., Blue, Red, Multi-color"
                      />
                    </Grid>

                    {/* Brand */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Brand"
                        value={formData.brand}
                        onChange={(e) => handleInputChange('brand', e.target.value)}
                        placeholder="e.g., Nike, Zara, H&M"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Tags Section */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tags
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Add tags to help people find your item
                  </Typography>

                  {/* Tag Input */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Autocomplete
                      freeSolo
                      options={popularTags}
                      value={tagInput}
                      onChange={handleTagSelect}
                      onInputChange={(event, newValue) => setTagInput(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Add tags"
                          placeholder="e.g., vintage, casual, designer"
                          sx={{ flexGrow: 1 }}
                        />
                      )}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleTagAdd}
                      startIcon={<Add />}
                      disabled={!tagInput.trim()}
                    >
                      Add
                    </Button>
                  </Box>

                  {/* Selected Tags */}
                  {formData.tags.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          onDelete={() => handleTagRemove(tag)}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={loading || uploading}
                  size="large"
                >
                  {loading ? 'Adding Item...' : 'Add Item'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Container>

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

export default AddItemPage;
