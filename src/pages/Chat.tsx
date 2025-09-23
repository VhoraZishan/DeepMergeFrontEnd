import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bot, 
  Sparkles, 
  Database, 
  Map,
  TrendingUp,
  Zap
} from "lucide-react";

const quickQueries = [
  {
    title: "Show me temperature anomalies",
    description: "in the Indian Ocean for the last 6 months",
    icon: TrendingUp,
    category: "Analysis"
  },
  {
    title: "Find ARGO floats near coordinates",
    description: "20°S, 80°E with recent data",
    icon: Map,
    category: "Location"
  },
  {
    title: "Compare salinity profiles", 
    description: "between Arabian Sea and Bay of Bengal",
    icon: Database,
    category: "Comparison"
  },
  {
    title: "Generate depth-time plot",
    description: "for float #4902917 temperature data",
    icon: Sparkles,
    category: "Visualization"
  }
];

const Chat = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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
                  AI Ocean Assistant
                </h1>
                <p className="text-muted-foreground">
                  Ask questions about ARGO float data using natural language
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <div style={{ height: '600px' }}>
                  <ChatInterface />
                </div>
              </div>
              
              {/* Quick Queries Sidebar */}
              <div className="space-y-6">
                <Card className="card-ocean">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bot className="h-5 w-5 text-primary" />
                      <span>Quick Queries</span>
                    </CardTitle>
                    <CardDescription>
                      Try these example questions to get started
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {quickQueries.map((query, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full h-auto p-4 text-left justify-start hover-lift"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <query.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm">{query.title}</p>
                              <Badge variant="outline" className="text-xs">
                                {query.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {query.description}
                            </p>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <Card className="card-ocean">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-primary" />
                      <span>AI Capabilities</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Natural language to SQL conversion</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Oceanographic data interpretation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Automated visualization generation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Multi-modal data analysis</span>
                      </div>
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

export default Chat;