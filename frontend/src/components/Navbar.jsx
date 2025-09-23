import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Package, User, Menu, X, Bell, LogOut, Sun, Moon, Laptop, Settings, Shield } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useMediaQuery } from 'react-responsive';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import API_BASE_URL from '@/config/api';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const isTablet = useMediaQuery({ maxWidth: 1024 });
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { theme, setTheme, systemTheme } = useTheme();
  const resolved = theme === 'system' ? systemTheme : theme;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tracking?trackingId=${searchQuery.trim()}`);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      toast({
        title: 'Logged out successfully',
        description: 'You have been logged out of your account'
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error logging out',
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Track', path: '/tracking' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Schedule', path: '/schedule' },
  ];

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <>
      <nav aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-50 w-full shadow-sm animate-fade-in" style={{ backgroundColor: 'hsl(var(--card))', borderBottom: '1px solid hsl(var(--border))' }}>
        <div className="container flex h-16 items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Rush Delivery" className="h-8 w-8" />
            <span className="font-heading text-xl font-bold">Rush Delivery</span>
          </NavLink>

          {/* Desktop Navigation */}
          {!isTablet && (
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors hover:text-primary ${
                      isActive ? 'text-primary' : 'text-foreground/80'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          )}

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter Tracking ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
            <Button type="submit" size="sm" className="btn-hover" aria-label="Search tracking">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="btn-hover"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}

            {/* Theme toggle moved to hamburger menu for cleaner look */}
            {isTablet && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                className="btn-hover"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && isTablet && (
        <div className="fixed inset-0 z-40 animate-fade-in" style={{ backgroundColor: 'hsl(var(--background))' }}>
          <div className="container py-16">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className="text-lg font-medium card-hover p-3 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="flex items-center space-x-2 p-3">
                <Input
                  type="text"
                  placeholder="Enter Tracking ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="sm" className="btn-hover">
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              <div className="border-t pt-4 mt-4 space-y-2">
                {isLoggedIn && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="w-full justify-start"
                >
                  {resolved === 'dark' ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                  {resolved === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
