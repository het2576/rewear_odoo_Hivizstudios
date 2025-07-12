/**
 * Browse and search items page with filtering
 */

import React, { useState, useMemo } from 'react';
import { useItemStore } from '../store/itemStore';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter, Grid, List } from 'lucide-react';

interface BrowseItemsProps {
  onNavigate: (page: string, itemId?: string) => void;
}

export default function BrowseItems({ onNavigate }: BrowseItemsProps) {
  const { items } = useItemStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get available items (excluding user's own items if logged in)
  const availableItems = items.filter(
    item => item.status === 'available' && (!user || item.uploaderId !== user.id)
  );

  // Get unique categories and conditions
  const categories = useMemo(() => {
    const cats = [...new Set(availableItems.map(item => item.category))];
    return cats.sort();
  }, [availableItems]);

  const conditions = ['new', 'like-new', 'good', 'fair'];

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = availableItems.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesCondition = selectedCondition === 'all' || item.condition === selectedCondition;
      
      return matchesSearch && matchesCategory && matchesCondition;
    });

    // Sort items
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => a.pointsRequired - b.pointsRequired);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.pointsRequired - a.pointsRequired);
        break;
      default:
        break;
    }

    return filtered;
  }, [availableItems, searchTerm, selectedCategory, selectedCondition, sortBy]);

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
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Browse Items</h1>
        <p className="text-slate-400">Discover amazing pieces from our community</p>
      </div>

      {/* Search and Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
            <Input
              placeholder="Search items, descriptions, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 bg-slate-900/50 border-slate-700">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger className="w-full sm:w-48 bg-slate-900/50 border-slate-700">
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  {conditions.map(condition => (
                    <SelectItem key={condition} value={condition}>
                      {condition.charAt(0).toUpperCase() + condition.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48 bg-slate-900/50 border-slate-700">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-low">Points: Low to High</SelectItem>
                  <SelectItem value="price-high">Points: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-purple-500' : 'border-slate-700'}
              >
                <Grid size={16} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-purple-500' : 'border-slate-700'}
              >
                <List size={16} />
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>{filteredItems.length} items found</span>
            {(searchTerm || selectedCategory !== 'all' || selectedCondition !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedCondition('all');
                }}
                className="text-purple-400 hover:text-purple-300"
              >
                Clear filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Items Grid/List */}
      {filteredItems.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-12 text-center space-y-4">
            <Filter className="mx-auto text-slate-600" size={48} />
            <div>
              <p className="text-slate-400">No items found</p>
              <p className="text-sm text-slate-500">Try adjusting your search or filters</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
        }>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`group cursor-pointer ${
                viewMode === 'list' ? 'flex space-x-4' : ''
              }`}
              onClick={() => onNavigate('item-detail', item.id)}
            >
              <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105 overflow-hidden">
                <div className={`relative ${viewMode === 'list' ? 'w-48 h-32' : 'w-full h-48'}`}>
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className={`${getConditionColor(item.condition)} border-0`}>
                      {item.condition}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2">{item.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-purple-400">
                      {item.pointsRequired} pts
                    </span>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Size {item.size}</p>
                      <p className="text-xs text-slate-600">by {item.uploaderName}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
