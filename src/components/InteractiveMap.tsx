import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { tamilNaduBoundary } from '../data/tamilNaduBoundary';
import { mockLocations, filterLocations, getCropColor, getFertilityColor, LocationData } from '../data/locationData';
import { FilterCriteria } from './SimpleFilterPanel';

// Fix default Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  selectedGeometry: any;
  onGeometrySelect: (geometry: any) => void;
  onMapClick: (clickInfo: { lat: number; lng: number; address?: string; loading?: boolean }) => void;
  filters: FilterCriteria;
  onLocationSelect?: (location: LocationData) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  selectedGeometry,
  onGeometrySelect,
  onMapClick,
  filters,
  onLocationSelect
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [visibleLocations, setVisibleLocations] = useState<LocationData[]>([]);

  // Filter locations based on active filters - only show when filters are active
  const filteredLocations = useMemo(() => {
    // Check if any filters are active
    const hasActiveFilters = Object.keys(filters).some(key => {
      const value = filters[key as keyof FilterCriteria];
      return value !== undefined && value !== '' && value !== null &&
             (Array.isArray(value) ? value.length > 0 : true);
    });

    // Only return filtered locations if filters are active
    if (!hasActiveFilters) {
      return [];
    }

    return filterLocations(mockLocations, filters);
  }, [filters]);

  // Update visible locations when filtered locations change
  useEffect(() => {
    setVisibleLocations(filteredLocations);
  }, [filteredLocations]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    try {
      // Initialize the map
      const map = L.map(mapRef.current, {
        center: [11.1271, 78.6569],
        zoom: 7,
        zoomControl: true,
      });

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add Tamil Nadu boundary
      const boundaryStyle = {
        color: '#228B22',
        weight: 2,
        opacity: 0.8,
        fillColor: '#228B22',
        fillOpacity: 0.1,
      };

      L.geoJSON(tamilNaduBoundary as any, {
        style: boundaryStyle,
      }).addTo(map);

      // Map click handler
      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;

        // Show loading state in panel
        onMapClick({ lat, lng, loading: true });

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          const address = data.display_name || 'Address not found';
          onMapClick({ lat, lng, address, loading: false });
        } catch (error) {
          console.error('Reverse geocoding failed:', error);
          onMapClick({ lat, lng, address: 'Address lookup failed', loading: false });
        }
      });

      leafletMapRef.current = map;
      setIsMapReady(true);

      return () => {
        map.remove();
        leafletMapRef.current = null;
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [onGeometrySelect, onMapClick]);

  // Update markers when visible locations change
  useEffect(() => {
    if (!leafletMapRef.current || !isMapReady) return;

    const map = leafletMapRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      map.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers for visible locations
    visibleLocations.forEach((location) => {
      const markerColor = getCropColor(location.cropType);

      // Create custom icon with crop-specific color
      const customIcon = L.divIcon({
        html: `
          <div style="
            background-color: ${markerColor};
            width: 20px;
            height: 20px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>
        `,
        className: 'custom-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 20],
        popupAnchor: [0, -20]
      });

      const marker = L.marker([location.latitude, location.longitude], {
        icon: customIcon
      }).addTo(map);

      // Create popup content
      const popupContent = `
        <div class="location-popup" style="min-width: 200px;">
          <h4 style="margin: 0 0 8px 0; color: #333; font-weight: bold;">${location.name}</h4>
          <div style="font-size: 12px; line-height: 1.4;">
            <p style="margin: 4px 0;"><strong>Crop:</strong> ${location.cropType}</p>
            <p style="margin: 4px 0;"><strong>Soil:</strong> ${location.soilType}</p>
            <p style="margin: 4px 0;"><strong>Fertility:</strong> ${location.fertility}</p>
            <p style="margin: 4px 0;"><strong>NPK:</strong> N:${location.npk.nitrogen.toFixed(1)}, P:${location.npk.phosphorus.toFixed(1)}, K:${location.npk.potassium.toFixed(1)}</p>
            <p style="margin: 4px 0;"><strong>NDVI:</strong> ${location.ndvi}</p>
            <p style="margin: 4px 0;"><strong>Area:</strong> ${location.area} ha</p>
            <p style="margin: 4px 0;"><strong>Yield:</strong> ${location.yield} t/ha</p>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      // Add click handler
      marker.on('click', () => {
        if (onLocationSelect) {
          onLocationSelect(location);
        }
      });

      markersRef.current.push(marker);
    });

    // Auto-fit map to show all markers
    if (visibleLocations.length > 0) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds(), { padding: [20, 20] });
    }

  }, [visibleLocations, isMapReady, onLocationSelect]);

  // Handle selected geometry updates
  useEffect(() => {
    if (!leafletMapRef.current || !selectedGeometry) return;

    if (selectedGeometry.geometry.type === 'Point') {
      const coords = selectedGeometry.geometry.coordinates;
      const marker = L.marker([coords[1], coords[0]]).addTo(leafletMapRef.current);
      marker.bindPopup(selectedGeometry.properties.name || 'Selected Location').openPopup();

      // Pan to marker
      leafletMapRef.current.setView([coords[1], coords[0]], 10);
    }
  }, [selectedGeometry]);

  return (
    <div className="relative w-full h-[500px]">
      <div ref={mapRef} className="w-full h-full rounded-lg border border-border" />
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
        <h4 className="text-sm font-semibold mb-2">Crop Types</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#22c55e' }}></div>
            <span>Rice</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#eab308' }}></div>
            <span>Wheat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f97316' }}></div>
            <span>Cotton</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#8b5cf6' }}></div>
            <span>Sugarcane</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#06b6d4' }}></div>
            <span>Maize</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ef4444' }}></div>
            <span>Tomato</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            {Object.keys(filters).some(key => {
              const value = filters[key as keyof FilterCriteria];
              return value !== undefined && value !== '' && value !== null &&
                     (Array.isArray(value) ? value.length > 0 : true);
            })
              ? `Showing ${visibleLocations.length} of ${mockLocations.length} locations`
              : 'Set filters to view locations'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
