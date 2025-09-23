import { NavLink } from 'react-router-dom';
import { Home, Search, User, Phone, Calendar } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';

export default function BottomNav() {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  if (!isMobile) return null;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/tracking', icon: Search, label: 'Track' },
    { path: '/schedule', icon: Calendar, label: 'Schedule' },
    { path: '/contact', icon: Phone, label: 'Contact' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 border-t shadow-lg z-[80] animate-fade-in bg-white/95 backdrop-blur-sm"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Bottom navigation"
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-2 px-1 transition-all duration-200 ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5 mb-1 transition-transform hover:scale-110" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
