import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  Waves, 
  Thermometer, 
  Activity, 
  TrendingUp,
  MapPin,
  Database,
  Satellite,
  Timer,
  Users
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { BackendStatus } from "@/components/system/BackendStatus";

const Global = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const globalStats = [
    { title: "Total ARGO Floats", value: "4,827", change: "+142", icon: Waves, color: "text-blue-600" },
    { title: "Active Countries", value: "47", change: "+3", icon: Globe, color: "text-green-600" },
    { title: "Ocean Coverage", value: "85%", change: "+2%", icon: MapPin, color: "text-purple-600" },
    { title: "Data Points/Day", value: "12.4K", change: "+1.2K", icon: Database, color: "text-orange-600" }
  ];

  const temperatureData = [
    { month: 'Jan', temperature: 22.3, depth: 100 },
    { month: 'Feb', temperature: 22.8, depth: 120 },
    { month: 'Mar', temperature: 23.2, depth: 110 },
    { month: 'Apr', temperature: 24.1, depth: 95 },
    { month: 'May', temperature: 25.3, depth: 85 },
    { month: 'Jun', temperature: 26.7, depth: 80 }
  ];

  const regionData = [
    { name: 'Pacific', value: 35, color: '#0ea5e9' },
    { name: 'Atlantic', value: 28, color: '#06b6d4' },
    { name: 'Indian', value: 22, color: '#8b5cf6' },
    { name: 'Arctic', value: 15, color: '#10b981' }
  ];

  const activityData = [
    { region: 'Pacific', active: 1680, total: 1820 },
    { region: 'Atlantic', value: 1234, total: 1400 },
    { region: 'Indian', active: 892, total: 980 },
    { region: 'Arctic', active: 321, total: 380 }
  ];

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
                <h1 className="text-3xl font-bold text-foreground mb-2">Global Ocean Monitoring</h1>
                <p className="text-muted-foreground">Worldwide ARGO float network status and data overview</p>
                <div className="mt-2">
                  <BackendStatus />
                </div>
              </div>
            </div>

            {/* Global Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
              {globalStats.map((stat, index) => (
                <Card key={stat.title} className="card-ocean hover-lift" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                          <Badge variant="secondary" className="text-xs">
                            {stat.change}
                          </Badge>
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg bg-gradient-ocean ${stat.color}`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Global Temperature Trends */}
              <Card className="card-ocean">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Thermometer className="h-5 w-5 text-primary" />
                    <span>Global Temperature Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={temperatureData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="temperature" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Ocean Coverage Distribution */}
              <Card className="card-ocean">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <span>Ocean Coverage Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={regionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name} ${value}%`}
                      >
                        {regionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Regional Activity */}
              <Card className="card-ocean">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <span>Regional Float Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="active" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="card-ocean">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Satellite className="h-5 w-5 text-primary" />
                    <span>System Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Data Processing</span>
                      <span>98.7%</span>
                    </div>
                    <Progress value={98.7} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Float Connectivity</span>
                      <span>94.2%</span>
                    </div>
                    <Progress value={94.2} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Data Quality</span>
                      <span>96.8%</span>
                    </div>
                    <Progress value={96.8} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                      <Timer className="h-5 w-5 text-green-600 mx-auto mb-1" />
                      <p className="text-sm font-medium">99.9% Uptime</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                      <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-sm font-medium">247 Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="card-ocean">
              <CardHeader>
                <CardTitle>Global Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-12 bg-gradient-ocean text-white hover:opacity-90">
                    <Database className="h-4 w-4 mr-2" />
                    Export Global Data
                  </Button>
                  <Button variant="outline" className="h-12 border-primary/50 hover:bg-primary/10">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline" className="h-12 border-primary/50 hover:bg-primary/10">
                    <MapPin className="h-4 w-4 mr-2" />
                    View Interactive Map
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Global;