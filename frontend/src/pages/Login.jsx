import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import globeAnim from '@/assets/Earth globe rotating with Seamless loop animation.json';
import API_BASE_URL from '@/config/api';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Shield, Key } from 'lucide-react';
import AdminKeyPrompt from '@/components/AdminKeyPrompt';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isRegister) {
        // User registration
        await axios.post(`${API_BASE_URL}/register`, {
          email,
          password,
          role: 'client'
        });
        toast({
          title: "Success",
          description: "Account created successfully!",
          variant: "success"
        });
        navigate('/');
      } else {
        // Regular user login
        const res = await axios.post(`${API_BASE_URL}/login`, { email, password });
        localStorage.setItem('token', res.data.token);

        toast({
          title: "Welcome",
          description: "Logged in successfully!",
          variant: "success"
        });
        navigate('/');
      }
    } catch (e) {
      console.error('Auth error:', e);
      toast({
        title: "Authentication Failed",
        description: e.response?.data?.detail || e.message || 'Please check your credentials and try again',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminAccess = () => {
    setShowAdminPrompt(true);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50">
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <Lottie animationData={globeAnim} loop autoplay />
      </div>

      <div className="relative w-full max-w-md space-y-6">
        {/* Admin Access Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleAdminAccess}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
          >
            <Shield className="w-4 h-4 mr-2" />
            Admin Access
          </Button>
        </div>

        {/* Main Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <p className="text-center text-gray-600">
              {isRegister
                ? 'Sign up to get started'
                : 'Sign in to your account'
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isRegister ? 'Creating Account...' : 'Signing In...'}
                </div>
              ) : (
                isRegister ? 'Create Account' : 'Sign In'
              )}
            </Button>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setIsRegister(!isRegister)}
                className="text-sm"
              >
                {isRegister
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"
                }
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Rush Delivery Platform</h3>
            <p className="text-sm text-gray-600">
              Professional logistics management with real-time tracking,
              admin dashboard, and comprehensive delivery solutions.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Key Prompt Modal */}
      {showAdminPrompt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <AdminKeyPrompt onSuccess={() => setShowAdminPrompt(false)} />
            <Button
              variant="outline"
              onClick={() => setShowAdminPrompt(false)}
              className="w-full mt-4"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
