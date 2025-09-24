import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { 
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Thermometer,
  Droplets,
  Waves,
  Download
} from "lucide-react";
import { BackendStatus } from "@/components/system/BackendStatus";
import { useToast } from "@/hooks/use-toast";
import { aiApi, analyticsApi } from "@/lib/api";

const temperatureTrend = [
  { month: "Jul", temp: 23.1, profiles: 145 },
  { month: "Aug", temp: 23.8, profiles: 162 },
  { month: "Sep", temp: 24.5, profiles: 178 },
  { month: "Oct", temp: 25.2, profiles: 194 },
  { month: "Nov", temp: 25.9, profiles: 201 },
  { month: "Dec", temp: 26.3, profiles: 189 },
  { month: "Jan", temp: 26.1, profiles: 176 },
];

const regionData = [
  { name: "Arabian Sea", floats: 45, color: "#3b82f6" },
  { name: "Bay of Bengal", floats: 38, color: "#06b6d4" },
  { name: "Indian Ocean", floats: 67, color: "#10b981" },
  { name: "Southern Ocean", floats: 23, color: "#8b5cf6" },
];

const depthProfiles = [
  { depth: "0-50m", count: 234, percentage: 28 },
  { depth: "50-200m", count: 189, percentage: 23 },
  { depth: "200-500m", count: 156, percentage: 19 },
  { depth: "500-1000m", count: 134, percentage: 16 },
  { depth: "1000-2000m", count: 112, percentage: 14 },
];

const Analytics = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [timeRange, setTimeRange] = useState("6months");
  const { toast } = useToast();

  const runSummary = async () => {
    try {
      const res = await aiApi.getSummary("oceanography", "kerala");
      toast({ 
        title: "AI Summary", 
        description: res.summary || "Received summary from backend." 
      });
    } catch (e: any) {
      toast({ 
        title: "Summary failed", 
        description: String(e?.message || e), 
        variant: "destructive" 
      });
    }
  };

  const runCorrelation = async () => {
    try {
      const res = await analyticsApi.correlate("sst", "Sardinella longiceps", "kerala");
      toast({ 
        title: "Correlation Analysis", 
        description: `Pearson R: ${res.pearson_r?.toFixed(3) || 'N/A'} - ${res.message}` 
      });
    } catch (e: any) {
      toast({ 
        title: "Correlation failed", 
        description: String(e?.message || e), 
        variant: "destructive" 
      });
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
                    Analytics Dashboard
                  </h1>
                  <p className="text-muted-foreground">
                    Advanced oceanographic data analysis and insights
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Last 30 days
                  </Button>
                  <Button variant="outline" size="sm">
                    Last 6 months
                  </Button>
                  <Button className="btn-ocean" size="sm" onClick={runSummary}>
                    <Download className="h-4 w-4 mr-2" />
                    AI Summary
                  </Button>
                  <Button className="btn-ocean" size="sm" onClick={runCorrelation}>
                    <Activity className="h-4 w-4 mr-2" />
                    Run Correlation
                  </Button>
                </div>
              </div>
              <BackendStatus />
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Data Quality</p>
                    <p className="text-2xl font-bold">98.7%</p>
                    <p className="text-xs text-green-600">+2.3% from last month</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </Card>
              
              <Card className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Avg Temperature</p>
                    <p className="text-2xl font-bold">25.3°C</p>
                    <p className="text-xs text-blue-600">+0.8°C seasonal</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <Thermometer className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </Card>
              
              <Card className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Avg Salinity</p>
                    <p className="text-2xl font-bold">34.7 PSU</p>
                    <p className="text-xs text-teal-600">Within normal range</p>
                  </div>
                  <div className="p-3 rounded-lg bg-teal-100 dark:bg-teal-900/20">
                    <Droplets className="h-6 w-6 text-teal-600" />
                  </div>
                </div>
              </Card>
              
              <Card className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Active Profiles</p>
                    <p className="text-2xl font-bold">1,247</p>
                    <p className="text-xs text-purple-600">+156 this week</p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                    <Waves className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Temperature Trend */}
              <Card className="card-ocean">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Temperature Trend Analysis</span>
                  </CardTitle>
                  <CardDescription>
                    6-month temperature patterns in the Indian Ocean
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={temperatureTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="temp" 
                          stroke="hsl(var(--primary))"
                          strokeWidth={3}
                          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Regional Distribution */}
              <Card className="card-ocean">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChartIcon className="h-5 w-5 text-primary" />
                    <span>Regional Float Distribution</span>
                  </CardTitle>
                  <CardDescription>
                    Active ARGO floats by ocean region
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={regionData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="floats"
                          label={({ name, floats }) => `${name}: ${floats}`}
                        >
                          {regionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Depth Profile Analysis */}
              <Card className="card-ocean">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span>Depth Profile Distribution</span>
                  </CardTitle>
                  <CardDescription>
                    Measurement frequency by depth range
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={depthProfiles}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="depth" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Processing Status */}
              <Card className="card-ocean">
                <CardHeader>
                  <CardTitle>Data Processing Status</CardTitle>
                  <CardDescription>
                    Real-time processing pipeline status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Raw Data Ingestion</span>
                      <span>98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Quality Control</span>
                      <span>94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Profile Generation</span>
                      <span>89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Database Indexing</span>
                      <span>76%</span>
                    </div>
                    <Progress value={76} className="h-2" />
                  </div>

                  <div className="pt-4 space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">System Status</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Operational
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <p className="font-medium">15.2TB</p>
                        <p className="text-muted-foreground">Processed Today</p>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <p className="font-medium">847</p>
                        <p className="text-muted-foreground">New Profiles</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Analytics;