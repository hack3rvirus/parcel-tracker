import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, HelpCircle, Mail, Phone, MessageCircle } from 'lucide-react';

export default function FAQ() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      category: "Shipping Services",
      questions: [
        {
          question: "What types of packages can I ship with Rush Delivery?",
          answer: "We handle a wide variety of packages including documents, electronics, clothing, medical supplies, automotive parts, and more. Our services accommodate packages from small envelopes to large freight shipments up to 150 lbs."
        },
        {
          question: "How do I schedule a pickup?",
          answer: "You can schedule a pickup through our website by filling out the pickup request form, calling our customer service at +1-678-842-3655, or emailing us at support@rushdelivery.com. We'll contact you within 24 hours to confirm details."
        },
        {
          question: "What are your delivery timeframes?",
          answer: "We offer several service levels: Standard (3-5 days), Express (1-2 days), Urgent (same day), and International (5-10 days depending on destination). Delivery times may vary based on package size, destination, and service level selected."
        },
        {
          question: "Do you offer international shipping?",
          answer: "Yes! We ship to over 50 countries worldwide. International shipping includes customs clearance assistance, international tracking, and multi-currency support. Contact us for specific country requirements and restrictions."
        }
      ]
    },
    {
      category: "Tracking & Insurance",
      questions: [
        {
          question: "How does package tracking work?",
          answer: "Every package receives a unique tracking ID. You can track your package in real-time through our website, mobile app, or by calling customer service. Our advanced GPS tracking system provides updates at every stage of the delivery process."
        },
        {
          question: "What happens if my package is lost or damaged?",
          answer: "All packages are automatically insured up to $100. Additional insurance coverage is available for valuable items. If your package is lost or damaged, contact us immediately at +1-678-842-3655 to file a claim. We'll work with you to resolve the issue quickly."
        },
        {
          question: "Can I change the delivery address after pickup?",
          answer: "Yes, you can request delivery address changes up to 24 hours before the scheduled delivery time. Contact our customer service team with your tracking ID and the new delivery information. Additional fees may apply for address changes."
        }
      ]
    },
    {
      category: "Pricing & Payment",
      questions: [
        {
          question: "How are shipping rates calculated?",
          answer: "Shipping rates are calculated based on package weight, dimensions, destination, service level, and any additional services required. You can get an instant quote through our website or by contacting our sales team."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, bank transfers, and corporate accounts. Payment is typically collected at the time of pickup or delivery, depending on your account preferences."
        },
        {
          question: "Are there any additional fees?",
          answer: "Additional fees may apply for fuel surcharges, residential delivery, special handling, insurance above the standard $100 coverage, or address changes. All fees are clearly disclosed before you confirm your shipment."
        }
      ]
    },
    {
      category: "Business Services",
      questions: [
        {
          question: "Do you offer business accounts?",
          answer: "Yes! We offer corporate accounts with volume discounts, dedicated account managers, monthly billing, and customized reporting. Contact our business development team to discuss your specific needs."
        },
        {
          question: "Can I schedule recurring pickups?",
          answer: "Absolutely! We offer scheduled pickup services for businesses with regular shipping needs. You can set up daily, weekly, or custom pickup schedules to streamline your logistics operations."
        },
        {
          question: "Do you provide API integration?",
          answer: "Yes, we offer API integration for businesses that want to automate their shipping processes. Our API allows you to create shipments, track packages, generate labels, and access reporting data programmatically."
        }
      ]
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")'}}></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Find answers to common questions about our shipping services, tracking, pricing, and more.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* FAQ Categories */}
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <HelpCircle className="w-8 h-8 text-primary" />
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = `${categoryIndex}-${faqIndex}`;
                  return (
                    <Card key={faqIndex} className="shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader className="pb-4">
                        <CardTitle
                          className="text-lg cursor-pointer flex items-center justify-between hover:text-primary transition-colors"
                          onClick={() => toggleFAQ(globalIndex)}
                        >
                          <span>{faq.question}</span>
                          {openFAQ === globalIndex ? (
                            <ChevronUp className="w-5 h-5 text-primary" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      {openFAQ === globalIndex && (
                        <CardContent className="pt-0">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Still Need Help Section */}
          <Card className="bg-gradient-to-r from-primary to-blue-600 text-white shadow-xl">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Still Need Help?</h3>
              <p className="text-lg mb-6 opacity-90">
                Can't find the answer you're looking for? Our customer service team is here to help.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                  <Phone className="w-8 h-8 mb-3" />
                  <h4 className="font-semibold mb-2">Call Us</h4>
                  <p className="text-sm opacity-90">+1-678-842-3655</p>
                  <p className="text-xs opacity-75">Mon-Fri 8AM-6PM EST</p>
                </div>
                <div className="flex flex-col items-center">
                  <Mail className="w-8 h-8 mb-3" />
                  <h4 className="font-semibold mb-2">Email Us</h4>
                  <p className="text-sm opacity-90">support@rushdelivery.com</p>
                  <p className="text-xs opacity-75">24/7 Response</p>
                </div>
                <div className="flex flex-col items-center">
                  <MessageCircle className="w-8 h-8 mb-3" />
                  <h4 className="font-semibold mb-2">Live Chat</h4>
                  <p className="text-sm opacity-90">Available 24/7</p>
                  <p className="text-xs opacity-75">Average response: 2 min</p>
                </div>
              </div>
              <div className="mt-6">
                <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Start Live Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
