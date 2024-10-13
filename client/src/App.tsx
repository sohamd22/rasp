import { Routes, Route, Navigate } from 'react-router-dom';
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';
import { useEffect, useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/auth/check', { withCredentials: true });
        setIsAuthenticated(response.data.authenticated);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path='/signin' element={isAuthenticated ? <Navigate to="/" /> : <Signin />} />
      <Route path='/' element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" />} />
      <Route path='*' element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
