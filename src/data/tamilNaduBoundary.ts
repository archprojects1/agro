// Simplified Tamil Nadu boundary GeoJSON (mock data for demonstration)
export const tamilNaduBoundary = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Tamil Nadu",
        "state_code": "TN"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [76.2673, 11.9144],
          [76.7217, 12.3764],
          [77.8203, 12.9092],
          [78.6269, 13.2846],
          [79.4175, 13.4479],
          [80.1755, 13.0827],
          [80.3463, 12.6186],
          [80.2307, 11.8781],
          [80.0367, 11.3275],
          [79.8275, 10.9570],
          [79.6867, 10.5457],
          [79.3156, 10.3074],
          [78.8842, 9.5411],
          [78.4542, 9.1775],
          [77.9380, 8.7322],
          [77.5367, 8.5389],
          [77.0673, 8.2511],
          [76.6733, 8.3892],
          [76.4364, 8.7084],
          [76.2247, 9.0868],
          [76.1175, 9.8735],
          [76.2956, 10.2764],
          [76.2673, 11.9144]
        ]]
      }
    }
  ]
};

// Crop data with detailed information
export interface CropData {
  id: string;
  name: string;
  scientificName: string;
  category: 'Cereals' | 'Pulses' | 'Oilseeds' | 'Cash Crops' | 'Vegetables' | 'Fruits';
  seasons: string[];
  soilTypes: string[];
  waterRequirement: 'Low' | 'Medium' | 'High';
  fertilityRequirement: 'High' | 'Medium' | 'Low'; // New field
  npkRequirement: { // New field
    nitrogen: number; // 0-100 scale
    phosphorus: number;
    potassium: number;
  };
  avgYield: number; // tons per hectare
  growthDuration: number; // days
  temperatureRange: {
    min: number;
    max: number;
  };
  rainfallRange: {
    min: number;
    max: number;
  };
}

