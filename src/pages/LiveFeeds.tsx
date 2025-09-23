import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { 
  Activity,
  Wifi,
  WifiOff,
  Thermometer,
  Droplets,
  Navigation,
  AlertTriangle,
  CheckCircle,
  Clock,
  Waves
} from "lucide-react";
import { BackendStatus } from "@/components/system/BackendStatus";
import { Button as UIButton } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { fetchJson } from "@/lib/utils";

const liveFeeds = [
  {
    id: "feed-001",
    floatId: "4902917",
    location: "10.5°S, 85.3°E",
    status: "transmitting",
    lastUpdate: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
    temperature: 24.3,
    salinity: 34.8,
    depth: 15,
    battery: 87,
    signalStrength: 94
  },
  {
    id: "feed-002", 
    floatId: "4902918",
    location: "8.2°S, 87.1°E",
    status: "transmitting",
    lastUpdate: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    temperature: 25.1,
    salinity: 34.6,
    depth: 8,
    battery: 92,
    signalStrength: 89
  },
  {
    id: "feed-003",
    floatId: "4902919", 
    location: "12.1°S, 83.7°E",
    status: "maintenance",
    lastUpdate: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    temperature: 23.8,
    salinity: 34.9,
    depth: 0,
    battery: 45,
    signalStrength: 67
  },
  {
    id: "feed-004",
    floatId: "4902920",
    location: "9.8°S, 89.2°E", 
    status: "diving",
    lastUpdate: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    temperature: 24.7,
    salinity: 34.7,
    depth: 156,
    battery: 78,
    signalStrength: 0
  }
];

const recentAlerts = [
  {
    id: "alert-001",
    type: "temperature",
    message: "Temperature anomaly detected in Arabian Sea",
    severity: "high",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    floatId: "4902917"
  },
  {
    id: "alert-002",
    type: "battery",
    message: "Low battery warning for float #4902919",
    severity: "medium", 
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    floatId: "4902919"
  },
  {
    id: "alert-003",
    type: "communication",
    message: "Signal lost from float #4902920",
    severity: "low",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    floatId: "4902920"
  }
];

const LiveFeeds = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "transmitting":
        return <Wifi className="h-4 w-4 text-green-500" />;
      case "diving":
        return <Navigation className="h-4 w-4 text-blue-500" />;
      case "maintenance":
        return <WifiOff className="h-4 w-4 text-orange-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "transmitting":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "diving":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "maintenance":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
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
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Live Data Feeds
                  </h1>
                  <p className="text-muted-foreground">
                    Real-time monitoring of ARGO float transmissions and status updates
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-800 dark:text-green-400">Live</span>
                  </div>
                  <Button variant="outline" size="sm">Auto Refresh: ON</Button>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <BackendStatus />
                <UIButton size="sm" variant="outline" onClick={async () => {
                  try {
                    const res = await fetchJson<{ active_connections: number }>("/ws/status");
                    // eslint-disable-next-line no-alert
                    alert(`WS connections: ${res.active_connections}`);
                  } catch (e) {
                    // eslint-disable-next-line no-alert
                    alert("WS status failed");
                  }
                }}>Check WS</UIButton>
              </div>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Active Floats</p>
                    <p className="text-2xl font-bold">
                      {liveFeeds.filter(f => f.status === 'transmitting').length}
                    </p>
                  </div>
                  <Wifi className="h-6 w-6 text-green-500" />
                </div>
              </Card>
              
              <Card className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Diving</p>
                    <p className="text-2xl font-bold">
                      {liveFeeds.filter(f => f.status === 'diving').length}
                    </p>
                  </div>
                  <Navigation className="h-6 w-6 text-blue-500" />
                </div>
              </Card>
              
              <Card className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Maintenance</p>
                    <p className="text-2xl font-bold">
                      {liveFeeds.filter(f => f.status === 'maintenance').length}
                    </p>
                  </div>
                  <WifiOff className="h-6 w-6 text-orange-500" />
                </div>
              </Card>
              
              <Card className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Alerts</p>
                    <p className="text-2xl font-bold">{recentAlerts.length}</p>
                  </div>
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Live Feeds */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="card-ocean">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-primary" />
                      <span>Active Float Feeds</span>
                    </CardTitle>
                    <CardDescription>
                      Real-time data transmission status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {liveFeeds.map((feed, index) => (
                      <div
                        key={feed.id}
                        className={`p-4 rounded-lg border transition-all cursor-pointer ${
                          selectedFeed === feed.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedFeed(selectedFeed === feed.id ? null : feed.id)}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-xs">
                                {feed.floatId.slice(-2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">Float #{feed.floatId}</p>
                              <p className="text-xs text-muted-foreground">{feed.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(feed.status)}
                            <Badge className={`text-xs ${getStatusColor(feed.status)}`}>
                              {feed.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Thermometer className="h-4 w-4 text-red-500" />
                            <span>{feed.temperature}°C</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Droplets className="h-4 w-4 text-blue-500" />
                            <span>{feed.salinity} PSU</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Waves className="h-4 w-4 text-teal-500" />
                            <span>{feed.depth}m</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDistanceToNow(feed.lastUpdate, { addSuffix: true })}</span>
                          </div>
                        </div>
                        
                        {feed.status === 'transmitting' && (
                          <div className="mt-3 flex items-center space-x-4 text-xs">
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>Battery: {feed.battery}%</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>Signal: {feed.signalStrength}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Alerts and Notifications */}
              <div className="space-y-6">
                <Card className="card-ocean">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                      <span>Recent Alerts</span>
                    </CardTitle>
                    <CardDescription>
                      System notifications and warnings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentAlerts.map((alert, index) => (
                      <div
                        key={alert.id}
                        className="p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {alert.type === 'temperature' && <Thermometer className="h-4 w-4 text-red-500" />}
                            {alert.type === 'battery' && <Activity className="h-4 w-4 text-orange-500" />}
                            {alert.type === 'communication' && <WifiOff className="h-4 w-4 text-blue-500" />}
                          </div>
                          <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mb-1">{alert.message}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Float #{alert.floatId}</span>
                          <span>{formatDistanceToNow(alert.timestamp, { addSuffix: true })}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                <Card className="card-ocean">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>System Health</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/10 rounded">
                      <span className="text-sm">Data Processing</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Operational</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/10 rounded">
                      <span className="text-sm">Database</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Healthy</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/10 rounded">
                      <span className="text-sm">Network</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-xs text-yellow-600">Degraded</span>
                      </div>
                    </div>
                    
                    <div className="pt-3 text-center">
                      <Button variant="outline" size="sm" className="w-full">
                        View Full Status
                      </Button>
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

export default LiveFeeds;