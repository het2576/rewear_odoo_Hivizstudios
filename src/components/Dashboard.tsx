/**
 * User dashboard showing profile, points, items, and swap history
 */

import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useItemStore } from '../store/itemStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { User, Package, ArrowRightLeft, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string, itemId?: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuthStore();
  const { items, swapRequests } = useItemStore();

  if (!user) return null;

  const userItems = items.filter(item => item.uploaderId === user.id);
  const userSwapRequests = swapRequests.filter(
    request => request.fromUserId === user.id || request.toUserId === user.id
  );

  const stats = {
    totalItems: userItems.length,
    availableItems: userItems.filter(item => item.status === 'available').length,
    pendingSwaps: userSwapRequests.filter(request => request.status === 'pending').length,
    completedSwaps: userSwapRequests.filter(request => request.status === 'completed').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'under-review': return 'bg-blue-500/20 text-blue-400';
      case 'swapped': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getSwapStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="text-green-400" size={16} />;
      case 'rejected': return <XCircle className="text-red-400" size={16} />;
      case 'pending': return <Clock className="text-yellow-400" size={16} />;
      default: return <ArrowRightLeft className="text-blue-400" size={16} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Welcome back, {user.name}!</h1>
        <p className="text-slate-400">Manage your items and track your sustainable fashion journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <User className="text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{user.points}</p>
                <p className="text-sm text-slate-400">Available Points</p>
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
                <p className="text-2xl font-bold text-white">{stats.totalItems}</p>
                <p className="text-sm text-slate-400">Items Listed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock className="text-yellow-400" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.pendingSwaps}</p>
                <p className="text-sm text-slate-400">Pending Swaps</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-green-400" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.completedSwaps}</p>
                <p className="text-sm text-slate-400">Completed Swaps</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Items Section */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">My Items</CardTitle>
              <CardDescription>Items you've listed for swap</CardDescription>
            </div>
            <Button
              onClick={() => onNavigate('add-item')}
              className="bg-gradient-to-r from-purple-500 to-blue-500"
            >
              List New Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {userItems.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <Package className="mx-auto text-slate-600" size={48} />
              <div>
                <p className="text-slate-400">No items listed yet</p>
                <p className="text-sm text-slate-500">Start by listing your first item!</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userItems.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="group cursor-pointer"
                  onClick={() => onNavigate('item-detail', item.id)}
                >
                  <div className="relative overflow-hidden rounded-lg bg-slate-900/50 border border-slate-700 hover:border-slate-600 transition-colors">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className={`${getStatusColor(item.status)} border-0`}>
                        {item.status}
                      </Badge>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-400 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-purple-400 font-medium">{item.pointsRequired} pts</span>
                        <span className="text-xs text-slate-500">Size {item.size}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {userItems.length > 6 && (
            <div className="text-center mt-6">
              <Button
                variant="outline"
                onClick={() => onNavigate('browse')}
                className="border-slate-700"
              >
                View All My Items
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Swap Activity */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Swap Activity</CardTitle>
          <CardDescription>Your latest swap requests and transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {userSwapRequests.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <ArrowRightLeft className="mx-auto text-slate-600" size={48} />
              <div>
                <p className="text-slate-400">No swap activity yet</p>
                <p className="text-sm text-slate-500">Browse items to start swapping!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {userSwapRequests.slice(0, 5).map((request) => {
                const item = items.find(i => i.id === request.itemId);
                const isIncoming = request.toUserId === user.id;
                
                return (
                  <div
                    key={request.id}
                    className="flex items-center space-x-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                  >
                    <div className="flex-shrink-0">
                      {getSwapStatusIcon(request.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white">
                        {isIncoming ? 'Incoming' : 'Outgoing'} swap request
                      </p>
                      <p className="text-sm text-slate-400 truncate">
                        Item: {item?.title || 'Unknown item'}
                      </p>
                      {request.pointsOffered && (
                        <p className="text-sm text-purple-400">
                          Offered: {request.pointsOffered} points
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <Badge className={`${getStatusColor(request.status)} border-0`}>
                        {request.status}
                      </Badge>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
