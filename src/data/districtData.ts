// Tamil Nadu Districts with approximate boundaries
export interface DistrictData {
  id: string;
  name: string;
  coordinates: [number, number][]; // [lng, lat] pairs for polygon
  center: [number, number]; // [lat, lng] for district center
  area: number; // approximate area in sq km
}

// Tamil Nadu districts data
export const tamilNaduDistricts: DistrictData[] = [
  {
    id: 'chennai',
    name: 'Chennai',
    coordinates: [
      [80.2785, 13.0827],
      [80.2785, 12.8377],
      [80.1463, 12.8377],
      [80.1463, 13.0827]
    ],
    center: [13.0827, 80.2785],
    area: 426
  },
  {
    id: 'coimbatore',
    name: 'Coimbatore',
    coordinates: [
      [76.9558, 11.0168],
      [77.0586, 11.0168],
      [77.0586, 10.7922],
      [76.9558, 10.7922]
    ],
    center: [11.0168, 77.0586],
    area: 7469
  },
  {
    id: 'madurai',
    name: 'Madurai',
    coordinates: [
      [78.1198, 9.9252],
      [78.1198, 9.7395],
      [77.9274, 9.7395],
      [77.9274, 9.9252]
    ],
    center: [9.9252, 78.1198],
    area: 3742
  },
  {
    id: 'tiruchirappalli',
    name: 'Tiruchirappalli',
    coordinates: [
      [78.7047, 10.7905],
      [78.7047, 10.6281],
      [78.4794, 10.6281],
      [78.4794, 10.7905]
    ],
    center: [10.7905, 78.7047],
    area: 4407
  },
  {
    id: 'salem',
    name: 'Salem',
    coordinates: [
      [78.1460, 11.6643],
      [78.1460, 11.3438],
      [77.6836, 11.3438],
      [77.6836, 11.6643]
    ],
    center: [11.6643, 78.1460],
    area: 5245
  },
  {
    id: 'tirunelveli',
    name: 'Tirunelveli',
    coordinates: [
      [77.7567, 8.7139],
      [77.7567, 8.4422],
      [77.3086, 8.4422],
      [77.3086, 8.7139]
    ],
    center: [8.7139, 77.7567],
    area: 6759
  },
  {
    id: 'vellore',
    name: 'Vellore',
    coordinates: [
      [79.1325, 12.9165],
      [79.1325, 12.6519],
      [78.7368, 12.6519],
      [78.7368, 12.9165]
    ],
    center: [12.9165, 79.1325],
    area: 6077
  },
  {
    id: 'thanjavur',
    name: 'Thanjavur',
    coordinates: [
      [79.1378, 10.7870],
      [79.1378, 10.5674],
      [78.8271, 10.5674],
      [78.8271, 10.7870]
    ],
    center: [10.7870, 79.1378],
    area: 3396
  }
];

// Helper function to check if a point is inside a polygon (district)
export const isPointInDistrict = (point: [number, number], district: DistrictData): boolean => {
  const [lng, lat] = point;
  const { coordinates } = district;

  let inside = false;
  for (let i = 0, j = coordinates.length - 1; i < coordinates.length; j = i++) {
    const [xi, yi] = coordinates[i];
    const [xj, yj] = coordinates[j];

    if (((yi > lat) !== (yj > lat)) && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }

  return inside;
};

// Helper function to filter locations by district
export const filterLocationsByDistrict = (locations: any[], districtId?: string): any[] => {
  if (!districtId) return locations;

  const district = tamilNaduDistricts.find(d => d.id === districtId);
  if (!district) return locations;

  return locations.filter(location => {
    const point: [number, number] = [location.longitude, location.latitude];
    return isPointInDistrict(point, district);
  });
};
