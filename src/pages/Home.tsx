/**
 * Main application component managing all pages and navigation
 */

import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import Layout from '../components/Layout';
import LandingPage from '../components/LandingPage';
import AuthPage from '../components/AuthPages';
import Dashboard from '../components/Dashboard';
import BrowseItems from '../components/BrowseItems';
import ItemDetail from '../components/ItemDetail';
import AddItem from '../components/AddItem';
import AdminPanel from '../components/AdminPanel';

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(isAuthenticated ? 'dashboard' : 'landing');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleNavigate = (page: string, itemId?: string) => {
    setCurrentPage(page);
    if (itemId) {
      setSelectedItemId(itemId);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'login':
        return <AuthPage type="login" onNavigate={handleNavigate} />;
      case 'signup':
        return <AuthPage type="signup" onNavigate={handleNavigate} />;
      case 'dashboard':
        return isAuthenticated ? <Dashboard onNavigate={handleNavigate} /> : <LandingPage onNavigate={handleNavigate} />;
      case 'browse':
        return <BrowseItems onNavigate={handleNavigate} />;
      case 'item-detail':
        return selectedItemId ? <ItemDetail itemId={selectedItemId} onNavigate={handleNavigate} /> : <BrowseItems onNavigate={handleNavigate} />;
      case 'add-item':
        return isAuthenticated ? <AddItem onNavigate={handleNavigate} /> : <AuthPage type="login" onNavigate={handleNavigate} />;
      case 'admin':
        return isAuthenticated ? <AdminPanel onNavigate={handleNavigate} /> : <AuthPage type="login" onNavigate={handleNavigate} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderCurrentPage()}
    </Layout>
  );
}
