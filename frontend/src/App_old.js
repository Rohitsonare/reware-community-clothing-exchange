import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Dashboard from './components/dashboard/Dashboard';
import LandingPage from './components/LandingPage';
import BrowseItems from './components/BrowseItems';
import ItemListingPage from './components/ItemListingPage';
import ItemDetailPage from './components/ItemDetailPage';
import AddItemPage from './components/AddItemPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Green color for sustainability theme
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#757575',
      light: '#9E9E9E',
      dark: '#424242',
    },
    success: {
      main: '#4CAF50',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
    },
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// App routes component (needs to be inside AuthProvider)
const AppRoutes = () => {
  // Protected route component
  const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
      return <div>Loading...</div>; // Or a proper loading component
    }
    
    return user ? children : <Navigate to="/signin" />;
  };

  // Public route - redirects to dashboard if already authenticated
  const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
      return <div>Loading...</div>; // Or a proper loading component
    }
    
    return !user ? children : <Navigate to="/dashboard" />;
  };

  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Browse Items */}
      <Route path="/browse" element={<BrowseItems />} />
      <Route path="/items" element={<ItemListingPage />} />
      <Route path="/item/:id" element={<ItemDetailPage />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/add-item" 
        element={
          <PrivateRoute>
            <AddItemPage />
          </PrivateRoute>
        } 
      />
      
      {/* Public Routes */}
      <Route 
        path="/signin" 
        element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        } 
      />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Browse Items */}
            <Route path="/browse" element={<BrowseItems />} />
            <Route path="/items" element={<ItemListingPage />} />
            <Route path="/item/:id" element={<ItemDetailPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/add-item" 
              element={
                <PrivateRoute>
                  <AddItemPage />
                </PrivateRoute>
              } 
            />
            
            {/* Public Routes */}
            <Route 
              path="/signin" 
              element={
                <PublicRoute>
                  <SignIn />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              } 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ThemeProvider>
  );
}

export default App;
