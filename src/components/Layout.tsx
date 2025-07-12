/**
 * Main layout component with navigation and theming
 */

import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/button';
import { LogOut, User, Plus, Home, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    onNavigate('landing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'landing')}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                ReWear
              </span>
            </div>

            {/* Navigation Links */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-6">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    currentPage === 'dashboard' 
                      ? 'bg-purple-500/20 text-purple-400' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Home size={18} />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => onNavigate('browse')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    currentPage === 'browse' 
                      ? 'bg-purple-500/20 text-purple-400' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>Browse Items</span>
                </button>
                <button
                  onClick={() => onNavigate('add-item')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    currentPage === 'add-item' 
                      ? 'bg-purple-500/20 text-purple-400' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Plus size={18} />
                  <span>List Item</span>
                </button>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      currentPage === 'admin' 
                        ? 'bg-purple-500/20 text-purple-400' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Settings size={18} />
                    <span>Admin</span>
                  </button>
                )}
              </div>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="hidden sm:flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{user?.name}</p>
                      <p className="text-xs text-purple-400">{user?.points} points</p>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="border-slate-700 hover:border-slate-600"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => onNavigate('login')}
                    variant="outline"
                    size="sm"
                    className="border-slate-700 hover:border-slate-600"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => onNavigate('signup')}
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
