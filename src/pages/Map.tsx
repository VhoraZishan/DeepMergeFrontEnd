import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Map as MapIcon,
  Navigation,
  Anchor,
  Waves,
  Thermometer,
  Droplets,
  Wind
} from "lucide-react";

const mapData = [
  { id: "4902917", lat: -10.5, lon: 85.3, status: "active", lastUpdate: "2 hours ago", temp: "24.3°C" },
  { id: "4902918", lat: -8.2, lon: 87.1, status: "active", lastUpdate: "1 hour ago", temp: "25.1°C" },
  { id: "4902919", lat: -12.1, lon: 83.7, status: "maintenance", lastUpdate: "6 hours ago", temp: "23.8°C" },
  { id: "4902920", lat: -9.8, lon: 89.2, status: "active", lastUpdate: "30 min ago", temp: "24.7°C" },
];

const Map = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedFloat, setSelectedFloat] = useState<string | null>(null);

  return (
    <div className={`min-h-screen bg-gradient-surface ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar darkMode={darkMode} setDarkMode={setDarkMode} />
          
          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="animate-fade-in">
              <Breadcrumb />
              <div className="mt-4">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Ocean Map
                </h1>
                <p className="text-muted-foreground">
                  Interactive map showing ARGO float locations and real-time data
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Map View */}
              <div className="lg:col-span-3">
                <Card className="card-ocean h-[600px]">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapIcon className="h-5 w-5 text-primary" />
                      <span>Global Ocean Map</span>
                    </CardTitle>
                    <CardDescription>
                      Real-time ARGO float positions in the Indian Ocean
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-full">
                    <div className="relative w-full h-[500px] bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg overflow-hidden">
                      {/* Simulated Map Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-teal-200/50 dark:from-blue-800/30 dark:to-teal-800/30">
                        <svg className="w-full h-full opacity-20">
                          <defs>
                            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1"/>
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                      </div>
                      
                      {/* Float Markers */}
                      {mapData.map((float, index) => (
                        <div
                          key={float.id}
                          className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                            selectedFloat === float.id ? 'scale-150 z-10' : 'hover:scale-125'
                          }`}
                          style={{
                            left: `${((float.lon + 180) / 360) * 100}%`,
                            top: `${((float.lat + 90) / 180) * 100}%`,
                          }}
                          onClick={() => setSelectedFloat(selectedFloat === float.id ? null : float.id)}
                        >
                          <div className={`relative ${float.status === 'active' ? 'animate-pulse-glow' : ''}`}>
                            <Anchor className={`h-6 w-6 ${
                              float.status === 'active' ? 'text-green-500' : 'text-orange-500'
                            }`} />
                            {selectedFloat === float.id && (
                              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded-lg p-2 shadow-lg min-w-[120px] z-20">
                                <p className="text-xs font-medium">Float #{float.id}</p>
                                <p className="text-xs text-muted-foreground">{float.temp}</p>
                                <p className="text-xs text-muted-foreground">{float.lastUpdate}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {/* Legend */}
                      <div className="absolute bottom-4 left-4 bg-popover/90 backdrop-blur-sm border border-border rounded-lg p-3">
                        <h4 className="text-sm font-medium mb-2">Float Status</h4>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-xs">
                            <Anchor className="h-4 w-4 text-green-500" />
                            <span>Active ({mapData.filter(f => f.status === 'active').length})</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs">
                            <Anchor className="h-4 w-4 text-orange-500" />
                            <span>Maintenance ({mapData.filter(f => f.status === 'maintenance').length})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Float List */}
              <div className="space-y-6">
                <Card className="card-ocean">
                  <CardHeader>
                    <CardTitle>Active Floats</CardTitle>
                    <CardDescription>
                      {mapData.length} floats in region
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mapData.map((float) => (
                      <div
                        key={float.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedFloat === float.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedFloat(selectedFloat === float.id ? null : float.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">#{float.id}</span>
                          <Badge className={`text-xs ${
                            float.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                          }`}>
                            {float.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex items-center space-x-1">
                            <Navigation className="h-3 w-3" />
                            <span>{float.lat}°, {float.lon}°</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Thermometer className="h-3 w-3" />
                            <span>{float.temp}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Waves className="h-3 w-3" />
                            <span>{float.lastUpdate}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                <Card className="card-ocean">
                  <CardHeader>
                    <CardTitle>Map Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Search Coordinates</label>
                      <Input placeholder="Latitude, Longitude" />
                    </div>
                    <Button className="w-full btn-ocean">
                      <Navigation className="h-4 w-4 mr-2" />
                      Go to Location
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Wind className="h-4 w-4 mr-2" />
                      Weather Overlay
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Droplets className="h-4 w-4 mr-2" />
                      Salinity Layer
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Map;