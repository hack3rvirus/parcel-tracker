import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';
import SEO from './SEO';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <SEO />
      <Navbar />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
