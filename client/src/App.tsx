import { Routes, Route, Navigate } from 'react-router-dom';
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useUserStore from './stores/userStore';
import useSocketStore from './stores/socketStore';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const setUser = useUserStore(state => state.setUser);
  const { socket, connectSocket, disconnectSocket } = useSocketStore(state => state);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/check', { withCredentials: true });
        setIsAuthenticated(response.data.authenticated);

        if (response.data.authenticated) {
          const userResponse = await axios.get('/api/auth/user', { withCredentials: true });
          setUser(userResponse.data.user);
          connectSocket(userResponse.data.user._id);
        }
        else {
          disconnectSocket();
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        disconnectSocket();
      }
    };
    checkAuth();

    return () => {
      disconnectSocket();
    };
  }, [setUser, connectSocket, disconnectSocket]);

  useEffect(() => {
    socket?.on('connect', () => {
      console.log('Connected to the server');
    });

    socket?.on('message', (data) => {
      console.log(data);
    });

    return () => {
      socket?.off('message');
    };
  }, [socket]);

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
