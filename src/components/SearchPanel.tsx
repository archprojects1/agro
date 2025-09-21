import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Pencil } from 'lucide-react';

interface SearchPanelProps {
  onLocationSearch: (location: any) => void;
  onDrawModeToggle: () => void;
  isDrawMode: boolean;
}

const SearchPanel: React.FC<SearchPanelProps> = ({
  onLocationSearch,
  onDrawModeToggle,
  isDrawMode
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  
  const districts = [
    { name: 'Ariyalur', coords: [79.0766, 11.1401] },
    { name: 'Chengalpattu', coords: [79.9865, 12.6922] },
    { name: 'Chennai', coords: [80.2707, 13.0827] },
    { name: 'Coimbatore', coords: [76.9558, 11.0168] },
    { name: 'Cuddalore', coords: [79.7718, 11.7449] },
    { name: 'Dharmapuri', coords: [78.1597, 12.1211] },
    { name: 'Dindigul', coords: [77.9816, 10.3624] },
    { name: 'Erode', coords: [77.7172, 11.3410] },
    { name: 'Kallakurichi', coords: [78.9597, 11.7401] },
    { name: 'Kanchipuram', coords: [79.7037, 12.8185] },
    { name: 'Kanyakumari', coords: [77.5385, 8.0883] },
    { name: 'Karur', coords: [78.0766, 10.9571] },
    { name: 'Krishnagiri', coords: [78.2137, 12.5186] },
    { name: 'Madurai', coords: [78.1198, 9.9252] },
    { name: 'Mayiladuthurai', coords: [79.6537, 11.1024] },
    { name: 'Nagapattinam', coords: [79.8420, 10.7667] },
    { name: 'Namakkal', coords: [78.1677, 11.2189] },
    { name: 'Nilgiris', coords: [76.6932, 11.4064] },
    { name: 'Perambalur', coords: [78.8808, 11.2342] },
    { name: 'Pudukkottai', coords: [78.8000, 10.3833] },
    { name: 'Ramanathapuram', coords: [78.8370, 9.3640] },
    { name: 'Ranipet', coords: [79.3308, 12.9249] },
    { name: 'Salem', coords: [78.1460, 11.6643] },
    { name: 'Sivaganga', coords: [78.4809, 9.8434] },
    { name: 'Tenkasi', coords: [77.3152, 8.9606] },
    { name: 'Thanjavur', coords: [79.1378, 10.7870] },
    { name: 'Theni', coords: [77.4977, 10.0104] },
    { name: 'Thoothukudi', coords: [78.1348, 8.7642] },
    { name: 'Tiruchirappalli', coords: [78.7047, 10.7905] },
    { name: 'Tirunelveli', coords: [77.7567, 8.7139] },
    { name: 'Tirupathur', coords: [78.5430, 12.4969] },
    { name: 'Tiruppur', coords: [77.3411, 11.1085] },
    { name: 'Tiruvallur', coords: [79.9094, 13.1439] },
    { name: 'Tiruvannamalai', coords: [79.0747, 12.2253] },
    { name: 'Tiruvarur', coords: [79.6370, 10.7717] },
    { name: 'Vellore', coords: [79.1325, 12.9165] },
    { name: 'Viluppuram', coords: [79.4861, 11.9401] },
    { name: 'Virudhunagar', coords: [77.9624, 9.5810] }
  ];

  const handleDistrictSelect = (districtName: string) => {
    const district = districts.find(d => d.name === districtName);
    if (district) {
      setSelectedDistrict(districtName);
      onLocationSearch(district);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Select District
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedDistrict} onValueChange={handleDistrictSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a district in Tamil Nadu..." />
          </SelectTrigger>
          <SelectContent>
            {districts.map((district) => (
              <SelectItem key={district.name} value={district.name}>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{district.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="pt-2 border-t border-border">
          <Button
            onClick={onDrawModeToggle}
            variant={isDrawMode ? "default" : "outline"}
            className="w-full"
          >
            <Pencil className="w-4 h-4 mr-2" />
            {isDrawMode ? 'Exit Draw Mode' : 'Draw on Map'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchPanel;