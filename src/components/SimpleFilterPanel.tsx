import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Sprout,
  Calendar,
  Layers,
  RotateCcw,
  Leaf,
  BarChart3,
  Activity
} from 'lucide-react';

export interface FilterCriteria {
  cropType?: string;
  season?: string;
  soilType?: string;
  waterRequirement?: string;
  fertility?: string;
  npkMin?: { nitrogen: number; phosphorus: number; potassium: number };
  npkMax?: { nitrogen: number; phosphorus: number; potassium: number };
  ndviRange?: [number, number];
  multiCriteriaMode?: 'AND' | 'OR';
}

interface SimpleFilterPanelProps {
  onFiltersChange: (filters: FilterCriteria) => void;
  onResetFilters: () => void;
  activeFilters: FilterCriteria;
}

const SimpleFilterPanel: React.FC<SimpleFilterPanelProps> = ({
  onFiltersChange,
  onResetFilters,
  activeFilters
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [ndviRange, setNdviRange] = useState<[number, number]>([0.2, 0.8]);
  const [npkRanges, setNpkRanges] = useState({
    nitrogen: [0, 100],
    phosphorus: [0, 100],
    potassium: [0, 100]
  });

  const handleFilterChange = (key: keyof FilterCriteria, value: string | undefined) => {
    onFiltersChange({ ...activeFilters, [key]: value });
  };

  const handleNdviChange = (value: number[]) => {
    const range: [number, number] = [value[0], value[1]];
    setNdviRange(range);
    onFiltersChange({ ...activeFilters, ndviRange: range });
  };

  const handleNpkChange = (nutrient: 'nitrogen' | 'phosphorus' | 'potassium', values: number[]) => {
    const newRanges = { ...npkRanges, [nutrient]: values };
    setNpkRanges(newRanges);

    const npkMin = {
      nitrogen: newRanges.nitrogen[0],
      phosphorus: newRanges.phosphorus[0],
      potassium: newRanges.potassium[0]
    };
    const npkMax = {
      nitrogen: newRanges.nitrogen[1],
      phosphorus: newRanges.phosphorus[1],
      potassium: newRanges.potassium[1]
    };
    onFiltersChange({ ...activeFilters, npkMin, npkMax });
  };

  const handleReset = () => {
    onResetFilters();
    setNdviRange([0.2, 0.8]);
    setNpkRanges({ nitrogen: [0, 100], phosphorus: [0, 100], potassium: [0, 100] });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.cropType) count++;
    if (activeFilters.season) count++;
    if (activeFilters.soilType) count++;
    if (activeFilters.fertility) count++;
    if (activeFilters.ndviRange && (activeFilters.ndviRange[0] !== 0.2 || activeFilters.ndviRange[1] !== 0.8)) count++;
    if (activeFilters.npkMin && (
      activeFilters.npkMin.nitrogen !== 0 ||
      activeFilters.npkMin.phosphorus !== 0 ||
      activeFilters.npkMin.potassium !== 0 ||
      activeFilters.npkMax!.nitrogen !== 100 ||
      activeFilters.npkMax!.phosphorus !== 100 ||
      activeFilters.npkMax!.potassium !== 100
    )) count++;
    return count;
  };

  const cropOptions = [
    { id: 'rice', name: 'Rice', category: 'Cereals' },
    { id: 'wheat', name: 'Wheat', category: 'Cereals' },
    { id: 'cotton', name: 'Cotton', category: 'Cash Crops' },
    { id: 'sugarcane', name: 'Sugarcane', category: 'Cash Crops' },
    { id: 'maize', name: 'Maize', category: 'Cereals' },
    { id: 'groundnut', name: 'Groundnut', category: 'Oilseeds' },
    { id: 'tomato', name: 'Tomato', category: 'Vegetables' },
    { id: 'banana', name: 'Banana', category: 'Fruits' }
  ];

  const seasonOptions = [
    { id: 'kharif', name: 'Kharif', months: 'June - October' },
    { id: 'rabi', name: 'Rabi', months: 'November - March' },
    { id: 'summer', name: 'Summer', months: 'April - May' },
    { id: 'zaid', name: 'Zaid', months: 'March - June' }
  ];

  const soilOptions = ['Red Soil', 'Black Soil', 'Alluvial Soil', 'Laterite Soil'];
  const fertilityOptions = ['High', 'Medium', 'Low'];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Agricultural Filters
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="ml-2">{getActiveFilterCount()}</Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Active Filters */}
        {getActiveFilterCount() > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-primary/5 rounded-lg">
            {activeFilters.cropType && <Badge>{cropOptions.find(c => c.id === activeFilters.cropType)?.name}<X onClick={() => handleFilterChange('cropType', undefined)} /></Badge>}
            {activeFilters.season && <Badge>{seasonOptions.find(s => s.id === activeFilters.season)?.name}<X onClick={() => handleFilterChange('season', undefined)} /></Badge>}
            {activeFilters.soilType && <Badge>{activeFilters.soilType}<X onClick={() => handleFilterChange('soilType', undefined)} /></Badge>}
            {activeFilters.fertility && <Badge>{activeFilters.fertility}<X onClick={() => handleFilterChange('fertility', undefined)} /></Badge>}
            {activeFilters.ndviRange && <Badge>NDVI: {activeFilters.ndviRange[0]}-{activeFilters.ndviRange[1]}<X onClick={() => handleNdviChange([0.2, 0.8])} /></Badge>}
          </div>
        )}

        {/* Expandable Filters */}
        {isExpanded && (
          <>
            <Separator />

            {/* Crop Type */}
            <div className="space-y-2">
              <Label><Sprout className="w-4 h-4 text-primary" /> Crop Type</Label>
              <Select value={activeFilters.cropType || 'all'} onValueChange={(v) => handleFilterChange('cropType', v === 'all' ? undefined : v)}>
                <SelectTrigger><SelectValue placeholder="Select crop type..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crops</SelectItem>
                  {cropOptions.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Season */}
            <div className="space-y-2">
              <Label><Calendar className="w-4 h-4 text-primary" /> Season</Label>
              <Select value={activeFilters.season || 'all'} onValueChange={(v) => handleFilterChange('season', v === 'all' ? undefined : v)}>
                <SelectTrigger><SelectValue placeholder="Select season..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Seasons</SelectItem>
                  {seasonOptions.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Soil Type */}
            <div className="space-y-2">
              <Label><Layers className="w-4 h-4 text-primary" /> Soil Type</Label>
              <Select value={activeFilters.soilType || 'all'} onValueChange={(v) => handleFilterChange('soilType', v === 'all' ? undefined : v)}>
                <SelectTrigger><SelectValue placeholder="Select soil type..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Soil Types</SelectItem>
                  {soilOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Fertility */}
            <div className="space-y-2">
              <Label><Leaf className="w-4 h-4 text-primary" /> Fertility</Label>
              <Select value={activeFilters.fertility || 'all'} onValueChange={(v) => handleFilterChange('fertility', v === 'all' ? undefined : v)}>
                <SelectTrigger><SelectValue placeholder="Select fertility..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Fertility Level</SelectItem>
                  {fertilityOptions.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* NPK & NDVI sliders */}
            {/* ... keep your existing Slider code for NPK and NDVI here ... */}

            {/* Reset Button */}
            <div className="pt-4 border-t">
              <Button onClick={handleReset} variant="outline" className="w-full" disabled={getActiveFilterCount() === 0}>
                <RotateCcw className="w-4 h-4 mr-2" /> Reset All Filters
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SimpleFilterPanel;
