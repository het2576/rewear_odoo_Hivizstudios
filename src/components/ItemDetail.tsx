/**
 * Item detail page with swap and redeem functionality
 */

import React, { useState } from 'react';
import { useItemStore } from '../store/itemStore';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Heart, Share2, User, Calendar, Tag, Package } from 'lucide-react';

interface ItemDetailProps {
  itemId: string;
  onNavigate: (page: string, itemId?: string) => void;
}

export default function ItemDetail({ itemId, onNavigate }: ItemDetailProps) {
  const { items, createSwapRequest } = useItemStore();
  const { user, updatePoints } = useAuthStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [swapMessage, setSwapMessage] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  const item = items.find(i => i.id === itemId);

  if (!item) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Item not found</p>
        <Button onClick={() => onNavigate('browse')} className="mt-4">
          Back to Browse
        </Button>
      </div>
    );
  }

  const canAfford = user && user.points >= item.pointsRequired;
  const isOwnItem = user && item.uploaderId === user.id;

  const handleSwapRequest = async () => {
    if (!user) {
      onNavigate('login');
      return;
    }

    setIsRequesting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    createSwapRequest({
      fromUserId: user.id,
      toUserId: item.uploaderId,
      itemId: item.id,
      status: 'pending',
      message: swapMessage
    });

    setIsRequesting(false);
    setSwapMessage('');
    
    // Show success message (in a real app, you'd use a toast notification)
    alert('Swap request sent successfully!');
  };

  const handleRedeemWithPoints = async () => {
    if (!user || !canAfford) return;

    setIsRequesting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Deduct points and create swap request
    updatePoints(user.points - item.pointsRequired);
    createSwapRequest({
      fromUserId: user.id,
      toUserId: item.uploaderId,
      itemId: item.id,
      pointsOffered: item.pointsRequired,
      status: 'pending'
    });

    setIsRequesting(false);
    
    // Show success message
    alert('Item redeemed successfully! The owner will be notified.');
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-500/20 text-green-400';
      case 'like-new': return 'bg-blue-500/20 text-blue-400';
      case 'good': return 'bg-yellow-500/20 text-yellow-400';
      case 'fair': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        onClick={() => onNavigate('browse')}
        variant="outline"
        className="border-slate-700 hover:border-slate-600"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Browse
      </Button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
            <div className="relative aspect-square">
              <img
                src={item.images[currentImageIndex]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className={`${getConditionColor(item.condition)} border-0`}>
                  {item.condition}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Thumbnail Images */}
          {item.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    currentImageIndex === index 
                      ? 'border-purple-400' 
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${item.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold text-white">{item.title}</h1>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-400">
                  <Heart size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-400">
                  <Share2 size={20} />
                </Button>
              </div>
            </div>

            <div className="text-2xl font-bold text-purple-400">
              {item.pointsRequired} points
            </div>

            <p className="text-slate-300 leading-relaxed">{item.description}</p>
          </div>

          {/* Item Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-slate-500 flex items-center">
                <Tag size={16} className="mr-2" />
                Category
              </p>
              <p className="text-white font-medium">{item.category}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-500 flex items-center">
                <Package size={16} className="mr-2" />
                Size
              </p>
              <p className="text-white font-medium">{item.size}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-500">Type</p>
              <p className="text-white font-medium">{item.type}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-500 flex items-center">
                <Calendar size={16} className="mr-2" />
                Listed
              </p>
              <p className="text-white font-medium">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <p className="text-sm text-slate-500">Tags</p>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Seller Info */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">{item.uploaderName}</p>
                  <p className="text-sm text-slate-400">Item owner</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {!isOwnItem && (
            <div className="space-y-4">
              {user ? (
                <>
                  <Button
                    onClick={handleRedeemWithPoints}
                    disabled={!canAfford || isRequesting}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50"
                  >
                    {isRequesting ? 'Processing...' : `Redeem with ${item.pointsRequired} Points`}
                  </Button>
                  
                  {!canAfford && (
                    <p className="text-sm text-red-400 text-center">
                      Insufficient points. You have {user.points} points.
                    </p>
                  )}

                  <Card className="bg-slate-900/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">Send Swap Request</CardTitle>
                      <CardDescription>
                        Send a message to the owner to propose a swap
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder="Hi! I'm interested in swapping for this item. I have..."
                        value={swapMessage}
                        onChange={(e) => setSwapMessage(e.target.value)}
                        className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
                        rows={3}
                      />
                      <Button
                        onClick={handleSwapRequest}
                        disabled={!swapMessage.trim() || isRequesting}
                        variant="outline"
                        className="w-full border-slate-700 hover:border-slate-600"
                      >
                        {isRequesting ? 'Sending...' : 'Send Swap Request'}
                      </Button>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="space-y-4">
                  <Button
                    onClick={() => onNavigate('login')}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500"
                  >
                    Login to Swap or Redeem
                  </Button>
                  <p className="text-center text-sm text-slate-400">
                    Create an account to start swapping items
                  </p>
                </div>
              )}
            </div>
          )}

          {isOwnItem && (
            <div className="text-center py-4">
              <p className="text-slate-400">This is your item</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
