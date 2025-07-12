/**
 * Add new item page with image upload and form validation
 */

import React, { useState } from 'react';
import { useItemStore } from '../store/itemStore';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Upload, X, Plus, ArrowLeft } from 'lucide-react';

interface AddItemProps {
  onNavigate: (page: string) => void;
}

export default function AddItem({ onNavigate }: AddItemProps) {
  const { addItem } = useItemStore();
  const { user, updatePoints } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    size: '',
    condition: '',
    tags: '',
    pointsRequired: 100
  });
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) {
    onNavigate('login');
    return null;
  }

  const categories = ['Dresses', 'Tops', 'Bottoms', 'Jackets', 'Sweaters', 'Shoes', 'Accessories', 'Other'];
  const types = ['Casual', 'Formal', 'Business', 'Sports', 'Party', 'Vintage', 'Designer'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11', '12', 'One Size'];
  const conditions = [
    { value: 'new', label: 'New with tags' },
    { value: 'like-new', label: 'Like new' },
    { value: 'good', label: 'Good condition' },
    { value: 'fair', label: 'Fair condition' }
  ];

  // Predefined image options for demo
  const sampleImages = [
    'https://pub-cdn.sider.ai/u/U0O9H2OZ609/web-coder/68720b70711d0815fd240baf/resource/fbb9fe0f-22ea-445b-b9c7-c782d12d5b1e.jpg',
    'https://pub-cdn.sider.ai/u/U0O9H2OZ609/web-coder/68720b70711d0815fd240baf/resource/ea993e92-0986-4283-8d6c-c9cd5a24580a.jpg',
    'https://pub-cdn.sider.ai/u/U0O9H2OZ609/web-coder/68720b70711d0815fd240baf/resource/4a12f79a-c592-4a78-bb98-2ee2a126b0ff.jpg',
    'https://pub-cdn.sider.ai/u/U0O9H2OZ609/web-coder/68720b70711d0815fd240baf/resource/30c189c3-c4bb-4c79-b1be-23e63d30f36a.jpg',
    'https://pub-cdn.sider.ai/u/U0O9H2OZ609/web-coder/68720b70711d0815fd240baf/resource/ce02f709-5c01-4439-97f1-1c1d65b6534e.jpg',
    'https://pub-cdn.sider.ai/u/U0O9H2OZ609/web-coder/68720b70711d0815fd240baf/resource/0e76d240-4cf6-4626-aaba-2394bc0c7a21.jpg',
    'https://pub-cdn.sider.ai/u/U0O9H2OZ609/web-coder/68720b70711d0815fd240baf/resource/a7c5846b-9687-42b7-ae4c-ca1d28624bf7.jpg',
    'https://pub-cdn.sider.ai/u/U0O9H2OZ609/web-coder/68720b70711d0815fd240baf/resource/8aa60ff9-dfbd-49c3-9847-50cbeb8da822.jpg'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.size) newErrors.size = 'Size is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (images.length === 0) newErrors.images = 'At least one image is required';
    if (formData.pointsRequired < 50 || formData.pointsRequired > 500) {
      newErrors.pointsRequired = 'Points must be between 50 and 500';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0);

    addItem({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      type: formData.type,
      size: formData.size,
      condition: formData.condition as any,
      tags: tagsArray,
      images,
      uploaderId: user.id,
      uploaderName: user.name,
      pointsRequired: formData.pointsRequired,
      status: 'under-review'
    });

    // Award points for listing an item
    updatePoints(user.points + 25);

    setIsSubmitting(false);
    
    // Show success message
    alert('Item submitted successfully! It will be reviewed by our team before going live. You earned 25 points!');
    onNavigate('dashboard');
  };

  const addSampleImage = (imageUrl: string) => {
    if (images.length < 5 && !images.includes(imageUrl)) {
      setImages([...images, imageUrl]);
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          onClick={() => onNavigate('dashboard')}
          variant="outline"
          size="icon"
          className="border-slate-700"
        >
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">List New Item</h1>
          <p className="text-slate-400">Share your unused clothing with the community</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Item Details</CardTitle>
            <CardDescription>Provide information about your item</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-300">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-slate-900/50 border-slate-700 text-white"
                placeholder="e.g., Vintage Denim Jacket"
              />
              {errors.title && <p className="text-red-400 text-sm">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-300">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 min-h-24"
                placeholder="Describe the item, its condition, styling tips, etc."
              />
              {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-700">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-red-400 text-sm">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Type *</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-700">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-red-400 text-sm">{errors.type}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Size *</Label>
                <Select 
                  value={formData.size} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, size: value }))}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-700">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map(size => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.size && <p className="text-red-400 text-sm">{errors.size}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Condition *</Label>
                <Select 
                  value={formData.condition} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-700">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map(condition => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.condition && <p className="text-red-400 text-sm">{errors.condition}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-slate-300">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="bg-slate-900/50 border-slate-700 text-white"
                placeholder="e.g., vintage, casual, summer (comma separated)"
              />
              <p className="text-xs text-slate-500">Add relevant tags to help others find your item</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="points" className="text-slate-300">Points Required (50-500)</Label>
              <Input
                id="points"
                type="number"
                min="50"
                max="500"
                value={formData.pointsRequired}
                onChange={(e) => setFormData(prev => ({ ...prev, pointsRequired: parseInt(e.target.value) || 100 }))}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
              {errors.pointsRequired && <p className="text-red-400 text-sm">{errors.pointsRequired}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Images *</CardTitle>
            <CardDescription>Add up to 5 images of your item</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Item ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length < 5 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">Choose from sample images:</p>
                <div className="grid grid-cols-4 gap-3">
                  {sampleImages.map((imageUrl, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addSampleImage(imageUrl)}
                      disabled={images.includes(imageUrl)}
                      className="relative group"
                    >
                      <img
                        src={imageUrl}
                        alt={`Sample ${index + 1}`}
                        className={`w-full h-20 object-cover rounded-lg border-2 transition-all ${
                          images.includes(imageUrl)
                            ? 'border-green-500 opacity-50'
                            : 'border-slate-700 hover:border-purple-400'
                        }`}
                      />
                      {!images.includes(imageUrl) && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus size={20} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {errors.images && <p className="text-red-400 text-sm">{errors.images}</p>}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onNavigate('dashboard')}
            className="flex-1 border-slate-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            {isSubmitting ? 'Submitting...' : 'List Item (+25 points)'}
          </Button>
        </div>
      </form>
    </div>
  );
}
