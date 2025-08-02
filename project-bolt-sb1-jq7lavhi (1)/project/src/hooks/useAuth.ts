import { useState, useEffect } from 'react';
import { User } from '../types';

// Mock user data - in production this would connect to your auth system
const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  plan: 'free',
  generationsUsed: 1,
  generationsLimit: 3,
  createdAt: new Date().toISOString(),
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 1000);
  }, []);

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const canGenerate = () => {
    if (!user) return false;
    if (user.plan === 'pro') return true;
    return user.generationsUsed < user.generationsLimit;
  };

  return {
    user,
    loading,
    updateUser,
    canGenerate,
  };
};