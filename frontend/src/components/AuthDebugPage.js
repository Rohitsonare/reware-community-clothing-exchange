import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Box, Typography, Button, Paper, Container } from '@mui/material';

const AuthDebugPage = () => {
  const { user, token, loading, login, logout } = useAuth();

  const handleTestLogin = async () => {
    console.log('Testing login...');
    const result = await login('test@example.com', 'password123');
    console.log('Login result:', result);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Authentication Debug
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Authentication State:</Typography>
          <Typography>Loading: {loading ? 'true' : 'false'}</Typography>
          <Typography>User: {user ? JSON.stringify(user, null, 2) : 'null'}</Typography>
          <Typography>Token: {token ? token.substring(0, 20) + '...' : 'null'}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">LocalStorage:</Typography>
          <Typography>Token: {localStorage.getItem('token') ? localStorage.getItem('token').substring(0, 20) + '...' : 'null'}</Typography>
          <Typography>User: {localStorage.getItem('user') || 'null'}</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={handleTestLogin}>
            Test Login
          </Button>
          <Button variant="outlined" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthDebugPage;
