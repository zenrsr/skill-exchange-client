import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AuthService, setAuthToken } from '../services/api.js';

const AuthContext = createContext();

const TOKEN_KEY = 'se-token';
const USER_KEY = 'se-user';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [initializing, setInitializing] = useState(true);

  const persistSession = (nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken);
      setAuthToken(nextToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setAuthToken(null);
    }

    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  };

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    persistSession(null, null);
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!token) {
      setInitializing(false);
      return;
    }

    try {
      const { data } = await AuthService.getMe();
      setUser(data);
      persistSession(token, data);
    } catch (error) {
      logout();
    } finally {
      setInitializing(false);
    }
  }, [token, logout]);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      fetchProfile();
    } else {
      setAuthToken(null);
      setInitializing(false);
    }
  }, [token, fetchProfile]);

  const login = async (credentials) => {
    const { data } = await AuthService.login(credentials);
    setToken(data.token);
    setUser(data.user);
    persistSession(data.token, data.user);
  };

  const register = async (payload) => {
    const { data } = await AuthService.register(payload);
    setToken(data.token);
    setUser(data.user);
    persistSession(data.token, data.user);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    initializing,
    login,
    register,
    logout,
    setUser,
    refreshUser: fetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
