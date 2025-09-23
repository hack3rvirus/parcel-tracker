import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Lock, Globe, Users, Mail, Phone, MapPin, Calendar, FileText, AlertTriangle } from 'lucide-react';

export default function Privacy() {
  const lastUpdated = "December 2024";

  const sections = [
    { id: 'overview', title: 'Overview', icon: <Eye className="w-4 h-4" /> },
    { id: 'collection', title: 'Information We Collect', icon: <FileText className="w-4 h-4" /> },
    { id: 'usage', title: 'How We Use Your Information', icon: <Shield className="w-4 h-4" /> },
    { id: 'sharing', title: 'Information Sharing & Disclosure', icon: <Users className="w-4 h-4" /> },
    { id: 'security', title: 'Data Security & Protection', icon: <Lock className="w-4 h-4" /> },
    { id: 'retention', title: 'Data Retention & Deletion', icon: <Calendar className="w-4 h-4" /> },
    { id: 'rights', title: 'Your Privacy Rights', icon: <Shield className="w-4 h-4" /> },
    { id: 'cookies', title: 'Cookies & Tracking Technologies', icon: <Eye className="w-4 h-4" /> },
    { id: 'international', title: 'International Data Transfers', icon: <Globe className="w-4 h-4" /> },
    { id: 'children', title: 'Children\'s Privacy', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'changes', title: 'Changes to This Policy', icon: <FileText className="w-4 h-4" /> },
    { id: 'contact', title: 'Contact Information', icon: <Mail className="w-4 h-4" /> },
  ];

  const dataCategories = [
    {
      category: "Account & Profile Information",
      examples: ["Name, email address, phone number", "Account preferences and settings", "Profile picture (if uploaded)", "Business information (for enterprise accounts)"],
      purpose: "Account management, personalized services, communication"
    },
    {
      category: "Shipping & Delivery Data",
      examples: ["Sender and recipient names, addresses, phone numbers", "Package details (weight, dimensions, description)", "Tracking numbers and delivery status", "Pickup and delivery schedules"],
      purpose: "Package processing, tracking, delivery coordination"
    },
    {
      category: "Payment & Billing Information",
      examples: ["Payment method details (processed securely)", "Billing address and contact information", "Transaction history and invoices", "Subscription and plan details"],
      purpose: "Payment processing, billing, account management"
    },
    {
      category: "Technical & Usage Data",
      examples: ["IP address and location data", "Device and browser information", "App usage patterns and preferences", "Performance and error logs"],
      purpose: "Service improvement, security, troubleshooting"
    },
    {
      category: "Communication Data",
      examples: ["Customer support interactions", "Feedback and survey responses", "Marketing communications preferences", "Notification settings"],
      purpose: "Customer support, service improvement, marketing"
    }
  ];

  return (
    <div className="pt-20 p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Shield className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
          At Rush Delivery, we are committed to protecting your privacy and ensuring the security of your personal information.
          This policy explains how we collect, use, and safeguard your data.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
