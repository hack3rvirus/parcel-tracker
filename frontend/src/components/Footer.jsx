import { NavLink } from 'react-router-dom';
import { Package, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Clock, Shield, Truck } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Rush Delivery" className="h-8 w-8" />
              <span className="font-heading text-xl font-bold">Rush Delivery</span>
            </div>
            <p className="text-gray-400">
              Your trusted partner for international shipping and logistics. We provide fast, reliable, and secure delivery services to customers worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <NavLink to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/tracking" className="text-gray-400 hover:text-white transition-colors">
                  Track Parcel
                </NavLink>
              </li>
              <li>
                <NavLink to="/schedule" className="text-gray-400 hover:text-white transition-colors">
                  Schedule Pickup
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-400">
                <Truck className="h-4 w-4" />
                <span>Express Delivery</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Package className="h-4 w-4" />
                <span>Package Tracking</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Shield className="h-4 w-4" />
                <span>Secure Shipping</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Clock className="h-4 w-4" />
                <span>Real-time Updates</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-gray-400">5955 Eden Drive<br />Haltom City, TX 76112<br />United States</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-gray-400">+1-678-842-3655</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-400">support@rushdelivery.com</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <NavLink to="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </NavLink>
              <NavLink to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </NavLink>
              <NavLink to="/faq" className="hover:text-white transition-colors">
                FAQ
              </NavLink>
              <NavLink to="/contact" className="hover:text-white transition-colors">
                Contact Us
              </NavLink>
              <NavLink to="/admin" className="hover:text-white transition-colors text-xs">
                Admin
              </NavLink>
            </div>
            <p className="text-sm text-gray-400 mt-4 md:mt-0">
              &copy; {currentYear} Rush Delivery. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
