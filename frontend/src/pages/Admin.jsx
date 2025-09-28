import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Package, MapPin } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '@/config/api';
import LiveMap from '@/components/LiveMap';

export default function Admin() {
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch parcels
  const { data: parcels = [], isLoading, refetch } = useQuery({
    queryKey: ['parcels'],
    queryFn: async () => {
      const adminKey = localStorage.getItem('adminKey');
      const response = await axios.get(`${API_BASE_URL}/parcels`, {
        headers: { Authorization: `Bearer ${adminKey}` }
      });
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/ws/dashboard`);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsConnected(true);
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'parcel_update' || data.type === 'new_parcel') {
            queryClient.invalidateQueries(['parcels']);
            toast({
              title: data.type === 'new_parcel' ? "New Parcel Created" : "Parcel Updated",
              description: `Parcel ${data.data?.tracking_id || data.parcel?.tracking_id} ${data.type === 'new_parcel' ? 'has been scheduled' : 'status changed'}`,
            });
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };

      ws.onclose = () => {
        setWsConnected(false);
        console.log('WebSocket disconnected, reconnecting...');
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [queryClient, toast]);

  const handleStatusChange = async (parcelId, newStatus) => {
    try {
      const adminKey = localStorage.getItem('adminKey');
      await axios.put(`${API_BASE_URL}/parcels/${parcelId}`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${adminKey}` }
      });

      queryClient.invalidateQueries(['parcels']);
      toast({
        title: "Success",
        description: `Parcel status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating parcel status:', error);
      toast({
        title: "Error",
        description: "Failed to update parcel status",
        variant: "destructive"
      });
    }
  };

  const handleMapClick = async (lat, lng) => {
    if (selectedParcel) {
      try {
        const adminKey = localStorage.getItem('adminKey');
        await axios.put(`${API_BASE_URL}/parcels/${selectedParcel.id}`, {
          location: { lat, lng }
        }, {
          headers: { Authorization: `Bearer ${adminKey}` }
        });

        queryClient.invalidateQueries(['parcels']);
        toast({
          title: "Success",
          description: "Parcel location updated successfully",
        });
      } catch (error) {
        console.error('Error updating parcel location:', error);
        toast({
          title: "Error",
          description: "Failed to update parcel location",
          variant: "destructive"
        });
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-500';
      case 'out for delivery': return 'bg-orange-500';
      case 'in transit': return 'bg-blue-500';
      case 'on the way': return 'bg-indigo-500';
      case 'moving': return 'bg-green-500';
      case 'processing': return 'bg-yellow-500';
      case 'pending': return 'bg-gray-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading parcels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {wsConnected ? 'Live' : 'Offline'}
              </span>
            </div>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Parcels List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Parcels</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Array.isArray(parcels) ? parcels.map((parcel) => (
                <Card
                  key={parcel.id}
                  className={`cursor-pointer transition-colors ${selectedParcel?.id === parcel.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                  onClick={() => setSelectedParcel(parcel)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm">{parcel.tracking_id}</h3>
                      <Badge className={`${getStatusColor(parcel.status)} text-white`} variant="secondary">{parcel.status}</Badge>
                    </div>
                    <p className="text-xs text-gray-600">
                      {parcel.sender} → {parcel.receiver}
                    </p>
                  </CardContent>
                </Card>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No parcels found</p>
                </div>
              )}
            </div>
          </div>

          {/* Parcel Details and Controls */}
          <div className="lg:col-span-1">
            {selectedParcel ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedParcel.tracking_id}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">From: {selectedParcel.sender}</p>
                      <p className="text-sm text-gray-600">To: {selectedParcel.receiver}</p>
                      <p className="text-sm text-gray-600">Status: <Badge className={`${getStatusColor(selectedParcel.status)} text-white`} variant="secondary">{selectedParcel.status}</Badge></p>
                      <p className="text-sm text-gray-600">Location: {selectedParcel.location?.lat?.toFixed(4)}, {selectedParcel.location?.lng?.toFixed(4)}</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Update Status</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant={selectedParcel.status === 'pending' ? 'default' : 'outline'}
                          onClick={() => handleStatusChange(selectedParcel.id, 'pending')}
                        >
                          Pending
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedParcel.status === 'processing' ? 'default' : 'outline'}
                          onClick={() => handleStatusChange(selectedParcel.id, 'processing')}
                        >
                          Processing
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedParcel.status === 'on the way' ? 'default' : 'outline'}
                          onClick={() => handleStatusChange(selectedParcel.id, 'on the way')}
                        >
                          On the Way
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedParcel.status === 'delivered' ? 'default' : 'outline'}
                          onClick={() => handleStatusChange(selectedParcel.id, 'delivered')}
                        >
                          Delivered
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  Select a parcel to view details and manage
                </CardContent>
              </Card>
            )}
          </div>

          {/* Live Map */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Live Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <LiveMap
                    parcel={selectedParcel}
                    parcels={parcels}
                    drivers={[]}
                    isAdmin={true}
                    editingMode={!!selectedParcel}
                    onMapClick={handleMapClick}
                  />
                </div>
                {selectedParcel && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Click anywhere on the map to update the parcel location
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
