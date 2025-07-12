/**
 * Authentication state management using Zustand
 */

import { create } from 'zustand';
import { User, AuthState } from '../types';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updatePoints: (points: number) => void;
}

// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@rewear.com',
    name: 'Admin User',
    points: 1000,
    role: 'admin',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    email: 'user@rewear.com', 
    name: 'Hivizstudios',
    points: 250,
    role: 'user',
    createdAt: new Date('2024-02-01')
  }
];

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password') {
      set({ user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('rewear-user', JSON.stringify(user));
      return true;
    }
    
    set({ isLoading: false });
    return false;
  },

  signup: async (email: string, password: string, name: string) => {
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      set({ isLoading: false });
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      points: 100, // Welcome bonus
      role: 'user',
      createdAt: new Date()
    };

    mockUsers.push(newUser);
    set({ user: newUser, isAuthenticated: true, isLoading: false });
    localStorage.setItem('rewear-user', JSON.stringify(newUser));
    return true;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('rewear-user');
  },

  updatePoints: (points: number) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, points };
      set({ user: updatedUser });
      localStorage.setItem('rewear-user', JSON.stringify(updatedUser));
    }
  }
}));

// Initialize from localStorage
const storedUser = localStorage.getItem('rewear-user');
if (storedUser) {
  try {
    const user = JSON.parse(storedUser);
    useAuthStore.setState({ user, isAuthenticated: true });
  } catch (error) {
    localStorage.removeItem('rewear-user');
  }
}
