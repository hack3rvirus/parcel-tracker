import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Shield, Key } from 'lucide-react';

export default function AdminKeyPrompt({ onSuccess }) {
  const [adminKey, setAdminKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/admin');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!adminKey.trim()) {
      toast({
        title: 'Admin Key Required',
        description: 'Please enter the admin access key',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if the key is correct
      if (adminKey.trim() === '985d638bafbb39fb') {
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
          title: 'Invalid Admin Key',
          description: 'The admin key you entered is incorrect',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify admin key',
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
            Enter the admin access key to continue to the dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="adminKey" className="text-sm font-medium">
                Admin Access Key
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="adminKey"
                  type="password"
                  placeholder="Enter admin key"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
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
              <strong>Need the admin key?</strong><br />
              Check the credentials documentation for the current admin access key.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
