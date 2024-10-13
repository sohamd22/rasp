import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import useUserStore from './stores/userStore';
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setUser = useUserStore(state => state.setUser);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth/user`, { withCredentials: true });
        if (response.data.success) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" />;
};

const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setUser = useUserStore(state => state.setUser);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth/user`, { withCredentials: true });
        if (response.data.success) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Navigate to="/" /> : <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path='/signin' element={
        <PublicRoute>
          <Signin />
        </PublicRoute>
      } />
      <Route path='/' element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path='*' element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
