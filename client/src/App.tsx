import { Routes, Route, Navigate } from 'react-router-dom';
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useUserStore from './stores/userStore';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const setUser = useUserStore(state => state.setUser);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/auth/check', { withCredentials: true });
        setIsAuthenticated(response.data.authenticated);

        if (response.data.authenticated) {
          const userResponse = await axios.get('/auth/user', { withCredentials: true });
          setUser(userResponse.data.user);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [setUser]);

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
