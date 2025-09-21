import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { tamilNaduBoundary } from '../data/tamilNaduBoundary';

// Fix default Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface GISMapProps {
  selectedGeometry: any;
  onGeometrySelect: (geometry: any) => void;
  onMapClick: (clickInfo: { lat: number; lng: number; address?: string; loading?: boolean }) => void;
}

const GISMap: React.FC<GISMapProps> = ({ selectedGeometry, onGeometrySelect, onMapClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

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

      const geoJsonLayer = L.geoJSON(tamilNaduBoundary as any, {
        style: boundaryStyle,
        onEachFeature: (feature, layer) => {
          layer.on({
            click: () => {
              onGeometrySelect(feature);
            },
          });
        },
      }).addTo(map);

      // Fit map to Tamil Nadu boundary
      map.fitBounds(geoJsonLayer.getBounds());

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

  // Handle selected geometry updates
  useEffect(() => {
    if (!leafletMapRef.current || !selectedGeometry) return;

    // Remove previous markers
    leafletMapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) leafletMapRef.current?.removeLayer(layer);
    });

    if (selectedGeometry.geometry.type === 'Point') {
      const coords = selectedGeometry.geometry.coordinates;
      const marker = L.marker([coords[1], coords[0]]).addTo(leafletMapRef.current);
      marker.bindPopup(selectedGeometry.properties.name || 'Selected Location').openPopup();

      // Pan to marker
      leafletMapRef.current.setView([coords[1], coords[0]], 10);
    }
  }, [selectedGeometry]);

  return (
    <div className="relative w-full h-[500px]"> {/* Fixed height to prevent _leaflet_pos error */}
      <div ref={mapRef} className="w-full h-full rounded-lg border border-border" />
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GISMap;