export const cropDatabase: CropData[] = [
  {
    id: 'rice',
    name: 'Rice',
    scientificName: 'Oryza sativa',
    category: 'Cereals',
    seasons: ['Kharif', 'Rabi'],
    soilTypes: ['Alluvial Soil', 'Black Soil'],
    waterRequirement: 'High',
    fertilityRequirement: 'Medium',
    npkRequirement: { nitrogen: 80, phosphorus: 60, potassium: 40 },
    avgYield: 3.5,
    growthDuration: 120,
    temperatureRange: { min: 20, max: 35 },
    rainfallRange: { min: 1000, max: 2000 }
  },
  {
    id: 'wheat',
    name: 'Wheat',
    scientificName: 'Triticum aestivum',
    category: 'Cereals',
    seasons: ['Rabi'],
    soilTypes: ['Alluvial Soil', 'Black Soil'],
    waterRequirement: 'Medium',
    fertilityRequirement: 'High',
    npkRequirement: { nitrogen: 70, phosphorus: 50, potassium: 30 },
    avgYield: 2.8,
    growthDuration: 110,
    temperatureRange: { min: 10, max: 25 },
    rainfallRange: { min: 500, max: 1000 }
  },
  {
    id: 'cotton',
    name: 'Cotton',
    scientificName: 'Gossypium hirsutum',
    category: 'Cash Crops',
    seasons: ['Kharif'],
    soilTypes: ['Black Soil', 'Red Soil'],
    waterRequirement: 'Medium',
    fertilityRequirement: 'Medium',
    npkRequirement: { nitrogen: 60, phosphorus: 40, potassium: 50 },
    avgYield: 1.2,
    growthDuration: 180,
    temperatureRange: { min: 20, max: 35 },
    rainfallRange: { min: 500, max: 1200 }
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    scientificName: 'Saccharum officinarum',
    category: 'Cash Crops',
    seasons: ['Annual'],
    soilTypes: ['Alluvial Soil', 'Black Soil'],
    waterRequirement: 'High',
    fertilityRequirement: 'High',
    npkRequirement: { nitrogen: 90, phosphorus: 70, potassium: 60 },
    avgYield: 80,
    growthDuration: 365,
    temperatureRange: { min: 20, max: 35 },
    rainfallRange: { min: 1000, max: 1500 }
  },
  {
    id: 'maize',
    name: 'Maize',
    scientificName: 'Zea mays',
    category: 'Cereals',
    seasons: ['Kharif', 'Rabi'],
    soilTypes: ['Alluvial Soil', 'Red Soil', 'Black Soil'],
    waterRequirement: 'Medium',
    fertilityRequirement: 'Medium',
    npkRequirement: { nitrogen: 75, phosphorus: 55, potassium: 45 },
    avgYield: 4.2,
    growthDuration: 90,
    temperatureRange: { min: 18, max: 32 },
    rainfallRange: { min: 600, max: 1200 }
  },
  {
    id: 'groundnut',
    name: 'Groundnut',
    scientificName: 'Arachis hypogaea',
    category: 'Oilseeds',
    seasons: ['Kharif', 'Rabi'],
    soilTypes: ['Red Soil', 'Black Soil'],
    waterRequirement: 'Low',
    fertilityRequirement: 'Low',
    npkRequirement: { nitrogen: 40, phosphorus: 60, potassium: 50 },
    avgYield: 1.8,
    growthDuration: 100,
    temperatureRange: { min: 20, max: 30 },
    rainfallRange: { min: 400, max: 800 }
  },
  {
    id: 'tomato',
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    category: 'Vegetables',
    seasons: ['Rabi', 'Summer'],
    soilTypes: ['Alluvial Soil', 'Red Soil'],
    waterRequirement: 'Medium',
    fertilityRequirement: 'High',
    npkRequirement: { nitrogen: 85, phosphorus: 65, potassium: 55 },
    avgYield: 25,
    growthDuration: 80,
    temperatureRange: { min: 15, max: 30 },
    rainfallRange: { min: 600, max: 1000 }
  },
  {
    id: 'banana',
    name: 'Banana',
    scientificName: 'Musa paradisiaca',
    category: 'Fruits',
    seasons: ['Annual'],
    soilTypes: ['Alluvial Soil', 'Laterite Soil'],
    waterRequirement: 'High',
    fertilityRequirement: 'High',
    npkRequirement: { nitrogen: 95, phosphorus: 75, potassium: 70 },
    avgYield: 40,
    growthDuration: 365,
    temperatureRange: { min: 20, max: 35 },
    rainfallRange: { min: 1200, max: 2000 }
  }
];

// Season information
export const seasons = [
  { id: 'kharif', name: 'Kharif', months: 'June - October', description: 'Monsoon season' },
  { id: 'rabi', name: 'Rabi', months: 'November - March', description: 'Winter season' },
  { id: 'summer', name: 'Summer', months: 'April - May', description: 'Hot season' },
  { id: 'zaid', name: 'Zaid', months: 'March - June', description: 'Summer season' }
];

// Soil-crop compatibility matrix
export const soilCropCompatibility: Record<string, string[]> = {
  'Red Soil': ['cotton', 'groundnut', 'tomato', 'maize'],
  'Black Soil': ['rice', 'wheat', 'cotton', 'sugarcane', 'maize', 'groundnut'],
  'Alluvial Soil': ['rice', 'wheat', 'sugarcane', 'maize', 'tomato', 'banana'],
  'Laterite Soil': ['banana', 'maize']
};

// Filter options
export const filterOptions = {
  crops: cropDatabase.map(crop => ({ id: crop.id, name: crop.name, category: crop.category })),
  seasons: seasons,
  soilTypes: ['Red Soil', 'Black Soil', 'Alluvial Soil', 'Laterite Soil'],
  waterRequirements: ['Low', 'Medium', 'High'],
  fertilityLevels: ['High', 'Medium', 'Low']
};

