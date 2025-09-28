import { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Truck, Package, Navigation, RefreshCw, Maximize2, Edit3, Save, X } from 'lucide-react';
import API_BASE_URL from '@/config/api';
import axios from 'axios';

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

export default function LiveMap({ parcel = null, isAdmin = false, parcels = [], drivers = [], onMapClick = null, editingMode = false }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isEditMode, setIsEditMode] = useState(editingMode);
  const [draggedMarker, setDraggedMarker] = useState(null);
  const mapRef = useRef(null);

  // Update edit mode when prop changes
  useEffect(() => {
    setIsEditMode(editingMode);
  }, [editingMode]);

  // Convert real data to map coordinates
  const convertToMapCoords = (lat, lng) => {
    // Simple conversion - in production you'd use proper map projection
    const x = ((lng + 180) / 360) * 100; // Normalize longitude to 0-100
    const y = ((90 - lat) / 180) * 100; // Normalize latitude to 0-100 (inverted)
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  // Convert parcels and drivers to map format
  const mapData = useMemo(() => {
    let mapParcels = Array.isArray(parcels) ? parcels.map(p => ({
      id: p.tracking_id,
      position: p.location ? convertToMapCoords(p.location.lat, p.location.lng) : { x: 50, y: 50 },
      status: p.status ? p.status.toLowerCase().replace(' ', '-') : 'unknown',
      destination: p.receiver || 'Destination',
      parcelData: p // Keep full parcel data for updates
    })) : [];

    let mapDestinations = [];

    // Handle single parcel tracking
    if (!mapParcels.length && parcel) {
      const position = parcel.location ? convertToMapCoords(parcel.location.lat, parcel.location.lng) : { x: 50, y: 50 };
      const singleParcel = {
        id: parcel.tracking_id,
        position,
        status: parcel.status ? parcel.status.toLowerCase().replace(' ', '-') : 'unknown',
        destination: parcel.receiver || 'Destination',
        parcelData: parcel
      };
      mapParcels = [singleParcel];

      // Add estimated destination for route visualization
      const destPosition = { x: Math.min(100, position.x + 15), y: Math.min(100, position.y + 10) };
      mapDestinations = [{
        id: 1,
        name: parcel.receiver || 'Delivery Address',
        position: destPosition
      }];
    }

    const mapDrivers = Array.isArray(drivers) ? drivers.map(d => ({
      id: d.id,
      name: d.name,
      position: d.current_location ? convertToMapCoords(d.current_location.lat, d.current_location.lng) : { x: 50, y: 50 },
      status: d.status,
      route: `Route ${d.id.slice(-1)}`
    })) : [];

    return {
      drivers: mapDrivers,
      packages: mapParcels,
      destinations: mapDestinations
    };
  }, [parcels, drivers, parcel]);

  const refreshData = () => {
    setLastUpdate(new Date());
    // In real implementation, this would trigger a data refresh
    // For now, just update the timestamp
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleMarkerDragStart = async (pkgId, e) => {
    if (!isAdmin || !isEditMode) return;

    e.preventDefault();
    setDraggedMarker(pkgId);

    const handleMouseMove = () => {
      if (draggedMarker !== pkgId) return;

      // Visual feedback during drag - could update local state if needed
      // For now, we'll just handle the final position update
    };

    const handleMouseUp = async (e) => {
      if (draggedMarker !== pkgId) return;

      const rect = mapRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const clampedX = Math.max(0, Math.min(100, x));
      const clampedY = Math.max(0, Math.min(100, y));

      // Convert back to lat/lng coordinates
      const lat = 90 - (clampedY / 100) * 180; // Reverse the conversion
      const lng = (clampedX / 100) * 360 - 180;

      setDraggedMarker(null);

      // Find the full parcel data using tracking_id
      const fullParcel = mapData.packages.find(p => p.id === pkgId)?.parcelData;
      if (!fullParcel) {
        console.error('Parcel not found for update');
        return;
      }

      const parcelId = fullParcel.id; // UUID

      // Send update to backend via API
      try {
        const adminKey = localStorage.getItem('adminKey') || localStorage.getItem('token');
        await axios.put(`${API_BASE_URL}/parcels/${parcelId}`, {
          location: { lat, lng }
        }, {
          headers: { Authorization: `Bearer ${adminKey}` }
        });

        // Trigger data refresh in parent component
        window.location.reload(); // Simple refresh for now
      } catch (error) {
        console.error('Failed to update parcel location:', error);
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Update route visualization when positions change
  useEffect(() => {
    if (parcel && mapData.packages.length > 0 && mapData.destinations.length > 0) {
      // Could add more complex route calculation here
      // For now, direct line from package to destination
    }
  }, [mapData.packages, mapData.destinations, parcel]);

  return (
    <Card className={`${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">
          {parcel ? `Tracking: ${parcel.tracking_id}` : 'Live Delivery Map'}
          {isEditMode && <span className="text-sm text-orange-600 ml-2">(Edit Mode)</span>}
        </CardTitle>
        <div className="flex gap-2">
          {isAdmin && parcel && (
            <Button
              variant={isEditMode ? "default" : "outline"}
              size="sm"
              onClick={toggleEditMode}
              className={isEditMode ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              {isEditMode ? <Save className="w-4 h-4 mr-1" /> : <Edit3 className="w-4 h-4 mr-1" />}
              {isEditMode ? 'Save' : 'Edit'}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={mapRef}
          className={`relative bg-gray-100 rounded-lg overflow-hidden ${isFullscreen ? 'h-screen' : 'h-96'} ${isEditMode ? 'cursor-crosshair' : ''}`}
          onClick={(e) => {
            if (isEditMode && onMapClick) {
              const rect = mapRef.current.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              const lat = 90 - (y / 100) * 180;
              const lng = (x / 100) * 360 - 180;
              onMapClick(lat, lng);
            }
          }}
        >
          {/* Mock Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
            {/* Grid lines for map effect */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={`h-${i}`} className="absolute w-full h-px bg-gray-400" style={{ top: `${i * 10}%` }} />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={`v-${i}`} className="absolute h-full w-px bg-gray-400" style={{ left: `${i * 10}%` }} />
              ))}
            </div>

            {/* Road network simulation */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
                </marker>
              </defs>

              {/* Main roads */}
              <line x1="10%" y1="20%" x2="90%" y2="20%" stroke="#6B7280" strokeWidth="3" />
              <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#6B7280" strokeWidth="3" />
              <line x1="10%" y1="80%" x2="90%" y2="80%" stroke="#6B7280" strokeWidth="3" />
              <line x1="20%" y1="10%" x2="20%" y2="90%" stroke="#6B7280" strokeWidth="3" />
              <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="#6B7280" strokeWidth="3" />
              <line x1="80%" y1="10%" x2="80%" y2="90%" stroke="#6B7280" strokeWidth="3" />

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

              {/* Parcel route if parcel is provided */}
              {parcel && mapData.packages.length > 0 && (
                <line
                  x1={`${mapData.packages[0].position.x}%`}
                  y1={`${mapData.packages[0].position.y}%`}
                  x2={`${mapData.destinations[0].position.x}%`}
                  y2={`${mapData.destinations[0].position.y}%`}
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeDasharray="8,4"
                  markerEnd="url(#arrowhead)"
                  opacity="0.8"
                />
              )}
            </svg>
          </div>

          {/* Map Markers */}
          {mapData.drivers.map(driver => (
            <MapMarker
              key={driver.id}
              type="driver"
              label={driver.name}
              position={driver.position}
              status={driver.status}
            />
          ))}

          {mapData.packages.map(pkg => (
            <div
              key={pkg.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 ${pkg.status === 'in-transit' ? 'text-green-500' : pkg.status === 'delivered' ? 'text-blue-500' : 'text-yellow-500'} ${isEditMode ? 'cursor-move' : ''}`}
              style={{ left: `${pkg.position.x}%`, top: `${pkg.position.y}%` }}
              onMouseDown={isEditMode ? (e) => handleMarkerDragStart(pkg.id, e) : undefined}
            >
              <div className="relative">
                <Package className="w-6 h-6 drop-shadow-lg" />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {parcel ? `Package ${pkg.id}` : pkg.id}
                </div>
              </div>
            </div>
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
              {parcel && (
                <div className="flex justify-between gap-4 border-t pt-1 mt-1">
                  <span>Status:</span>
                  <span className="font-semibold text-green-600">{parcel.status}</span>
                </div>
              )}
            </div>
          </div>

          {/* Last Update */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg">
            <p className="text-xs text-gray-600">
              Last update: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
