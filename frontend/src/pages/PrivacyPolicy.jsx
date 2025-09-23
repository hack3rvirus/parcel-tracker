import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, Database, Mail, Phone, MapPin } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")'}}></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Shield className="w-5 h-5" />
            <span>Last updated: January 2024</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary" />
                Our Commitment to Your Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed mb-4">
                Rush Delivery ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services, including our website, mobile applications, and shipping services.
              </p>
              <p className="text-gray-600 leading-relaxed">
                By using our services, you agree to the collection and use of information in accordance with this policy. We will not use or share your information with anyone except as described in this Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Database className="w-6 h-6 text-primary" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Name, email address, phone number, and mailing address</li>
                    <li>Company information (if applicable)</li>
                    <li>Payment information and billing details</li>
                    <li>Government-issued identification for certain services</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Shipping Information</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Sender and recipient names, addresses, and contact information</li>
                    <li>Package contents, weight, dimensions, and declared value</li>
                    <li>Tracking numbers and delivery preferences</li>
                    <li>Special handling instructions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Technical Information</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>IP address, browser type, and device information</li>
                    <li>Website usage data and cookies</li>
                    <li>Location data (with your permission)</li>
                    <li>Mobile device identifiers</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Eye className="w-6 h-6 text-primary" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Service Provision</h3>
                  <p className="text-gray-600">To provide shipping services, process payments, and communicate about your shipments</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Communication</h3>
                  <p className="text-gray-600">To send tracking updates, delivery notifications, and respond to customer inquiries</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Account Management</h3>
                  <p className="text-gray-600">To manage your account, preferences, and provide personalized services</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Improvement</h3>
                  <p className="text-gray-600">To improve our services, develop new features, and ensure security</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Legal Compliance</h3>
                  <p className="text-gray-600">To comply with legal obligations and protect our rights</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Lock className="w-6 h-6 text-primary" />
                Information Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described below:
                </p>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Service Providers</h3>
                  <p className="text-gray-600">We share information with trusted third-party service providers who assist us in operating our services, such as payment processors, delivery partners, and IT service providers.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Legal Requirements</h3>
                  <p className="text-gray-600">We may disclose information when required by law, court order, or government request, or to protect our rights, safety, or the rights and safety of others.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Business Transfers</h3>
                  <p className="text-gray-600">In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and employee training</li>
                <li>Secure payment processing systems</li>
                <li>Regular backups and disaster recovery procedures</li>
              </ul>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600 mb-4">You have the following rights regarding your personal information:</p>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Access</h3>
                  <p className="text-gray-600">Request access to your personal information we hold</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Correction</h3>
                  <p className="text-gray-600">Request correction of inaccurate or incomplete information</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Deletion</h3>
                  <p className="text-gray-600">Request deletion of your personal information (subject to legal requirements)</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Portability</h3>
                  <p className="text-gray-600">Request a copy of your data in a structured format</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Opt-out</h3>
                  <p className="text-gray-600">Opt-out of marketing communications at any time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-lg mb-8 bg-gradient-to-r from-primary to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p>privacy@rushdelivery.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p>+1-678-842-3655</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p>5955 Eden Drive<br />Haltom City, TX 76112</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updates to Policy */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Updates to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date at the top of this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
