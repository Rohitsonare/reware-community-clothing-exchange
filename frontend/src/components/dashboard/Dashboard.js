import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get user from local storage first for quick UI rendering
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          setUser(storedUser);
        }
        
        // Then verify with server
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // If token is invalid, redirect to sign in
        AuthService.signout();
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSignOut = () => {
    AuthService.signout();
    navigate('/signin');
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to ReWear, {user?.name}!
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Your Profile</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography><strong>Email:</strong> {user?.email}</Typography>
            <Typography><strong>Points Balance:</strong> {user?.points} points</Typography>
          </Box>
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Community Clothing Exchange</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Coming soon! You'll be able to exchange clothing items with the community.
          </Typography>
        </Box>
        
        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Button variant="outlined" color="error" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Dashboard;
