/**
 * Admin panel for moderating items and managing platform
 */

import React, { useState } from 'react';
import { useItemStore } from '../store/itemStore';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CheckCircle, XCircle, Eye, Trash2, Users, Package, AlertTriangle } from 'lucide-react';

interface AdminPanelProps {
  onNavigate: (page: string, itemId?: string) => void;
}

export default function AdminPanel({ onNavigate }: AdminPanelProps) {
  const { items, updateItemStatus, removeItem } = useItemStore();
  const { user } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState('pending');

  if (!user || user.role !== 'admin') {
    onNavigate('dashboard');
    return null;
  }

  const pendingItems = items.filter(item => item.status === 'under-review');
  const allItems = items;
  const reportedItems = items.filter(item => item.status === 'reported'); // Mock reported items

  const handleApproveItem = (itemId: string) => {
    updateItemStatus(itemId, 'available');
  };

  const handleRejectItem = (itemId: string) => {
    updateItemStatus(itemId, 'rejected');
  };

  const handleRemoveItem = (itemId: string) => {
    if (confirm('Are you sure you want to permanently remove this item?')) {
      removeItem(itemId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/20 text-green-400';
      case 'under-review': return 'bg-yellow-500/20 text-yellow-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      case 'pending': return 'bg-blue-500/20 text-blue-400';
      case 'swapped': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const AdminStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-yellow-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{pendingItems.length}</p>
              <p className="text-sm text-slate-400">Pending Review</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Package className="text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{allItems.length}</p>
              <p className="text-sm text-slate-400">Total Items</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Users className="text-green-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {items.filter(item => item.status === 'available').length}
              </p>
              <p className="text-sm text-slate-400">Active Listings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ItemCard = ({ item, showActions = true }: { item: any; showActions?: boolean }) => (
    <Card className="bg-slate-900/50 border-slate-700">
      <div className="p-4">
        <div className="flex space-x-4">
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-white">{item.title}</h3>
              <Badge className={`${getStatusColor(item.status)} border-0`}>
                {item.status}
              </Badge>
            </div>
            <p className="text-sm text-slate-400 line-clamp-2">{item.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">by {item.uploaderName}</span>
              <span className="text-purple-400">{item.pointsRequired} pts</span>
            </div>
            <div className="text-xs text-slate-600">
              Listed: {new Date(item.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {showActions && (
          <div className="flex space-x-2 mt-4">
            <Button
              onClick={() => onNavigate('item-detail', item.id)}
              variant="outline"
              size="sm"
              className="border-slate-700"
            >
              <Eye size={16} className="mr-1" />
              View
            </Button>
            
            {item.status === 'under-review' && (
              <>
                <Button
                  onClick={() => handleApproveItem(item.id)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle size={16} className="mr-1" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleRejectItem(item.id)}
                  size="sm"
                  variant="destructive"
                >
                  <XCircle size={16} className="mr-1" />
                  Reject
                </Button>
              </>
            )}
            
            <Button
              onClick={() => handleRemoveItem(item.id)}
              size="sm"
              variant="destructive"
            >
              <Trash2 size={16} className="mr-1" />
              Remove
            </Button>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
        <p className="text-slate-400">Manage items and moderate platform content</p>
      </div>

      {/* Stats */}
      <AdminStats />

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="pending" className="data-[state=active]:bg-slate-700">
            Pending Review ({pendingItems.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-slate-700">
            All Items ({allItems.length})
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-slate-700">
            Reports (0)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Items Pending Review</CardTitle>
              <CardDescription>
                Review and approve/reject items submitted by users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingItems.length === 0 ? (
                <div className="text-center py-8 space-y-4">
                  <CheckCircle className="mx-auto text-slate-600" size={48} />
                  <div>
                    <p className="text-slate-400">No items pending review</p>
                    <p className="text-sm text-slate-500">All caught up!</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingItems.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">All Items</CardTitle>
              <CardDescription>
                View and manage all items on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allItems.map((item) => (
                  <ItemCard key={item.id} item={item} showActions={false} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Reported Items</CardTitle>
              <CardDescription>
                Handle user reports and complaints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 space-y-4">
                <AlertTriangle className="mx-auto text-slate-600" size={48} />
                <div>
                  <p className="text-slate-400">No reports at the moment</p>
                  <p className="text-sm text-slate-500">The community is behaving well!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
