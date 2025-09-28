import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Shield, Key } from 'lucide-react';
import API_BASE_URL from '@/config/api';
import axios from 'axios';

export default function AdminKeyPrompt({ onSuccess }) {
  const [adminKey, setAdminKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleKeySubmit = async (e) => {
    e.preventDefault();

    if (!adminKey.trim()) {
      toast({
        title: 'Missing Key',
        description: 'Please enter the admin access key',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/admin/verify_key`, {
        key: adminKey.trim()
      });

      if (response.data.valid) {
        // Store admin key for API authentication
        localStorage.setItem('adminKey', adminKey.trim());

        toast({
          title: 'Admin Access Granted',
          description: 'Welcome to the admin dashboard'
        });

        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/admin');
        }
      } else {
        toast({
          title: 'Invalid Key',
          description: 'The admin key you entered is incorrect',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Verification Failed',
        description: error.response?.data?.detail || 'Failed to verify admin key',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
          <p className="text-gray-600 mt-2">
            Enter your admin access key to access the dashboard
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleKeySubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="adminKey" className="text-sm font-medium">
                Admin Access Key
              </label>
              <Input
                id="adminKey"
                type="password"
                placeholder="Enter admin access key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Access Admin Dashboard'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Admin Access Only</strong><br />
              This area is restricted to authorized administrators only.
              Contact your system administrator if you need access.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
