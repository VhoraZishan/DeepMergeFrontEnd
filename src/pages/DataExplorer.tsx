import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Database,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Thermometer,
  Droplets,
  MapPin
} from "lucide-react";
import { BackendStatus } from "@/components/system/BackendStatus";
import { useToast } from "@/hooks/use-toast";
import { aiApi } from "@/lib/api";

const sampleData = [
  {
    id: "ARG001",
    floatId: "4902917",
    date: "2024-01-15",
    location: "10.5°S, 85.3°E",
    depth: "0-2000m",
    temperature: "24.3°C",
    salinity: "34.8 PSU",
    profiles: 847,
    status: "processed"
  },
  {
    id: "ARG002", 
    floatId: "4902918",
    date: "2024-01-14",
    location: "8.2°S, 87.1°E", 
    depth: "0-1800m",
    temperature: "25.1°C",
    salinity: "34.6 PSU",
    profiles: 623,
    status: "processing"
  },
  {
    id: "ARG003",
    floatId: "4902919", 
    date: "2024-01-13",
    location: "12.1°S, 83.7°E",
    depth: "0-2000m", 
    temperature: "23.8°C",
    salinity: "34.9 PSU",
    profiles: 1024,
    status: "processed"
  },
  {
    id: "ARG004",
    floatId: "4902920",
    date: "2024-01-12", 
    location: "9.8°S, 89.2°E",
    depth: "0-1950m",
    temperature: "24.7°C", 
    salinity: "34.7 PSU",
    profiles: 756,
    status: "processed"
  }
];

const DataExplorer = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const { toast } = useToast();

  const suggestSql = async () => {
    try {
      const res = await aiApi.suggestSql("Show recent temperature profiles from ARGO floats in the Indian Ocean");
      toast({ 
        title: "SQL Suggested", 
        description: res.sql || "Generated SQL query from backend." 
      });
    } catch (e: any) {
      toast({ 
        title: "SQL failed", 
        description: String(e?.message || e), 
        variant: "destructive" 
      });
    }
  };

  const suggestVisualization = async () => {
    try {
      const res = await aiApi.suggestVisualization(
        "Show temperature trends over time", 
        ["time", "temperature", "depth"]
      );
      toast({ 
        title: "Visualization Suggested", 
        description: JSON.stringify(res.spec || res, null, 2) 
      });
    } catch (e: any) {
      toast({ 
        title: "Visualization failed", 
        description: String(e?.message || e), 
        variant: "destructive" 
      });
    }
  };

  const filteredData = sampleData.filter(item => 
    item.floatId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  Data Explorer
                </h1>
                <p className="text-muted-foreground">
                  Browse and analyze ARGO float datasets and oceanographic measurements
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <BackendStatus />
                  <Button size="sm" variant="outline" onClick={suggestSql}>Suggest SQL</Button>
                  <Button size="sm" variant="outline" onClick={suggestVisualization}>Suggest Viz</Button>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <Card className="card-ocean">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-primary" />
                  <span>Search & Filter</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Input 
                      placeholder="Search by float ID, location, or dataset..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Date Range</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Advanced Filters</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Data Table */}
            <Card className="card-ocean">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-primary" />
                    <span>ARGO Float Datasets</span>
                  </div>
                  <Badge className="bg-primary/10 text-primary">
                    {filteredData.length} datasets found
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Recent oceanographic data from autonomous profiling floats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 font-medium">Dataset ID</th>
                        <th className="text-left py-3 px-2 font-medium">Float ID</th>
                        <th className="text-left py-3 px-2 font-medium">Date</th>
                        <th className="text-left py-3 px-2 font-medium">Location</th>
                        <th className="text-left py-3 px-2 font-medium">Depth Range</th>
                        <th className="text-left py-3 px-2 font-medium">Temperature</th>
                        <th className="text-left py-3 px-2 font-medium">Salinity</th>
                        <th className="text-left py-3 px-2 font-medium">Profiles</th>
                        <th className="text-left py-3 px-2 font-medium">Status</th>
                        <th className="text-left py-3 px-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, index) => (
                        <tr 
                          key={item.id}
                          className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${
                            selectedDataset === item.id ? 'bg-primary/5' : ''
                          }`}
                          onClick={() => setSelectedDataset(selectedDataset === item.id ? null : item.id)}
                        >
                          <td className="py-3 px-2 font-medium">{item.id}</td>
                          <td className="py-3 px-2">{item.floatId}</td>
                          <td className="py-3 px-2">{item.date}</td>
                          <td className="py-3 px-2">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">{item.location}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2">{item.depth}</td>
                          <td className="py-3 px-2">
                            <div className="flex items-center space-x-1">
                              <Thermometer className="h-3 w-3 text-red-500" />
                              <span>{item.temperature}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center space-x-1">
                              <Droplets className="h-3 w-3 text-blue-500" />
                              <span>{item.salinity}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2">{item.profiles}</td>
                          <td className="py-3 px-2">
                            <Badge className={`text-xs ${
                              item.status === 'processed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            }`}>
                              {item.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center space-x-1">
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Dataset Details */}
            {selectedDataset && (
              <Card className="card-ocean animate-fade-in">
                <CardHeader>
                  <CardTitle>Dataset Details - {selectedDataset}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Float ID:</span>
                          <span>{filteredData.find(d => d.id === selectedDataset)?.floatId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Collection Date:</span>
                          <span>{filteredData.find(d => d.id === selectedDataset)?.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Profiles:</span>
                          <span>{filteredData.find(d => d.id === selectedDataset)?.profiles}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Measurements</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Surface Temperature:</span>
                          <span>{filteredData.find(d => d.id === selectedDataset)?.temperature}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Surface Salinity:</span>
                          <span>{filteredData.find(d => d.id === selectedDataset)?.salinity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Depth Range:</span>
                          <span>{filteredData.find(d => d.id === selectedDataset)?.depth}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Actions</h4>
                      <div className="space-y-2">
                        <Button className="w-full btn-ocean">
                          <Eye className="h-4 w-4 mr-2" />
                          View Profiles
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Download NetCDF
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Search className="h-4 w-4 mr-2" />
                          Query Data
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DataExplorer;