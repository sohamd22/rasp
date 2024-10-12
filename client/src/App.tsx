import { Routes, Route, Navigate } from 'react-router-dom';
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';
import React, { useState, useEffect } from 'react';
import useUserStore from './stores/userStore';

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user, fetchUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await fetchUser();
      setIsLoading(false);
    };

    checkAuth();
  }, [fetchUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? element : <Navigate to="/signin" />;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path='/signin' element={<Signin />} />
      <Route path='/' element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path='*' element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
