// Location data interface for agricultural locations
export interface LocationData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  cropType: string;
  season: string;
  soilType: string;
  fertility: string;
  npk: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  ndvi: number;
  area: number; // in hectares
  yield: number; // tons per hectare
}

// Generate mock location data within Tamil Nadu boundary
export const generateMockLocations = (count: number = 500): LocationData[] => {
  const locations: LocationData[] = [];

  // Tamil Nadu boundary coordinates (approximate bounding box)
  const tnBounds = {
    minLat: 8.0,
    maxLat: 13.5,
    minLng: 76.0,
    maxLng: 80.5
  };

  // Crop data for generating realistic locations
  const cropData = [
    { id: 'rice', name: 'Rice', npkReq: { n: 80, p: 60, k: 40 }, seasons: ['Kharif', 'Rabi'], soilTypes: ['Alluvial Soil', 'Black Soil'] },
    { id: 'wheat', name: 'Wheat', npkReq: { n: 70, p: 50, k: 30 }, seasons: ['Rabi'], soilTypes: ['Alluvial Soil', 'Black Soil'] },
    { id: 'cotton', name: 'Cotton', npkReq: { n: 60, p: 40, k: 50 }, seasons: ['Kharif'], soilTypes: ['Black Soil', 'Red Soil'] },
    { id: 'sugarcane', name: 'Sugarcane', npkReq: { n: 90, p: 70, k: 60 }, seasons: ['Annual'], soilTypes: ['Alluvial Soil', 'Black Soil'] },
    { id: 'maize', name: 'Maize', npkReq: { n: 75, p: 55, k: 45 }, seasons: ['Kharif', 'Rabi'], soilTypes: ['Alluvial Soil', 'Red Soil', 'Black Soil'] },
    { id: 'groundnut', name: 'Groundnut', npkReq: { n: 40, p: 60, k: 50 }, seasons: ['Kharif', 'Rabi'], soilTypes: ['Red Soil', 'Black Soil'] },
    { id: 'tomato', name: 'Tomato', npkReq: { n: 85, p: 65, k: 55 }, seasons: ['Rabi', 'Summer'], soilTypes: ['Alluvial Soil', 'Red Soil'] },
    { id: 'banana', name: 'Banana', npkReq: { n: 95, p: 75, k: 70 }, seasons: ['Annual'], soilTypes: ['Alluvial Soil', 'Laterite Soil'] }
  ];

  for (let i = 0; i < count; i++) {
    const crop = cropData[Math.floor(Math.random() * cropData.length)];

    // Generate coordinates within Tamil Nadu
    const lat = tnBounds.minLat + Math.random() * (tnBounds.maxLat - tnBounds.minLat);
    const lng = tnBounds.minLng + Math.random() * (tnBounds.maxLng - tnBounds.minLng);

    // Generate NPK values based on crop requirements with some variation
    const npkVariation = 0.3; // ±30% variation
    const npk = {
      nitrogen: Math.max(0, Math.min(100,
        crop.npkReq.n * (1 + (Math.random() - 0.5) * npkVariation)
      )),
      phosphorus: Math.max(0, Math.min(100,
        crop.npkReq.p * (1 + (Math.random() - 0.5) * npkVariation)
      )),
      potassium: Math.max(0, Math.min(100,
        crop.npkReq.k * (1 + (Math.random() - 0.5) * npkVariation)
      ))
    };

    // Generate NDVI based on crop health and season
    const baseNdvi = 0.4 + Math.random() * 0.4; // 0.4-0.8 range
    const seasonalVariation = (Math.random() - 0.5) * 0.2;
    const ndvi = Math.max(0.1, Math.min(0.9, baseNdvi + seasonalVariation));

    locations.push({
      id: `loc_${i + 1}`,
      name: `${crop.name} Field ${i + 1}`,
      latitude: lat,
      longitude: lng,
      cropType: crop.id,
      season: crop.seasons[Math.floor(Math.random() * crop.seasons.length)],
      soilType: crop.soilTypes[Math.floor(Math.random() * crop.soilTypes.length)],
      fertility: Math.random() > 0.5 ? 'High' : Math.random() > 0.3 ? 'Medium' : 'Low',
      npk,
      ndvi: Math.round(ndvi * 1000) / 1000,
      area: +(5 + Math.random() * 20).toFixed(1), // 5-25 hectares
      yield: +(2 + Math.random() * 8).toFixed(1) // 2-10 tons per hectare
    });
  }

  return locations;
};

// Pre-generated location data for performance
export const mockLocations = generateMockLocations(750);

// Helper function to get crop color for markers
export const getCropColor = (cropType: string): string => {
  const colorMap: Record<string, string> = {
    'rice': '#22c55e',      // green
    'wheat': '#eab308',     // yellow
    'cotton': '#f97316',    // orange
    'sugarcane': '#8b5cf6', // purple
    'maize': '#06b6d4',     // cyan
    'groundnut': '#a3a3a3', // gray
    'tomato': '#ef4444',    // red
    'banana': '#fbbf24'     // amber
  };
  return colorMap[cropType] || '#6b7280'; // default gray
};

// Helper function to get fertility color
export const getFertilityColor = (fertility: string): string => {
  const colorMap: Record<string, string> = {
    'High': '#22c55e',    // green
    'Medium': '#eab308',  // yellow
    'Low': '#ef4444'      // red
  };
  return colorMap[fertility] || '#6b7280';
};

// Filter locations based on criteria
export const filterLocations = (locations: LocationData[], filters: any): LocationData[] => {
  return locations.filter(location => {
    // Crop type filter
    if (filters.cropType && location.cropType !== filters.cropType) {
      return false;
    }

    // Season filter
    if (filters.season && location.season !== filters.season) {
      return false;
    }

    // Soil type filter
    if (filters.soilType && location.soilType !== filters.soilType) {
      return false;
    }

    // Fertility filter
    if (filters.fertility && location.fertility !== filters.fertility) {
      return false;
    }

    // NPK range filters
    if (filters.npkMin && filters.npkMax) {
      if (location.npk.nitrogen < filters.npkMin.nitrogen ||
          location.npk.nitrogen > filters.npkMax.nitrogen ||
          location.npk.phosphorus < filters.npkMin.phosphorus ||
          location.npk.phosphorus > filters.npkMax.phosphorus ||
          location.npk.potassium < filters.npkMin.potassium ||
          location.npk.potassium > filters.npkMax.potassium) {
        return false;
      }
    }

    // NDVI range filter
    if (filters.ndviRange && (location.ndvi < filters.ndviRange[0] || location.ndvi > filters.ndviRange[1])) {
      return false;
    }

    return true;
  });
};
