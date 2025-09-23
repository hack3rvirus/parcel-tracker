import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Truck, Package, Navigation, RefreshCw, Maximize2 } from 'lucide-react';

function MapMarker({ type, label, position, status = 'active' }) {
  const getIcon = () => {
    switch (type) {
      case 'driver': return Truck;
      case 'package': return Package;
      case 'destination': return MapPin;
      default: return MapPin;
    }
  };

  const getColor = () => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  const Icon = getIcon();

  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 ${getColor()}`}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      <div className="relative">
        <Icon className="w-6 h-6 drop-shadow-lg" />
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {label}
        </div>
      </div>
    </div>
  );
}

export default function LiveMap() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock data for demonstration
  const [mapData, setMapData] = useState({
    drivers: [
      { id: 1, name: 'John Smith', position: { x: 25, y: 30 }, status: 'active', route: 'Route A' },
      { id: 2, name: 'Sarah Johnson', position: { x: 60, y: 45 }, status: 'active', route: 'Route B' },
      { id: 3, name: 'Mike Davis', position: { x: 80, y: 70 }, status: 'warning', route: 'Route C' }
    ],
    packages: [
      { id: 'PKG001', position: { x: 35, y: 40 }, status: 'in-transit', destination: 'Downtown' },
      { id: 'PKG002', position: { x: 70, y: 55 }, status: 'delivered', destination: 'Airport' },
      { id: 'PKG003', position: { x: 45, y: 25 }, status: 'pending', destination: 'Mall' }
    ],
    destinations: [
      { id: 1, name: 'Downtown Hub', position: { x: 40, y: 35 } },
      { id: 2, name: 'Airport Terminal', position: { x: 75, y: 60 } },
      { id: 3, name: 'Shopping Center', position: { x: 50, y: 20 } }
    ]
  });

  const refreshData = () => {
    setLastUpdate(new Date());
    // In a real app, this would fetch new data from the API
    setMapData(prev => ({
      ...prev,
      drivers: prev.drivers.map(driver => ({
        ...driver,
        position: {
          x: Math.max(10, Math.min(90, driver.position.x + (Math.random() - 0.5) * 10)),
          y: Math.max(10, Math.min(90, driver.position.y + (Math.random() - 0.5) * 10))
        }
      }))
    }));
  };

  useEffect(() => {
    const interval = setInterval(refreshData, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Card className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Navigation className="w-5 h-5" />
          Live Fleet Tracking
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-b-lg overflow-hidden">
          {/* Map Background */}
          <div className="relative w-full h-96 md:h-[500px] bg-gradient-to-br from-blue-100 via-green-50 to-blue-100">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" className="absolute inset-0">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Map Markers */}
            {mapData.drivers.map(driver => (
              <MapMarker
                key={driver.id}
                type="driver"
                label={`${driver.name} - ${driver.route}`}
                position={driver.position}
                status={driver.status}
              />
            ))}

            {mapData.packages.map(pkg => (
              <MapMarker
                key={pkg.id}
                type="package"
                label={`${pkg.id} - ${pkg.destination}`}
                position={pkg.position}
                status={pkg.status}
              />
            ))}

            {mapData.destinations.map(dest => (
              <MapMarker
                key={dest.id}
                type="destination"
                label={dest.name}
                position={dest.position}
                status="active"
              />
            ))}

            {/* Route Lines (simplified) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7"
                 refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
                </marker>
              </defs>

              {/* Driver routes */}
              {mapData.drivers.map(driver => (
                <line
                  key={`route-${driver.id}`}
                  x1={`${driver.position.x}%`}
                  y1={`${driver.position.y}%`}
                  x2={`${Math.max(10, Math.min(90, driver.position.x + 20))}%`}
                  y2={`${Math.max(10, Math.min(90, driver.position.y + 15))}%`}
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  markerEnd="url(#arrowhead)"
                  opacity="0.6"
                />
              ))}
            </svg>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <h4 className="font-semibold text-sm mb-2">Legend</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-3 h-3 text-blue-500" />
                <span>Active Drivers</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-3 h-3 text-green-500" />
                <span>Packages</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-red-500" />
                <span>Destinations</span>
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="text-xs space-y-1">
              <div className="flex justify-between gap-4">
                <span>Active Drivers:</span>
                <span className="font-semibold">{mapData.drivers.length}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>In Transit:</span>
                <span className="font-semibold">{mapData.packages.filter(p => p.status === 'in-transit').length}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Delivered:</span>
                <span className="font-semibold">{mapData.packages.filter(p => p.status === 'delivered').length}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
