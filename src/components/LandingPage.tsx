/**
 * Landing page with hero section and featured items carousel
 */

import React from 'react';
import { useItemStore } from '../store/itemStore';
import { ArrowRight, Recycle, Users, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const { items } = useItemStore();
  const featuredItems = items.filter(item => item.featured && item.status === 'available');
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  };

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold">
            <span className="bg-gradient-to-r from-primary via-blue-400 to-blue-300 bg-clip-text text-transparent">
              Sustainable
            </span>
            <br />
            <span className="text-foreground">Fashion Exchange</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform your wardrobe sustainably. Swap unused clothing, earn points, 
            and discover unique pieces while reducing textile waste.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => onNavigate('signup')}
            size="lg"
            className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-lg px-8 py-6 group"
          >
            Start Swapping
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </Button>
          <Button
            onClick={() => onNavigate('browse')}
            variant="outline"
            size="lg"
            className="border-border hover:border-primary/50 text-lg px-8 py-6"
          >
            Browse Items
          </Button>
          <Button
            onClick={() => onNavigate('add-item')}
            variant="outline"
            size="lg"
            className="border-border hover:border-primary/50 text-lg px-8 py-6"
          >
            List an Item
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <Card className="bg-card/50 border-border hover:bg-card/70 transition-colors group">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Recycle className="text-green-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Eco-Friendly</h3>
            <p className="text-muted-foreground">
              Reduce textile waste by giving your clothes a second life through our sustainable exchange platform.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border hover:bg-card/70 transition-colors group">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Users className="text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Community Driven</h3>
            <p className="text-muted-foreground">
              Connect with like-minded fashion enthusiasts and build a sustainable community together.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border hover:bg-card/70 transition-colors group">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Award className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Earn Rewards</h3>
            <p className="text-muted-foreground">
              Earn points for every item you list and use them to get items you love from other users.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Featured Items Carousel */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">Featured Items</h2>
          <p className="text-muted-foreground">Discover amazing pieces from our community</p>
        </div>

        {featuredItems.length > 0 && (
          <div className="relative">
            <div className="overflow-hidden rounded-xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredItems.map((item) => (
                  <div key={item.id} className="w-full flex-shrink-0">
                    <Card className="bg-card/50 border-border overflow-hidden">
                      <div className="md:flex">
                        <div className="md:w-1/2">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-64 md:h-80 object-cover"
                          />
                        </div>
                        <div className="md:w-1/2 p-8 flex flex-col justify-center space-y-4">
                          <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-foreground">{item.title}</h3>
                            <p className="text-muted-foreground">{item.description}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-primary">
                              {item.pointsRequired} points
                            </span>
                            <Button
                              onClick={() => onNavigate('signup')}
                              className="bg-gradient-to-r from-primary to-blue-500"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            {featuredItems.length > 1 && (
              <>
                <Button
                  onClick={prevSlide}
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 border-border"
                >
                  <ChevronLeft size={20} />
                </Button>
                <Button
                  onClick={nextSlide}
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 border-border"
                >
                  <ChevronRight size={20} />
                </Button>
              </>
            )}

            {/* Dots Indicator */}
            <div className="flex justify-center space-x-2 mt-6">
              {featuredItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentSlide === index ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
