import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Shield, Users, Target, Truck, Globe, Sparkles, Award, Clock, CheckCircle, Star, Heart, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-blue-600 to-purple-700 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{backgroundImage: 'url("https://plus.unsplash.com/premium_photo-1661879449050-069f67e200bd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bG9naXN0aWNzfGVufDB8fDB8fHww")'}}></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Rush Delivery</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your trusted partner for international shipping and logistics. We deliver packages worldwide with speed, security, and reliability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-gray text-primary hover:bg-gray-100 px-8 py-3">
              Schedule Pickup
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">Our Story</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Founded with a Vision</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Rush Delivery was founded in 2020 with a simple mission: to revolutionize international shipping by making it faster, more reliable, and more accessible to businesses and individuals worldwide.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  What started as a small logistics company has grown into a global network serving over 50 countries, delivering thousands of packages daily with our advanced tracking technology and dedicated team of logistics professionals.
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">4+</div>
                    <div className="text-sm text-gray-600">Years of Excellence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">50+</div>
                    <div className="text-sm text-gray-600">Countries Served</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">99%</div>
                    <div className="text-sm text-gray-600">On-Time Delivery</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <div className="aspect-square bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mb-6">
                  <Truck className="w-20 h-20 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-center mb-4">Our Commitment</h4>
                <p className="text-gray-600 text-center">
                  Every package we handle represents someone's trust in us. That's why we go above and beyond to ensure safe, timely, and secure delivery every single time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Our Foundation</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-primary" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  To provide exceptional logistics solutions that connect businesses and individuals across the globe with speed, reliability, and security, while setting new standards in customer service and technological innovation.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-primary" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  To be the world's most trusted and efficient international delivery network, recognized for our commitment to innovation, sustainability, and customer satisfaction in the global logistics industry.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Heart className="w-8 h-8 text-primary" />
                  Our Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Reliability in every delivery
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Security and safety first
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Innovation and technology
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Customer satisfaction always
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Why Choose Rush Delivery?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
              <p className="text-gray-600">Quick delivery times with real-time tracking and guaranteed service levels</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Secure & Safe</h3>
              <p className="text-gray-600">Your packages are protected with comprehensive insurance coverage and secure handling</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Global Network</h3>
              <p className="text-gray-600">Extensive international shipping network with worldwide coverage and local expertise</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Award Winning</h3>
              <p className="text-gray-600">Recognized for excellence in logistics and customer service with industry awards</p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Reach */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Our Global Reach</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <Globe className="w-16 h-16 text-blue-600 mx-auto mb-6" />
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <p className="text-gray-600 font-medium">Countries Covered</p>
                <p className="text-sm text-gray-500 mt-2">Worldwide delivery network</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <Users className="w-16 h-16 text-green-600 mx-auto mb-6" />
                <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                <p className="text-gray-600 font-medium">Happy Customers</p>
                <p className="text-sm text-gray-500 mt-2">Satisfied clients worldwide</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <Truck className="w-16 h-16 text-purple-600 mx-auto mb-6" />
                <div className="text-4xl font-bold text-primary mb-2">5000+</div>
                <p className="text-gray-600 font-medium">Packages Delivered</p>
                <p className="text-sm text-gray-500 mt-2">Successful deliveries completed</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <Clock className="w-16 h-16 text-orange-600 mx-auto mb-6" />
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <p className="text-gray-600 font-medium">Customer Support</p>
                <p className="text-sm text-gray-500 mt-2">Round-the-clock assistance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Rush Delivery?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us with their most important shipments. Experience the difference of professional logistics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-3">
              Schedule Pickup Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3">
              Get Free Quote
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
