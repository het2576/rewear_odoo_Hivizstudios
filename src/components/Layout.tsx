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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'landing')}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-primary-foreground font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
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
                      ? 'bg-primary/20 text-primary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Home size={18} />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => onNavigate('browse')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    currentPage === 'browse' 
                      ? 'bg-primary/20 text-primary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <span>Browse Items</span>
                </button>
                <button
                  onClick={() => onNavigate('add-item')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    currentPage === 'add-item' 
                      ? 'bg-primary/20 text-primary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
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
                        ? 'bg-primary/20 text-primary' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
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
                      <p className="text-sm font-medium text-foreground">{user?.name}</p>
                      <p className="text-xs text-primary">{user?.points} points</p>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-500 rounded-full flex items-center justify-center">
                      <User size={16} className="text-primary-foreground" />
                    </div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="border-border hover:border-primary/50"
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
                    className="border-border hover:border-primary/50"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => onNavigate('signup')}
                    size="sm"
                    className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90"
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
