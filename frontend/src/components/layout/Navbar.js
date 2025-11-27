import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Recycling,
  Home,
  Category,
  Login,
  PersonAdd,
  AccountCircle,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
    handleMenuClose();
  };

  const navItems = [
    { label: 'Home', icon: <Home />, path: '/' },
    { label: 'Browse', icon: <Category />, path: '/browse' },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}
      elevation={0}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <Recycling sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            ReWear
          </Typography>
        </Box>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  textTransform: 'none',
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Auth Buttons / User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user ? (
            <>
              {!isMobile && (
                <Button
                  onClick={() => navigate('/dashboard')}
                  sx={{ color: 'text.primary', textTransform: 'none', mr: 1 }}
                >
                  Dashboard
                </Button>
              )}
              <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar src={user.avatar} alt={user.name} sx={{ bgcolor: 'primary.main' }}>
                  {user.name?.charAt(0)}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem
                  onClick={() => {
                    navigate('/dashboard');
                    handleMenuClose();
                  }}
                >
                  Dashboard
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate('/profile');
                    handleMenuClose();
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : !isMobile ? (
            <>
              <Button
                variant="outlined"
                startIcon={<Login />}
                onClick={() => navigate('/signin')}
                sx={{ textTransform: 'none' }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => navigate('/signup')}
                sx={{ textTransform: 'none' }}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <IconButton onClick={handleMobileMenuOpen}>
              <MenuIcon />
            </IconButton>
          )}
        </Box>

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
        >
          {navItems.map((item) => (
            <MenuItem
              key={item.label}
              onClick={() => {
                navigate(item.path);
                handleMobileMenuClose();
              }}
            >
              {item.icon}
              <Typography sx={{ ml: 1 }}>{item.label}</Typography>
            </MenuItem>
          ))}
          {!user && (
            <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Login />}
                onClick={() => {
                  navigate('/signin');
                  handleMobileMenuClose();
                }}
              >
                Sign In
              </Button>
              <Button
                fullWidth
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => {
                  navigate('/signup');
                  handleMobileMenuClose();
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
