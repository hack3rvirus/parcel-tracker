import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { MapPin, Phone, Mail, Clock, Package, Truck, CheckCircle, ArrowRight, Calendar, User, Weight } from 'lucide-react';

export default function Schedule() {
  const [formData, setFormData] = useState({
    // Contact Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',

    // Pickup Details
    pickupAddress: '',
    pickupCity: '',
    pickupState: '',
    pickupZip: '',
    pickupDate: '',
    pickupTime: '',

    // Delivery Details
    deliveryName: '',
    deliveryCompany: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryState: '',
    deliveryZip: '',
    deliveryPhone: '',

    // Package Details
    packageType: '',
    weight: '',
    dimensions: '',
    quantity: '1',
    value: '',
    description: '',

    // Service Type
    serviceType: 'standard',
    specialInstructions: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone',
      'pickupAddress', 'pickupCity', 'pickupState', 'pickupZip',
      'deliveryName', 'deliveryAddress', 'deliveryCity', 'deliveryState', 'deliveryZip',
      'weight', 'packageType'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      toast('Please fill in all required fields marked with an asterisk (*).');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast('Pickup scheduled successfully! A customer care representative will contact you within 24 hours to confirm the details.');

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        pickupAddress: '',
        pickupCity: '',
        pickupState: '',
        pickupZip: '',
        pickupDate: '',
        pickupTime: '',
        deliveryName: '',
        deliveryCompany: '',
        deliveryAddress: '',
        deliveryCity: '',
        deliveryState: '',
        deliveryZip: '',
        deliveryPhone: '',
        packageType: '',
        weight: '',
        dimensions: '',
        quantity: '1',
        value: '',
        description: '',
        serviceType: 'standard',
        specialInstructions: ''
      });

      setIsSubmitting(false);
    }, 2000);
  };

  const serviceTypes = [
    { value: 'standard', label: 'Standard Delivery (3-5 days)', price: 'From $25' },
    { value: 'express', label: 'Express Delivery (1-2 days)', price: 'From $45' },
    { value: 'urgent', label: 'Urgent Delivery (Same day)', price: 'From $75' },
    { value: 'international', label: 'International Shipping', price: 'From $65' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")'}}></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Schedule a Pickup</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Professional logistics services tailored to your needs. Schedule your pickup and let us handle the rest.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>Same-day scheduling available</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              <span>Real-time tracking included</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Insurance coverage included</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Schedule Form */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" />
                Pickup Request Form
              </CardTitle>
              <p className="text-gray-600">Fill out the form below and we'll contact you to confirm your pickup details.</p>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Contact Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name *</label>
                      <Input
                        name="firstName"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name *</label>
                      <Input
                        name="lastName"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
                      <Input
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Company (Optional)</label>
                      <Input
                        name="company"
                        placeholder="Company name"
                        value={formData.company}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Pickup Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Pickup Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Pickup Address *</label>
                      <Input
                        name="pickupAddress"
                        placeholder="Street address"
                        value={formData.pickupAddress}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">City *</label>
                        <Input
                          name="pickupCity"
                          placeholder="City"
                          value={formData.pickupCity}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">State *</label>
                        <Input
                          name="pickupState"
                          placeholder="State"
                          value={formData.pickupState}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">ZIP Code *</label>
                        <Input
                          name="pickupZip"
                          placeholder="12345"
                          value={formData.pickupZip}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Preferred Date</label>
                        <Input
                          name="pickupDate"
                          type="date"
                          value={formData.pickupDate}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Preferred Time</label>
                        <Input
                          name="pickupTime"
                          type="time"
                          value={formData.pickupTime}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Delivery Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Recipient Name *</label>
                      <Input
                        name="deliveryName"
                        placeholder="Full name of recipient"
                        value={formData.deliveryName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Company (Optional)</label>
                      <Input
                        name="deliveryCompany"
                        placeholder="Company name"
                        value={formData.deliveryCompany}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Delivery Address *</label>
                      <Input
                        name="deliveryAddress"
                        placeholder="Street address"
                        value={formData.deliveryAddress}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">City *</label>
                        <Input
                          name="deliveryCity"
                          placeholder="City"
                          value={formData.deliveryCity}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">State *</label>
                        <Input
                          name="deliveryState"
                          placeholder="State"
                          value={formData.deliveryState}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">ZIP Code *</label>
                        <Input
                          name="deliveryZip"
                          placeholder="12345"
                          value={formData.deliveryZip}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Recipient Phone</label>
                      <Input
                        name="deliveryPhone"
                        type="tel"
                        placeholder="Recipient's phone number"
                        value={formData.deliveryPhone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Package Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Weight className="w-5 h-5 text-primary" />
                    Package Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Package Type *</label>
                      <Input
                        name="packageType"
                        placeholder="e.g., Documents, Electronics, Clothing"
                        value={formData.packageType}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Weight (kg) *</label>
                      <Input
                        name="weight"
                        type="number"
                        placeholder="0.00"
                        min="0.1"
                        step="0.1"
                        value={formData.weight}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Dimensions (L x W x H)</label>
                      <Input
                        name="dimensions"
                        placeholder="e.g., 30 x 20 x 15 cm"
                        value={formData.dimensions}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Quantity *</label>
                      <Input
                        name="quantity"
                        type="number"
                        placeholder="1"
                        min="1"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Declared Value ($)</label>
                      <Input
                        name="value"
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        value={formData.value}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Package Description</label>
                      <Input
                        name="description"
                        placeholder="Brief description of the package contents"
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Service Type */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Service Type</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {serviceTypes.map((service) => (
                      <div
                        key={service.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.serviceType === service.value
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-primary/50'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, serviceType: service.value }))}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{service.label}</h4>
                            <p className="text-sm text-gray-600">{service.price}</p>
                          </div>
                          {formData.serviceType === service.value && (
                            <CheckCircle className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-medium mb-2">Special Instructions</label>
                  <textarea
                    name="specialInstructions"
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Any special handling instructions or notes..."
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-gray py-3 text-lg"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Scheduling Pickup...
                    </>
                  ) : (
                    <>
                      Schedule Pickup
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Phone Support</h4>
                <p className="text-primary font-medium">+1-678-842-3655</p>
                <p className="text-sm text-gray-600">Mon-Fri 8AM-6PM EST</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Email Support</h4>
                <p className="text-primary font-medium">support@rushdelivery.com</p>
                <p className="text-sm text-gray-600">24/7 Response</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Office Address</h4>
                <p className="text-primary font-medium">5955 Eden Drive</p>
                <p className="text-sm text-gray-600">Haltom City, TX 76112</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
