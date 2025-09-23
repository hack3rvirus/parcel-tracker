import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Shield, Users, Truck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

function PricingCard({ plan, isPopular = false, onSelect }) {
  return (
    <Card className={`relative ${isPopular ? 'border-primary shadow-lg scale-105' : 'border-gray-200'} transition-all duration-300 hover:shadow-md`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-white px-3 py-1">
            <Star className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
        <div className="text-3xl font-bold text-primary mt-2">
          ${plan.price}
          <span className="text-sm font-normal text-gray-500">/shipment</span>
        </div>
        <p className="text-gray-600 mt-2">{plan.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
        <Button
          className={`w-full mt-6 ${isPopular ? 'bg-primary hover:bg-primary/90' : ''}`}
          variant={isPopular ? 'default' : 'outline'}
          onClick={() => onSelect(plan)}
        >
          {plan.cta}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { toast } = useToast();

  const plans = [
    {
      name: 'Standard',
      price: 15,
      description: 'Perfect for occasional shipments',
      cta: 'Get Started',
      features: [
        'Up to 5kg packages',
        'Standard delivery (5-7 days)',
        'Basic tracking',
        'Email support',
        'Package insurance up to $100',
        'Door-to-door delivery'
      ]
    },
    {
      name: 'Express',
      price: 25,
      description: 'Ideal for urgent deliveries',
      cta: 'Get Started',
      features: [
        'Up to 10kg packages',
        'Express delivery (2-3 days)',
        'Real-time tracking',
        'Priority support',
        'Package insurance up to $500',
        'Door-to-door delivery',
        'Signature required'
      ]
    },
    {
      name: 'Premium',
      price: 45,
      description: 'For business and bulk shipments',
      cta: 'Get Started',
      features: [
        'Up to 25kg packages',
        'Next-day delivery',
        'Advanced tracking',
        '24/7 phone support',
        'Package insurance up to $1000',
        'Door-to-door delivery',
        'Signature required',
        'Custom packaging',
        'Bulk discounts'
      ]
    }
  ];

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    toast({
      title: 'Plan Selected',
      description: `${plan.name} plan selected. Redirecting to checkout...`,
    });
  };

  const handleContactSales = () => {
    toast({
      title: 'Contact Sales',
      description: 'Our sales team will reach out to you within 24 hours.',
    });
  };

  return (
    <div className="pt-20 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Shipping Rates</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Transparent pricing for all your shipping needs. No hidden fees, no surprises.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan, index) => (
          <PricingCard
            key={plan.name}
            plan={plan}
            isPopular={index === 1}
            onSelect={handlePlanSelect}
          />
        ))}
      </div>

      {/* Additional Services */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Additional Services</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Insurance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">$5</p>
              <p className="text-sm text-gray-600">Additional coverage up to $2000</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Express
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">$10</p>
              <p className="text-sm text-gray-600">Same-day delivery upgrade</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Signature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">$3</p>
              <p className="text-sm text-gray-600">Required delivery confirmation</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Pickup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">$8</p>
              <p className="text-sm text-gray-600">Scheduled package pickup</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Popular Destinations</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['Algeria', 'Australia', 'United Kingdom', 'Canada', 'South Africa'].map((country) => (
            <Card key={country} className="card-hover text-center">
              <CardContent className="p-4">
                <div className="font-semibold text-primary">{country}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Need Custom Pricing?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          For bulk shipments, enterprise solutions, or special requirements, contact our sales team for personalized pricing.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={handleContactSales}>
            Contact Sales Team
          </Button>
          <Button size="lg" variant="outline">
            Schedule Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
