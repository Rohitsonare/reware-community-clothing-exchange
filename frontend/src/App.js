import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import theme from './theme';
import Layout from './components/layout/Layout';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Dashboard from './components/dashboard/Dashboard';
import LandingPage from './components/LandingPage';
import BrowseItems from './components/BrowseItems';
import ItemListingPage from './components/ItemListingPage';
import ItemDetailPage from './components/ItemDetailPage';
import AddItemPage from './components/AddItemPage';
import AuthDebugPage from './components/AuthDebugPage';

// App routes component (needs to be inside AuthProvider)
const AppRoutes = () => {
  // Protected route component
  const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return <Navigate to="/signin" />;
    }

    return children;
  };

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/browse" element={<ItemListingPage />} />
        <Route path="/item/:id" element={<ItemDetailPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-item"
          element={
            <ProtectedRoute>
              <AddItemPage />
            </ProtectedRoute>
          }
        />
        <Route path="/debug-auth" element={<AuthDebugPage />} />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <AppRoutes />
          <ToastContainer position="bottom-right" />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