// Mock data generation functions
export const generateMockSoilData = (location: any) => {
  const soilTypes = ['Red Soil', 'Black Soil', 'Alluvial Soil', 'Laterite Soil'];
  const fertilityLevels = ['High', 'Medium', 'Low'];

  return {
    type: soilTypes[Math.floor(Math.random() * soilTypes.length)],
    ph: +(6.0 + Math.random() * 2.5).toFixed(1),
    nutrients: 'N-P-K Available',
    fertility: fertilityLevels[Math.floor(Math.random() * fertilityLevels.length)],
    npkLevels: {
      nitrogen: Math.floor(Math.random() * 100), // 0-100 scale
      phosphorus: Math.floor(Math.random() * 100),
      potassium: Math.floor(Math.random() * 100)
    }
  };
};

export const generateMockRainfallData = (location: any) => {
  return {
    annual: Math.floor(800 + Math.random() * 800), // 800-1600mm
    seasonal: ['Pre-monsoon', 'Southwest Monsoon', 'Northeast Monsoon'][Math.floor(Math.random() * 3)],
    reliability: ['High', 'Medium', 'Variable'][Math.floor(Math.random() * 3)]
  };
};

export const generateMockNDVIData = (location: any) => {
  return {
    current: +(0.2 + Math.random() * 0.6).toFixed(3), // 0.2-0.8 range
    trend: ['Increasing', 'Stable', 'Decreasing'][Math.floor(Math.random() * 3)],
    season: ['Kharif', 'Rabi', 'Summer'][Math.floor(Math.random() * 3)],
    minRange: +(0.1 + Math.random() * 0.3).toFixed(3), // Seasonal min
    maxRange: +(0.5 + Math.random() * 0.4).toFixed(3)  // Seasonal max
  };
};

// Enhanced mock data generation with crop recommendations
export const generateCropRecommendations = (location: any, filters?: {
  cropType?: string;
  season?: string;
  soilType?: string;
}) => {
  const baseCrops = cropDatabase;

  // Apply filters if provided
  let filteredCrops = baseCrops;
  if (filters?.cropType) {
    filteredCrops = filteredCrops.filter(crop => crop.id === filters.cropType);
  }
  if (filters?.season) {
    filteredCrops = filteredCrops.filter(crop => crop.seasons.includes(filters.season!));
  }
  if (filters?.soilType) {
    filteredCrops = filteredCrops.filter(crop => crop.soilTypes.includes(filters.soilType!));
  }

  // Generate recommendations with suitability scores
  return filteredCrops.map(crop => {
    const suitabilityScore = Math.floor(Math.random() * 40) + 60; // 60-100 range
    const expectedYield = +(crop.avgYield * (0.7 + Math.random() * 0.6)).toFixed(1);

    return {
      crop,
      suitabilityScore,
      expectedYield,
      recommendation: suitabilityScore >= 80 ? 'Highly Recommended' :
                     suitabilityScore >= 70 ? 'Recommended' :
                     suitabilityScore >= 60 ? 'Moderately Suitable' : 'Not Recommended',
      challenges: generateChallenges(crop, location),
      bestPractices: generateBestPractices(crop)
    };
  }).sort((a, b) => b.suitabilityScore - a.suitabilityScore);
};

const generateChallenges = (crop: CropData, location: any) => {
  const challenges = [];
  if (crop.waterRequirement === 'High' && Math.random() > 0.5) {
    challenges.push('High water requirement may be challenging in dry periods');
  }
  if (crop.temperatureRange.min > 25 && Math.random() > 0.3) {
    challenges.push('Temperature sensitivity requires careful monitoring');
  }
  if (challenges.length === 0) {
    challenges.push('Standard agricultural practices recommended');
  }
  return challenges;
};

const generateBestPractices = (crop: CropData) => {
  const practices = [];
  practices.push(`Optimal planting time: ${crop.seasons.join(' or ')} season`);
  practices.push(`Soil preparation: Ensure ${crop.soilTypes[0]} compatibility`);
  practices.push(`Water management: ${crop.waterRequirement.toLowerCase()} water requirement`);
  practices.push(`Growth duration: ${crop.growthDuration} days`);
  return practices;
};
