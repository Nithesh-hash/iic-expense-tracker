import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const SESSION_KEY = 'iic_tracker_auth_session';

const VALID_USERNAMES = ['iic-vit', 'iic-vit@vit.ac.in'];
const VALID_PASSWORD = 'IICVIT2025';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session on mount
    try {
      const stored = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.authenticated) {
          setUser(parsed.user);
        }
      }
    } catch (err) {
      console.error('Failed to parse auth session:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (usernameInput, passwordInput, rememberMe = true) => {
    const cleanedUser = (usernameInput || '').trim().toLowerCase();
    const cleanedPass = (passwordInput || '').trim();

    if (VALID_USERNAMES.includes(cleanedUser) && cleanedPass === VALID_PASSWORD) {
      const userData = {
        id: 'vit-iic-admin',
        username: 'IIC-VIT',
        email: 'iic-vit@vit.ac.in',
        name: 'IIC Council Admin',
        role: 'Chief Innovation Officer & Finance Convener',
        campus: 'Vellore Institute of Technology, Vellore',
        councilRating: '★★★★★ 5-Star Ranked IIC',
        loginTime: new Date().toISOString(),
      };

      const sessionPayload = {
        authenticated: true,
        user: userData,
        token: `iic_jwt_sim_${Date.now()}`,
      };

      if (rememberMe) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionPayload));
      } else {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionPayload));
      }

      setUser(userData);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid Credentials. Use IIC-VIT (or iic-vit@vit.ac.in) and password IICVIT2025.',
    };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(user),
        user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

