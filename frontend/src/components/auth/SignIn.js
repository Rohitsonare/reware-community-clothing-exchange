import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Link,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Google,
  Apple,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import AuthService from '../../services/authService';

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First test API connection
      await AuthService.testConnection();
      
      // Then attempt sign in using AuthContext
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success(`Welcome back, ${result.user.name}!`);
        navigate('/dashboard');
      } else {
        setError(result.error || 'Sign in failed');
        toast.error('Sign in failed');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error.response?.data?.message || 'Failed to connect to the server. Please try again.');
      toast.error('Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSocialLoading('google');
    try {
      const response = await AuthService.googleSignIn();
      toast.success(`Welcome, ${response.user.name}!`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign in error:', error);
      if (error.response?.data?.message?.includes('not configured')) {
        setError('Social login is not configured on the server. Please contact support.');
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
      toast.error('Google sign in failed');
    } finally {
      setSocialLoading('');
    }
  };

  const handleAppleSignIn = async () => {
    setSocialLoading('apple');
    try {
      const response = await AuthService.appleSignIn();
      toast.success(`Welcome, ${response.user.name}!`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Apple sign in error:', error);
      if (error.response?.data?.message?.includes('not configured')) {
        setError('Social login is not configured on the server. Please contact support.');
      } else {
        setError('Failed to sign in with Apple. Please try again.');
      }
      toast.error('Apple sign in failed');
    } finally {
      setSocialLoading('');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <motion.div variants={cardVariants}>
            <Card
              elevation={8}
              sx={{
                padding: 4,
                width: '100%',
                maxWidth: 480,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                mb: 3,
              }}
            >
              <CardContent sx={{ textAlign: 'center', pb: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                  Welcome Back
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Sign in to your ReWear account
                </Typography>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Paper
              elevation={6}
              sx={{
                padding: 4,
                width: '100%',
                maxWidth: 480,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2,
                    '& .MuiAlert-message': { width: '100%' }
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* Social Login Buttons */}
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={socialLoading === 'google' ? <CircularProgress size={20} /> : <Google />}
                      onClick={handleGoogleSignIn}
                      disabled={socialLoading !== ''}
                      sx={{
                        height: 56,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        borderColor: '#db4437',
                        color: '#db4437',
                        '&:hover': {
                          borderColor: '#c23321',
                          backgroundColor: 'rgba(219, 68, 55, 0.04)',
                        },
                      }}
                    >
                      Google
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={socialLoading === 'apple' ? <CircularProgress size={20} /> : <Apple />}
                      onClick={handleAppleSignIn}
                      disabled={socialLoading !== ''}
                      sx={{
                        height: 56,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        borderColor: '#000',
                        color: '#000',
                        '&:hover': {
                          borderColor: '#333',
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      Apple
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="textSecondary">
                  Or continue with email
                </Typography>
              </Divider>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                  error={!!error}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      height: 56,
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!error}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      height: 56,
                    },
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading || socialLoading !== ''}
                  sx={{
                    mt: 3,
                    mb: 2,
                    height: 56,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={26} color="inherit" /> : 'Sign In'}
                </Button>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/signup')}
                    sx={{
                      textDecoration: 'none',
                      color: 'primary.main',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Don't have an account? Sign Up
                  </Link>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Box>
      </motion.div>
    </Container>
  );
};

export default SignIn;
