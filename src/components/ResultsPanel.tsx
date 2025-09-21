import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Droplets,
  Layers,
  CheckCircle,
  XCircle,
  BarChart3,
  MapPin,
  Activity
} from 'lucide-react';

interface ResultsData {
  isValid: boolean;
  location?: string;
  soilData?: {
    type: string;
    ph: number;
    nutrients: string;
    fertility: string;
    npkLevels?: {
      nitrogen: number;
      phosphorus: number;
      potassium: number;
    };
  };
  rainfallData?: {
    annual: number;
    seasonal: string;
    reliability: string;
  };
  ndviData?: {
    current: number;
    trend: string;
    season: string;
    minRange?: number;
    maxRange?: number;
  };
}

interface ResultsPanelProps {
  results: ResultsData | null;
  isLoading: boolean;
  clickInfo?: {
    lat: number;
    lng: number;
    address?: string;
    loading?: boolean;
  } | null;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, isLoading, clickInfo }) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary animate-pulse" />
            Analyzing...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-muted/50 rounded animate-pulse"></div>
            <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-muted/50 rounded animate-pulse w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results && !clickInfo) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
            Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Select a location to view agricultural analysis</p>
            <p className="text-sm mt-2">Or click anywhere on the map to get coordinates</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getValidityBadge = () => {
    if (results?.isValid) {
      return (
        <Badge className="bg-success/10 text-success border-success/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          Valid for Agriculture
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive">
          <XCircle className="w-3 h-3 mr-1" />
          Not Suitable
        </Badge>
      );
    }
  };

  const getFertilityColor = (fertility: string) => {
    switch (fertility.toLowerCase()) {
      case 'high': return 'text-success';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getReliabilityColor = (reliability: string) => {
    switch (reliability.toLowerCase()) {
      case 'high': return 'text-success';
      case 'medium': return 'text-yellow-600';
      case 'variable': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'increasing': return 'text-success';
      case 'stable': return 'text-yellow-600';
      case 'decreasing': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Analysis Results
        </CardTitle>
        {results?.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{results.location}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Clicked Location Info */}
        {clickInfo && (
          <>
            <div className="bg-muted/50 rounded-lg p-3">
              <h4 className="font-semibold flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                Clicked Location
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Coordinates:</span>
                  <div className="font-medium">
                    {clickInfo.lat.toFixed(6)}, {clickInfo.lng.toFixed(6)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Address:</span>
                  <div className="font-medium">
                    {clickInfo.loading ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-3 w-3 border border-primary border-t-transparent mr-2"></div>
                        Loading address...
                      </span>
                    ) : (
                      clickInfo.address || 'No address available'
                    )}
                  </div>
                </div>
              </div>
            </div>
            {results && <Separator />}
          </>
        )}

        {/* Agricultural Analysis Results */}
        {results && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Agricultural Suitability</span>
              {getValidityBadge()}
            </div>

            <Separator />

            {results.soilData && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  Soil Analysis
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <div className="font-medium">{results.soilData.type}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">pH Level:</span>
                    <div className="font-medium">{results.soilData.ph}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nutrients:</span>
                    <div className="font-medium">{results.soilData.nutrients}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fertility:</span>
                    <div className={`font-medium ${getFertilityColor(results.soilData.fertility)}`}>
                      {results.soilData.fertility}
                    </div>
                  </div>
                </div>

                {/* NPK Levels */}
                {results.soilData.npkLevels && (
                  <div className="mt-3 pt-3 border-t">
                    <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Activity className="w-3 h-3 text-primary" />
                      NPK Nutrient Levels
                    </h5>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-medium text-blue-700">Nitrogen</div>
                        <div className="text-lg font-bold text-blue-800">
                          {results.soilData.npkLevels.nitrogen}
                        </div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-medium text-green-700">Phosphorus</div>
                        <div className="text-lg font-bold text-green-800">
                          {results.soilData.npkLevels.phosphorus}
                        </div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <div className="font-medium text-purple-700">Potassium</div>
                        <div className="text-lg font-bold text-purple-800">
                          {results.soilData.npkLevels.potassium}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Separator />

            {results.rainfallData && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-primary" />
                  Rainfall Data
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Annual:</span>
                    <div className="font-medium">{results.rainfallData.annual}mm</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Season:</span>
                    <div className="font-medium">{results.rainfallData.seasonal}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Reliability:</span>
                    <div className={`font-medium ${getReliabilityColor(results.rainfallData.reliability)}`}>
                      {results.rainfallData.reliability}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {results.ndviData && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  NDVI Analysis
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Current NDVI:</span>
                    <div className="font-medium">{results.ndviData.current}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Season:</span>
                    <div className="font-medium">{results.ndviData.season}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Trend:</span>
                    <div className={`font-medium ${getTrendColor(results.ndviData.trend)}`}>
                      {results.ndviData.trend}
                    </div>
                  </div>
                </div>

                {/* NDVI Range */}
                {results.ndviData.minRange && results.ndviData.maxRange && (
                  <div className="mt-3 pt-3 border-t">
                    <h5 className="font-medium text-sm mb-2">Seasonal NDVI Range</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Range:</span>
                        <span className="font-medium">
                          {results.ndviData.minRange.toFixed(2)} - {results.ndviData.maxRange.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                          style={{
                            marginLeft: `${((results.ndviData.minRange - 0.2) / 0.6) * 100}%`,
                            width: `${((results.ndviData.maxRange - results.ndviData.minRange) / 0.6) * 100}%`
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0.2 (Low)</span>
                        <span>0.8 (High)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsPanel;
