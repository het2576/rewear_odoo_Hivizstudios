/**
 * Items and swap management store
 */

import { create } from 'zustand';
import { ClothingItem, SwapRequest } from '../types';

interface ItemStore {
  items: ClothingItem[];
  swapRequests: SwapRequest[];
  addItem: (item: Omit<ClothingItem, 'id' | 'createdAt'>) => void;
  updateItemStatus: (itemId: string, status: ClothingItem['status']) => void;
  createSwapRequest: (request: Omit<SwapRequest, 'id' | 'createdAt'>) => void;
  updateSwapRequest: (requestId: string, status: SwapRequest['status']) => void;
  removeItem: (itemId: string) => void;
}

// Mock data
const mockItems: ClothingItem[] = [
  {
    id: '1',
    title: 'Vintage Denim Jacket',
    description: 'Classic 90s denim jacket in excellent condition. Perfect for layering.',
    category: 'Jackets',
    type: 'Casual',
    size: 'M',
    condition: 'good',
    tags: ['vintage', 'denim', 'casual'],
    images: ['https://pub-cdn.sider.ai/u/U0O9H2OZ609/web-coder/68720b70711d0815fd240baf/resource/e562a50e-de3b-4ed8-832f-2673bcb375cf.jpg'],
    uploaderId: '2',
    uploaderName: 'Hivizstudios',
    pointsRequired: 150,
    status: 'available',
    createdAt: new Date('2024-03-01'),
    featured: true
  },
  {
    id: '2',
    title: 'Designer Evening Dress',
    description: 'Elegant black evening dress, worn once to a gala. Size 8.',
    category: 'Dresses',
    type: 'Formal',
    size: 'S',
    condition: 'like-new',
    tags: ['designer', 'formal', 'elegant'],
    images: ['https://pub-cdn.sider.ai/u/U0O9H2OZ609/web-coder/68720b70711d0815fd240baf/resource/04477937-c7dd-4211-9fcd-ad35d43b65eb.jpg'],
    uploaderId: '2',
    uploaderName: 'Hivizstudios',
    pointsRequired: 300,
    status: 'available',
    createdAt: new Date('2024-03-02'),
    featured: true
  },
  {
    id: '3',
    title: 'Cozy Winter Sweater',
    description: 'Warm wool sweater, perfect for cold weather. Barely worn.',
    category: 'Sweaters',
    type: 'Casual',
    size: 'L',
    condition: 'new',
    tags: ['wool', 'winter', 'cozy'],
    images: ['https://pub-cdn.sider.ai/u/U0O9H2OZ609/web-coder/68720b70711d0815fd240baf/resource/84c57b8d-1cd0-4c53-9806-3e4f4f9784c0.jpg'],
    uploaderId: '2',
    uploaderName: 'Hivizstudios',
    pointsRequired: 120,
    status: 'available',
    createdAt: new Date('2024-03-03'),
    featured: true
  }
];

export const useItemStore = create<ItemStore>((set, get) => ({
  items: mockItems,
  swapRequests: [],

  addItem: (itemData) => {
    const newItem: ClothingItem = {
      ...itemData,
      id: Date.now().toString(),
      createdAt: new Date(),
      status: 'under-review' // Items need admin approval
    };

    set(state => ({
      items: [newItem, ...state.items]
    }));
  },

  updateItemStatus: (itemId, status) => {
    set(state => ({
      items: state.items.map(item =>
        item.id === itemId ? { ...item, status } : item
      )
    }));
  },

  createSwapRequest: (requestData) => {
    const newRequest: SwapRequest = {
      ...requestData,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    set(state => ({
      swapRequests: [newRequest, ...state.swapRequests]
    }));
  },

  updateSwapRequest: (requestId, status) => {
    set(state => ({
      swapRequests: state.swapRequests.map(request =>
        request.id === requestId ? { ...request, status } : request
      )
    }));
  },

  removeItem: (itemId) => {
    set(state => ({
      items: state.items.filter(item => item.id !== itemId)
    }));
  }
}));
