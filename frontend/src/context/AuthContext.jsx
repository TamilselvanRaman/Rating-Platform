import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/auth.service';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            setUser({ id: payload.id, role: payload.role });
        } catch (error) {
          console.error("Failed to parse token", error);
          authService.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    // Decode token to get user info immediately after login
    if (data.accessToken) {
        const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
        setUser({ id: payload.id, role: payload.role, ...data.user });
    } else {
        setUser(data.user);
    }
    return data.user;
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    setUser,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
