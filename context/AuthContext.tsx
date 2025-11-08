
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a user session from localStorage
    try {
      const storedUser = localStorage.getItem('freshTradeUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error)
        localStorage.removeItem('freshTradeUser');
    }
    setLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, pass: string): Promise<void> => {
    setLoading(true);
    // In a real app, you'd make an API call here.
    return new Promise(resolve => {
        setTimeout(() => {
            const mockUser: User = { name: 'Admin User', email: email };
            localStorage.setItem('freshTradeUser', JSON.stringify(mockUser));
            setUser(mockUser);
            setLoading(false);
            resolve();
        }, 1000);
    });
  };

  // Mock signup function
  const signup = async (name: string, email: string, pass: string): Promise<void> => {
    setLoading(true);
    // In a real app, you'd make an API call to register the user.
    return new Promise(resolve => {
        setTimeout(() => {
            const newUser: User = { name, email };
            localStorage.setItem('freshTradeUser', JSON.stringify(newUser));
            setUser(newUser);
            setLoading(false);
            resolve();
        }, 1000);
    });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('freshTradeUser');
    setUser(null);
  };

  const value = { user, loading, login, signup, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
