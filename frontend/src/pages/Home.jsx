import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Bell, ShieldCheck, Star, Shield, Lock, Cpu, Boxes, Hospital, ShoppingCart, Building2, Globe, Truck, Clock, CheckCircle, Package, ArrowRight, Users, Award, Headphones, Zap, Map } from "lucide-react";
import HeroSlideshow from "@/components/HeroSlideshow";
import AdminKeyPrompt from "@/components/AdminKeyPrompt";
import "@/components/FlagSlider.css";

function Counter({ to = 0, duration = 1600, prefix = '', suffix = '', className = '' }) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const from = 0;
          const animate = (t) => {
            const prog = Math.min(1, (t - start) / duration);
            const valNow = Math.floor(from + (to - from) * prog);
            setVal(valNow);
            if (prog < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);

  return (
    <div ref={ref} className={className}>
      <span className="tabular-nums tracking-tight text-4xl font-bold">{prefix}{val.toLocaleString()}{suffix}</span>
    </div>
  );
}

function FlagSlider() {
  const countries = [
    { name: 'Algeria', code: 'dz' },
    { name: 'Australia', code: 'au' },
    { name: 'United Kingdom', code: 'gb' },
    { name: 'Canada', code: 'ca' },
    { name: 'South Africa', code: 'za' },
    { name: 'Germany', code: 'de' },
    { name: 'France', code: 'fr' },
    { name: 'Japan', code: 'jp' },
    { name: 'Brazil', code: 'br' },
    { name: 'India', code: 'in' },
    { name: 'China', code: 'cn' },
    { name: 'Russia', code: 'ru' }
  ];

  return (
    <div className="relative overflow-hidden py-8">
      <div className="flex animate-scroll-left hover:pause-scroll">
        {[...countries, ...countries].map((country, index) => (
          <div key={`${country.code}-${index}`} className="flex-shrink-0 mx-4">
            <div className="w-16 h-12 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <img
                src={`https://flagcdn.com/w80/${country.code}.png`}
                alt={`${country.name} flag`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="text-center mt-2">
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                {country.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [trackingId, setTrackingId] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleTrack = () => {
    if (trackingId.trim()) {
      navigate(`/tracking?trackingId=${trackingId.trim()}`);
    }
  };

  const handleSubscribe = async () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast({ title: 'Invalid email', description: 'Please enter a valid email address.' });
      return;
    }
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 600));
      toast({ title: 'Success', description: 'Subscribed successfully!' });
      setEmail('');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to subscribe. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Admin Access Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowAdminPrompt(true)}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          size="icon"
        >
          <Shield className="w-6 h-6" />
        </Button>
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

      {/* Hero Slideshow Section */}
      <HeroSlideshow />

      {/* Global Reach Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Global Reach</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connecting businesses and individuals across continents with our extensive international delivery network
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <Counter to={50} suffix="+" className="text-3xl font-bold text-primary mb-2" />
                <p className="text-gray-600">Countries Covered</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <Counter to={1000} suffix="+" className="text-3xl font-bold text-primary mb-2" />
                <p className="text-gray-600">Happy Customers</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                <Package className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <Counter to={5000} suffix="+" className="text-3xl font-bold text-primary mb-2" />
                <p className="text-gray-600">Packages Delivered</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                <Award className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <Counter to={99} suffix="%" className="text-3xl font-bold text-primary mb-2" />
                <p className="text-gray-600">On-Time Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Why Choose Rush Delivery?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast & Reliable</h3>
              <p className="text-gray-600">Quick delivery times with real-time tracking and guaranteed service</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure & Safe</h3>
              <p className="text-gray-600">Your packages are protected with insurance coverage and secure handling</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Global Network</h3>
              <p className="text-gray-600">Extensive international shipping network with worldwide coverage</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer service with dedicated support team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Popular Destinations</h2>
          <FlagSlider />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Package className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  Package Delivery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Fast and secure delivery of packages of all sizes, from documents to large freight. Our advanced tracking system ensures your packages are monitored every step of the way.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Real-time tracking updates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Insurance coverage included
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Door-to-door service
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Truck className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  Express Shipping
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Urgent delivery services with guaranteed timeframes for your most important shipments. Perfect for time-sensitive documents and critical business deliveries.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Same-day delivery available
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Priority handling
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Dedicated express lanes
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Globe className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  International Shipping
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Worldwide shipping services with customs clearance and international tracking. We handle all the complexities of international logistics so you don't have to.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Customs clearance assistance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    International tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Multi-currency support
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Map Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Live Tracking Network</h2>
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
            <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Map className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-4">Interactive Live Map</p>
                <p className="text-sm text-gray-400">
                  Real-time tracking of all active deliveries across our global network
                </p>
                <Button className="mt-4 bg-primary hover:bg-primary/90">
                  View Live Map
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Rush Delivery has been our go-to shipping partner for international orders. Their real-time tracking and reliable service have helped us expand our business globally."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    S
                  </div>
                  <div>
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">CEO, TechStart Inc.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Outstanding service! Our urgent packages always arrive on time, and the customer support team is incredibly responsive. Highly recommended for any business."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    M
                  </div>
                  <div>
                    <p className="font-semibold">Michael Chen</p>
                    <p className="text-sm text-gray-500">Operations Manager, GlobalMart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The live tracking feature gives us complete visibility over our shipments. Rush Delivery has streamlined our entire logistics process and saved us countless hours."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    E
                  </div>
                  <div>
                    <p className="font-semibold">Emily Rodriguez</p>
                    <p className="text-sm text-gray-500">Supply Chain Director, MediCorp</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section with Background */}
      <section className="py-20 bg-gradient-to-r from-primary via-blue-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")'}}></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Ship with Rush Delivery?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Experience the future of international shipping with our reliable and efficient services. Join thousands of satisfied customers worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-gray text-gray hover:bg-gray-100 px-8 py-3">
              Schedule Pickup
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3">
              Get Quote
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About Rush Delivery</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Rush Delivery is your trusted partner for international shipping and logistics. We provide fast, reliable, and secure delivery services to customers worldwide. Our advanced tracking system ensures you can monitor your packages every step of the way.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
                <p className="text-gray-600">To provide exceptional logistics solutions that connect businesses and individuals across the globe with speed, reliability, and security.</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
                <p className="text-gray-600">To be the world's most trusted and efficient international delivery network, setting new standards in logistics technology.</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-3">Our Values</h3>
                <p className="text-gray-600">Reliability, security, innovation, and customer satisfaction drive everything we do at Rush Delivery.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
