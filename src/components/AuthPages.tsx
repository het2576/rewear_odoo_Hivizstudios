/**
 * Login and Signup pages with form validation
 */

import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, Eye, EyeOff } from 'lucide-react';

interface AuthPageProps {
  type: 'login' | 'signup';
  onNavigate: (page: string) => void;
}

export default function AuthPage({ type, onNavigate }: AuthPageProps) {
  const { login, signup, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (type === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    const success = type === 'login' 
      ? await login(formData.email, formData.password)
      : await signup(formData.email, formData.password, formData.name);

    if (success) {
      onNavigate('dashboard');
    } else {
      setError(type === 'login' ? 'Invalid credentials' : 'Email already exists');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-white">
            {type === 'login' ? 'Welcome Back' : 'Join ReWear'}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {type === 'login' 
              ? 'Sign in to your account to continue swapping' 
              : 'Create an account to start your sustainable fashion journey'
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {type === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-500"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {type === 'login' ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                type === 'login' ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-slate-400">
            {type === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => onNavigate('signup')}
                  className="text-purple-400 hover:text-purple-300 font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => onNavigate('login')}
                  className="text-purple-400 hover:text-purple-300 font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </div>

          {/* Demo Credentials */}
          <div className="text-xs text-slate-500 bg-slate-900/50 rounded-lg p-3 space-y-1">
            <p className="font-medium">Demo Credentials:</p>
            <p>User: user@rewear.com / password</p>
            <p>Admin: admin@rewear.com / password</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
