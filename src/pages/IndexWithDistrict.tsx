import React, { useState } from 'react';
import GISMap from '../components/GISMap';
import SearchPanel from '../components/SearchPanel';
import ResultsPanel from '../components/ResultsPanel';
import SimpleFilterPanel, { FilterCriteria } from '../components/SimpleFilterPanelWithDistrict';
import InteractiveMap from '../components/InteractiveMapWithDistrict';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Satellite, Menu } from 'lucide-react';
import { generateMockSoilData, generateMockRainfallData, generateMockNDVIData, cropDatabase } from '../data/tamilNaduBoundary';
import { LocationData } from '../data/locationData';

const Index = () => {
  const [selectedGeometry, setSelectedGeometry] = useState(null);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [clickInfo, setClickInfo] = useState<{
    lat: number;
    lng: number;
    address?: string;
    loading?: boolean;
  } | null>(null);
  const [filters, setFilters] = useState<FilterCriteria>({});
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  const handleLocationSearch = (location: any) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockResults = {
        isValid: true,
        location: location.name,
        soilData: generateMockSoilData(location),
        rainfallData: generateMockRainfallData(location),
        ndviData: generateMockNDVIData(location)
      };

      setResults(mockResults as any);
      setIsLoading(false);

      // Create a mock geometry point for the searched location
      const mockGeometry = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: location.coords
        },
        properties: {
          name: location.name
        }
      };
      setSelectedGeometry(mockGeometry as any);
    }, 1500);
  };

  const handleGeometrySelect = (geometry: any) => {
    setSelectedGeometry(geometry);
    setIsLoading(true);

    setTimeout(() => {
      const mockResults = {
        isValid: Math.random() > 0.3, // 70% chance of being valid
        location: geometry.properties?.name || 'Selected Area',
        soilData: generateMockSoilData(geometry),
        rainfallData: generateMockRainfallData(geometry),
        ndviData: generateMockNDVIData(geometry)
      };

      setResults(mockResults as any);
      setIsLoading(false);
    }, 1200);
  };

  const handleDrawModeToggle = () => {
    setIsDrawMode(!isDrawMode);
  };

  const handleMapClick = (clickInfo: { lat: number; lng: number; address?: string; loading?: boolean }) => {
    setClickInfo(clickInfo);
  };

  const handleFiltersChange = (newFilters: FilterCriteria) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location);
    setIsLoading(true);

    setTimeout(() => {
      const mockResults = {
        isValid: true,
        location: location.name,
        soilData: generateMockSoilData(location),
        rainfallData: generateMockRainfallData(location),
        ndviData: generateMockNDVIData(location)
      };

      setResults(mockResults as any);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Satellite className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Tamil Nadu AgriGIS</h1>
                <p className="text-sm text-muted-foreground">Agricultural Analysis Platform</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 h-[calc(100vh-100px)]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Sidebar */}
          <div className={`lg:col-span-1 space-y-6 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <SearchPanel
              onLocationSearch={handleLocationSearch}
              onDrawModeToggle={handleDrawModeToggle}
              isDrawMode={isDrawMode}
            />

            <Separator />

            <SimpleFilterPanel
              onFiltersChange={handleFiltersChange}
              onResetFilters={handleResetFilters}
              activeFilters={filters}
            />

            <Separator />

            <ResultsPanel
              results={results}
              isLoading={isLoading}
              clickInfo={clickInfo}
            />
          </div>

          {/* Map */}
          <div className="lg:col-span-3 h-full">
            <div className="bg-card rounded-lg border border-border shadow-sm h-full p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Interactive Agricultural Map</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  Tamil Nadu Boundary & Districts
                </div>
              </div>
              <div className="h-[calc(100%-60px)]">
                <InteractiveMap
                  selectedGeometry={selectedGeometry}
                  onGeometrySelect={handleGeometrySelect}
                  onMapClick={handleMapClick}
                  filters={filters}
                  onLocationSelect={handleLocationSelect}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
