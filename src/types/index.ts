/**
 * Core type definitions for the ReWear platform
 */

export interface User {
  id: string;
  email: string;
  name: string;
  points: number;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface ClothingItem {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  size: string;
  condition: 'new' | 'like-new' | 'good' | 'fair';
  tags: string[];
  images: string[];
  uploaderId: string;
  uploaderName: string;
  pointsRequired: number;
  status: 'available' | 'pending' | 'swapped' | 'under-review';
  createdAt: Date;
  featured?: boolean;
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  itemId: string;
  offeredItemId?: string;
  pointsOffered?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message?: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
