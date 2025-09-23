import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Users, Package, Truck, DollarSign, TrendingUp, AlertTriangle,
  MapPin, Clock, CheckCircle, XCircle, Eye, Settings, BarChart3,
  Shield, Activity, Globe, Phone, Mail, Calendar, Filter, RefreshCw,
  LogOut, User
} from 'lucide-react';
import API_BASE_URL from '@/config/api';

function StatCard({ title, value, icon: Icon, trend, color = "blue", isLoading = false }) {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    purple: "text-purple-600 bg-purple-100",
    orange: "text-orange-600 bg-orange-100"
  };

  if (isLoading) {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="p-3 rounded-full bg-gray-200 animate-pulse">
              <div className="w-6 h-6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '+' : ''}{trend}% from last month
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentActivity({ activities, isLoading = false }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg animate-pulse">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.isArray(activities) && activities.length > 0 ? activities.map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-gray-600">{activity.time}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.status}</span>
            </div>
          )) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActions({ onAction }) {
  const actions = [
    { label: 'New Shipment', icon: Package, color: 'bg-blue-500', action: 'new-shipment' },
    { label: 'Schedule Pickup', icon: Calendar, color: 'bg-green-500', action: 'schedule-pickup' },
    { label: 'View Reports', icon: BarChart3, color: 'bg-purple-500', action: 'view-reports' },
    { label: 'Manage Users', icon: Users, color: 'bg-orange-500', action: 'manage-users' },
    { label: 'Fleet Status', icon: Truck, color: 'bg-red-500', action: 'fleet-status' },
    { label: 'System Settings', icon: Settings, color: 'bg-gray-500', action: 'system-settings' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-20 flex flex-col items-center gap-2 hover:bg-gray-50"
              onClick={() => onAction(action.action)}
            >
              <div className={`p-2 rounded-lg ${action.color} text-white`}>
                <action.icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ActiveShipments({ shipments, isLoading = false, onViewShipment }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-green-600 bg-green-100';
      case 'Out for Delivery': return 'text-blue-600 bg-blue-100';
      case 'In Transit': return 'text-yellow-600 bg-yellow-100';
      case 'Processing': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Active Shipments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-32"></div>
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Active Shipments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.isArray(shipments) && shipments.length > 0 ? shipments.map((shipment) => (
            <div key={shipment.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{shipment.tracking_id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                    {shipment.status}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  <span>{shipment.sender} → {shipment.receiver}</span>
                  <span className="ml-2">Driver: {shipment.driver || 'Unassigned'}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onViewShipment(shipment)}>
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          )) : (
            <p className="text-gray-500 text-center py-4">No active shipments</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function AlertsNotifications({ alerts, isLoading = false }) {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      case 'success': return CheckCircle;
      default: return AlertTriangle;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'success': return 'text-green-600 bg-green-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Alerts & Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 border rounded-lg animate-pulse">
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Alerts & Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.isArray(alerts) && alerts.length > 0 ? alerts.map((alert, index) => {
            const Icon = getAlertIcon(alert.type);
            return (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className={`p-1 rounded-full ${getAlertColor(alert.type)}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
              </div>
            );
          }) : (
            <p className="text-gray-500 text-center py-4">No alerts</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Admin() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: { total_shipments: 0, active_drivers: 0, revenue_today: 0, on_time_delivery: 0 },
    shipments: [],
    activities: [],
    alerts: []
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const wsRef = useRef(null);

  // Check admin access key
  useEffect(() => {
    const adminKey = localStorage.getItem('adminKey');
    if (!adminKey || adminKey !== '985d638bafbb39fb') {
      toast({
        title: 'Admin Access Required',
        description: 'Please enter the admin access key to continue',
        variant: 'destructive'
      });
      navigate('/');
      return;
    }

    fetchDashboardData();
    setupWebSocket();
  }, [navigate, toast]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all dashboard data in parallel
      const [statsResponse, activitiesResponse, alertsResponse, shipmentsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/dashboard/stats`, { headers }),
        axios.get(`${API_BASE_URL}/dashboard/activities`, { headers }),
        axios.get(`${API_BASE_URL}/dashboard/alerts`, { headers }),
        axios.get(`${API_BASE_URL}/dashboard/shipments`, { headers })
      ]);

      setDashboardData({
        stats: statsResponse.data,
        activities: activitiesResponse.data,
        alerts: alertsResponse.data,
        shipments: shipmentsResponse.data
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  };

  const setupWebSocket = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Connect to WebSocket for real-time updates
      const wsUrl = API_BASE_URL.replace('http', 'ws') + '/ws/dashboard';
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Reconnect after 5 seconds
        setTimeout(setupWebSocket, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      wsRef.current = ws;

    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  };

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'heartbeat':
        // Update connection status
        break;
      case 'parcel_update':
        // Update shipments in real-time
        setDashboardData(prev => ({
          ...prev,
          shipments: prev.shipments.map(shipment =>
            shipment.id === data.data.id ? data.data : shipment
          ),
          activities: [data.data, ...prev.activities.slice(0, 9)] // Add to activities
        }));
        break;
      case 'new_parcel':
        // Add new shipment
        setDashboardData(prev => ({
          ...prev,
          shipments: [data.data, ...prev.shipments],
          stats: {
            ...prev.stats,
            total_shipments: prev.stats.total_shipments + 1
          },
          activities: [data.data, ...prev.activities.slice(0, 9)]
        }));
        break;
      default:
        break;
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setIsRefreshing(false);
    toast({ title: 'Refreshed', description: 'Dashboard data updated' });
  };

  const handleAction = (action) => {
    switch (action) {
      case 'new-shipment':
        navigate('/schedule');
        break;
      case 'schedule-pickup':
        navigate('/schedule');
        break;
      case 'view-reports':
        toast({ title: 'Coming Soon', description: 'Reports feature will be available soon' });
        break;
      case 'manage-users':
        toast({ title: 'Coming Soon', description: 'User management will be available soon' });
        break;
      case 'fleet-status':
        toast({ title: 'Coming Soon', description: 'Fleet status will be available soon' });
        break;
      case 'system-settings':
        toast({ title: 'Coming Soon', description: 'System settings will be available soon' });
        break;
      default:
        break;
    }
  };

  const handleViewShipment = (shipment) => {
    navigate(`/tracking?trackingId=${shipment.tracking_id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminKey');
    if (wsRef.current) {
      wsRef.current.close();
    }
    navigate('/');
    toast({ title: 'Admin access cleared', description: 'You have been logged out of admin mode' });
  };

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Real-time logistics management and monitoring</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button size="sm" variant="destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Shipments"
            value={dashboardData.stats.total_shipments?.toLocaleString() || '0'}
            icon={Package}
            trend={12}
            color="blue"
            isLoading={isLoading}
          />
          <StatCard
            title="Active Drivers"
            value={dashboardData.stats.active_drivers?.toString() || '0'}
            icon={Users}
            trend={8}
            color="green"
            isLoading={isLoading}
          />
          <StatCard
            title="Revenue Today"
            value={`$${dashboardData.stats.revenue_today?.toLocaleString() || '0'}`}
            icon={DollarSign}
            trend={23}
            color="purple"
            isLoading={isLoading}
          />
          <StatCard
            title="On-Time Delivery"
            value={`${dashboardData.stats.on_time_delivery || 0}%`}
            icon={TrendingUp}
            trend={2}
            color="orange"
            isLoading={isLoading}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <ActiveShipments
              shipments={dashboardData.shipments}
              isLoading={isLoading}
              onViewShipment={handleViewShipment}
            />
            <QuickActions onAction={handleAction} />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <RecentActivity
              activities={dashboardData.activities}
              isLoading={isLoading}
            />
            <AlertsNotifications
              alerts={dashboardData.alerts}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/')}>
            <CardContent className="p-6 text-center">
              <Globe className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Live Map</h3>
              <p className="text-sm text-gray-600">Real-time fleet tracking</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleAction('view-reports')}>
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Analytics</h3>
              <p className="text-sm text-gray-600">Performance insights</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleAction('system-settings')}>
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Security</h3>
              <p className="text-sm text-gray-600">System monitoring</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleAction('manage-users')}>
            <CardContent className="p-6 text-center">
              <Phone className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Support</h3>
              <p className="text-sm text-gray-600">Customer assistance</p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-600">
          <p>Last updated: {new Date().toLocaleString()}</p>
          <p className="text-sm mt-2">Rush Delivery Admin Dashboard v2.1.0 - Real-time Data</p>
        </div>
      </div>
    </div>
  );
}
