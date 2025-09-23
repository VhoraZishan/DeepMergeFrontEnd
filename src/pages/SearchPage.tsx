import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search,
  Filter,
  MapPin,
  Calendar,
  Thermometer,
  Database,
  Download,
  Star,
  Clock
} from "lucide-react";

const searchResults = [
  {
    id: "1",
    type: "dataset",
    title: "ARGO Float Temperature Profiles - Indian Ocean 2024",
    description: "Comprehensive temperature measurements from autonomous profiling floats covering the Indian Ocean region for January-March 2024.",
    location: "Indian Ocean",
    date: "2024-01-15",
    size: "2.3 GB",
    profiles: 1247,
    tags: ["temperature", "ARGO", "profiles", "2024"]
  },
  {
    id: "2", 
    type: "float",
    title: "Float #4902917 - Active in Arabian Sea",
    description: "Currently transmitting real-time oceanographic data from the Arabian Sea region. Last update 2 hours ago.",
    location: "10.5°S, 85.3°E",
    date: "2024-01-20",
    size: "Active",
    profiles: 847,
    tags: ["active", "arabian-sea", "real-time"]
  },
  {
    id: "3",
    type: "analysis", 
    title: "Temperature Anomaly Analysis - Bay of Bengal",
    description: "Statistical analysis of temperature anomalies detected in Bay of Bengal region showing 2.3°C above seasonal average.",
    location: "Bay of Bengal",
    date: "2024-01-18",
    size: "156 MB",
    profiles: 423,
    tags: ["anomaly", "analysis", "bay-of-bengal", "temperature"]
  },
  {
    id: "4",
    type: "dataset",
    title: "Salinity Measurements - Equatorial Region Q4 2023", 
    description: "Quarterly salinity profile data from ARGO floats deployed near the equatorial region, processed and quality controlled.",
    location: "Equatorial Indian Ocean",
    date: "2023-12-31", 
    size: "1.8 GB",
    profiles: 892,
    tags: ["salinity", "equatorial", "Q4", "2023"]
  },
  {
    id: "5",
    type: "report",
    title: "Monthly Ocean Health Report - January 2024",
    description: "Comprehensive monthly analysis of ocean conditions including temperature trends, salinity variations, and float performance metrics.",
    location: "Global",
    date: "2024-01-31",
    size: "45 MB", 
    profiles: 2156,
    tags: ["report", "monthly", "health", "global"]
  }
];

const popularSearches = [
  "temperature profiles Arabian Sea",
  "ARGO float locations",
  "salinity anomalies 2024", 
  "depth profile analysis",
  "Bay of Bengal data",
  "equatorial measurements"
];

const SearchPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "dataset":
        return <Database className="h-5 w-5 text-blue-500" />;
      case "float":
        return <MapPin className="h-5 w-5 text-green-500" />;
      case "analysis":
        return <Thermometer className="h-5 w-5 text-orange-500" />;
      case "report":
        return <Calendar className="h-5 w-5 text-purple-500" />;
      default:
        return <Search className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "dataset":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "float":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "analysis":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "report":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

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
                  Search Ocean Data
                </h1>
                <p className="text-muted-foreground">
                  Find datasets, floats, analyses, and reports across the oceanographic database
                </p>
              </div>
            </div>

            {/* Search Interface */}
            <Card className="card-ocean">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Main Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search for datasets, floats, locations, or parameters..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 text-lg"
                    />
                  </div>

                  {/* Quick Filters */}
                  <div className="flex items-center space-x-2 flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="flex items-center space-x-1">
                      <Filter className="h-4 w-4" />
                      <span>Filters</span>
                    </Button>
                    <Button variant="outline" size="sm">Date Range</Button>
                    <Button variant="outline" size="sm">Data Type</Button>
                    <Button variant="outline" size="sm">Location</Button>
                    <Button variant="outline" size="sm">Parameters</Button>
                  </div>

                  {/* Popular Searches */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Popular searches:</p>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((search, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7 px-3 text-muted-foreground hover:text-primary"
                          onClick={() => setSearchQuery(search)}
                        >
                          {search}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search Results */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Results List */}
              <div className="lg:col-span-3 space-y-6">
                <Card className="card-ocean">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Search Results</span>
                      <Badge className="bg-primary/10 text-primary">
                        {searchResults.length} results found
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Showing results for oceanographic data and resources
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {searchResults.map((result, index) => (
                      <div
                        key={result.id}
                        className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all hover-lift cursor-pointer"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="p-3 rounded-lg bg-muted/50">
                            {getTypeIcon(result.type)}
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium text-foreground hover:text-primary transition-colors">
                                  {result.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {result.description}
                                </p>
                              </div>
                              <Button variant="ghost" size="sm" className="ml-4">
                                <Star className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{result.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{result.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Database className="h-3 w-3" />
                                <span>{result.size}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Thermometer className="h-3 w-3" />
                                <span>{result.profiles} profiles</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Badge className={`text-xs ${getTypeColor(result.type)}`}>
                                  {result.type}
                                </Badge>
                                <div className="flex space-x-1">
                                  {result.tags.slice(0, 3).map((tag, tagIndex) => (
                                    <Badge key={tagIndex} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {result.tags.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{result.tags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                                <Button size="sm" className="btn-ocean">
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Filters */}
              <div className="space-y-6">
                <Card className="card-ocean">
                  <CardHeader>
                    <CardTitle>Search Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Data Type</h4>
                      <div className="space-y-2">
                        {["Dataset", "Float", "Analysis", "Report"].map((type) => (
                          <label key={type} className="flex items-center space-x-2 text-sm">
                            <input type="checkbox" className="rounded border-border" />
                            <span>{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Location</h4>
                      <div className="space-y-2">
                        {["Arabian Sea", "Bay of Bengal", "Indian Ocean", "Equatorial Region"].map((location) => (
                          <label key={location} className="flex items-center space-x-2 text-sm">
                            <input type="checkbox" className="rounded border-border" />
                            <span>{location}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Parameters</h4>
                      <div className="space-y-2">
                        {["Temperature", "Salinity", "Depth", "Pressure"].map((param) => (
                          <label key={param} className="flex items-center space-x-2 text-sm">
                            <input type="checkbox" className="rounded border-border" />
                            <span>{param}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="card-ocean">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Recent Searches</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {popularSearches.slice(0, 4).map((search, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-left h-auto p-2"
                          onClick={() => setSearchQuery(search)}
                        >
                          <div className="flex items-center space-x-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs truncate">{search}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
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

export default SearchPage;