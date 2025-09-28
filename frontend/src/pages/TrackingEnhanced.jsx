import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { MapPin, Phone, Mail, Clock, Package, Truck, CheckCircle, ArrowRight, Calendar, User, Weight, Search, Copy, Share2, Download, Map, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '@/config/api';
import LiveMap from '@/components/LiveMap';

export default function TrackingEnhanced() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState(searchParams.get('trackingId') || '');
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [offlineUsed, setOfflineUsed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!trackingId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a tracking ID",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError('');
    setParcel(null);
    setOfflineUsed(false);

    try {
      const response = await axios.get(`${API_BASE_URL}/parcels/${trackingId}`);
      setParcel(response.data);
      toast({
        title: "Success",
        description: "Tracking information found"
      });
    } catch (err) {
      console.error('Error fetching parcel:', err);

      // Try offline data if online fails
      const offlineData = localStorage.getItem(`parcel_${trackingId}`);
      if (offlineData) {
        setParcel(JSON.parse(offlineData));
        setOfflineUsed(true);
        toast({
          title: "Offline Mode",
          description: "Showing offline data"
        });
        return;
      }

      if (err.response?.status === 404) {
        setError('Tracking ID not found');
        toast({
          title: "Not Found",
          description: "Tracking ID not found",
          variant: "destructive"
        });
      } else {
        setError('Error fetching tracking information');
        toast({
          title: "Error",
          description: "Failed to fetch tracking information",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/tracking?trackingId=${trackingId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Success",
        description: "Tracking link copied to clipboard"
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Unable to copy link",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    if (!parcel) return;

    const data = {
      trackingId: parcel.tracking_id,
      status: parcel.status,
      origin: parcel.origin,
      destination: parcel.destination,
      estimatedDelivery: parcel.estimated_delivery,
      currentLocation: parcel.current_location,
      history: parcel.history || []
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tracking-${trackingId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Success",
      description: "Tracking data downloaded"
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await handleSearch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")'}}></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Advanced Tracking</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Real-time tracking with live map updates, detailed history, and comprehensive delivery information.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5" />
              <span>Live map tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              <span>Real-time updates</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Offline support</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Search Section */}
          <Card className="shadow-xl border-0 mb-8">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Search className="w-6 h-6 text-primary" />
                Track Your Package
              </CardTitle>
              <p className="text-gray-600">Enter your tracking number for advanced tracking features.</p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  type="text"
                  placeholder="Enter tracking number (e.g., RD123456789)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Track Package
                    </>
                  )}
                </Button>
                {parcel && (
                  <Button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    variant="outline"
                    size="lg"
                  >
                    <RefreshCw className={`mr-2 h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Offline Indicator */}
          {offlineUsed && (
            <Card className="border-yellow-200 bg-yellow-50 mb-8">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-yellow-700">
                  <WifiOff className="w-5 h-5" />
                  <span>Showing offline data. Connect to internet for latest updates.</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <Card className="border-red-200 bg-red-50 mb-8">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Parcel Details */}
          {parcel && (
            <div className="space-y-8">
              {/* Main Tracking Info */}
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Package className="w-6 h-6 text-primary" />
                    Tracking Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Tracking Number</label>
                        <p className="text-lg font-semibold">{parcel.tracking_id}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${parcel.status === 'delivered' ? 'bg-green-500' : parcel.status === 'in_transit' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                          <span className="text-lg font-semibold capitalize">{parcel.status ? parcel.status.replace('_', ' ') : 'Unknown'}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Estimated Delivery</label>
                        <p className="text-lg">{new Date(parcel.estimated_delivery).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">From</label>
                        <p className="text-lg">{parcel.origin}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">To</label>
                        <p className="text-lg">{parcel.destination}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Current Location</label>
                        <p className="text-lg">{parcel.current_location || 'Not available'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 mt-8">
                    <Button onClick={handleShare} variant="outline" className="flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Share Tracking
                    </Button>
                    <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Live Map */}
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Map className="w-5 h-5 text-primary" />
                    Live Tracking Map
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <LiveMap parcel={parcel} />
                </CardContent>
              </Card>

              {/* Tracking History */}
              {parcel.history && parcel.history.length > 0 && (
                <Card className="shadow-xl border-0">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Tracking History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      {parcel.history.map((event, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-primary rounded-full"></div>
                            {index < parcel.history.length - 1 && <div className="w-0.5 h-8 bg-gray-300 mt-2"></div>}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{event.status}</h4>
                              <span className="text-sm text-gray-600">{new Date(event.timestamp).toLocaleString()}</span>
                            </div>
                            <p className="text-gray-600 mt-1">{event.location}</p>
                            {event.description && <p className="text-sm text-gray-500 mt-1">{event.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

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
