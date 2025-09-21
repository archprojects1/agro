import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Sprout,
  Calendar,
  Layers,
  RotateCcw
} from 'lucide-react';
import { filterOptions, CropData } from '../data/tamilNaduBoundary';

export interface FilterCriteria {
  cropType?: string;
  season?: string;
  soilType?: string;
  waterRequirement?: string;
  multiCriteriaMode?: 'AND' | 'OR';
}

interface FilterPanelProps {
  onFiltersChange: (filters: FilterCriteria) => void;
  onResetFilters: () => void;
  activeFilters: FilterCriteria;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  onFiltersChange,
  onResetFilters,
  activeFilters
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [multiCriteriaMode, setMultiCriteriaMode] = useState<'AND' | 'OR'>('AND');

  const handleFilterChange = (key: keyof FilterCriteria, value: string | undefined) => {
    const newFilters = { ...activeFilters, [key]: value };
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    onResetFilters();
    setMultiCriteriaMode('AND');
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => value && value !== '').length;
  };

  const getCropById = (cropId: string): CropData | undefined => {
    return filterOptions.crops.find(crop => crop.id === cropId);
  };

  const getSeasonById = (seasonId: string) => {
    return filterOptions.seasons.find(season => season.id === seasonId);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Advanced Filters
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFilterCount()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Filter Toggle */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Multi-Criteria Mode</span>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="multi-mode" className="text-xs text-muted-foreground">
              {multiCriteriaMode}
            </Label>
            <Switch
              id="multi-mode"
              checked={multiCriteriaMode === 'OR'}
              onCheckedChange={(checked) => {
                const newMode = checked ? 'OR' : 'AND';
                setMultiCriteriaMode(newMode);
                onFiltersChange({ ...activeFilters, multiCriteriaMode: newMode });
              }}
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {getActiveFilterCount() > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-primary/5 rounded-lg">
            <span className="text-sm font-medium text-muted-foreground">Active:</span>
            {activeFilters.cropType && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Sprout className="w-3 h-3" />
                {getCropById(activeFilters.cropType)?.name}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-destructive"
                  onClick={() => handleFilterChange('cropType', undefined)}
                />
              </Badge>
            )}
            {activeFilters.season && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {getSeasonById(activeFilters.season)?.name}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-destructive"
                  onClick={() => handleFilterChange('season', undefined)}
                />
              </Badge>
            )}
            {activeFilters.soilType && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Layers className="w-3 h-3" />
                {activeFilters.soilType}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-destructive"
                  onClick={() => handleFilterChange('soilType', undefined)}
                />
              </Badge>
            )}
            {activeFilters.waterRequirement && (
              <Badge variant="outline" className="flex items-center gap-1">
                💧 {activeFilters.waterRequirement}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-destructive"
                  onClick={() => handleFilterChange('waterRequirement', undefined)}
                />
              </Badge>
            )}
          </div>
        )}

        {/* Expandable Filter Options */}
        {isExpanded && (
          <>
            <Separator />

            {/* Crop Type Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Sprout className="w-4 h-4 text-primary" />
                Crop Type
              </Label>
              <Select
                value={activeFilters.cropType || ''}
                onValueChange={(value) => handleFilterChange('cropType', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select crop type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Crops</SelectItem>
                  {filterOptions.crops.map((crop) => (
                    <SelectItem key={crop.id} value={crop.id}>
                      <div className="flex items-center gap-2">
                        <span>{crop.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {crop.category}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Season Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Season
              </Label>
              <Select
                value={activeFilters.season || ''}
                onValueChange={(value) => handleFilterChange('season', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select season..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Seasons</SelectItem>
                  {filterOptions.seasons.map((season) => (
                    <SelectItem key={season.id} value={season.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{season.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {season.months}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Soil Type Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Soil Type
              </Label>
              <Select
                value={activeFilters.soilType || ''}
                onValueChange={(value) => handleFilterChange('soilType', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select soil type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Soil Types</SelectItem>
                  {filterOptions.soilTypes.map((soilType) => (
                    <SelectItem key={soilType} value={soilType}>
                      {soilType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Water Requirement Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Water Requirement</Label>
              <Select
                value={activeFilters.waterRequirement || ''}
                onValueChange={(value) => handleFilterChange('waterRequirement', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select water requirement..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Water Requirement</SelectItem>
                  {filterOptions.waterRequirements.map((requirement) => (
                    <SelectItem key={requirement} value={requirement}>
                      💧 {requirement}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reset Button */}
            <div className="pt-4 border-t">
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full"
                disabled={getActiveFilterCount() === 0}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset All Filters
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
