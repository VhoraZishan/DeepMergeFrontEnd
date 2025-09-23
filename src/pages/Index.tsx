import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { 
  Waves, 
  Thermometer, 
  Activity, 
  Database,
  TrendingUp,
  Globe
} from "lucide-react";
import oceanHero from "@/assets/ocean-hero.jpg";
import { useEffect } from "react";
import { fetchJson } from "@/lib/utils";
import { BackendStatus } from "@/components/system/BackendStatus";

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [apiOk, setApiOk] = useState<boolean | null>(null);

  useEffect(() => {
    // simple health check to backend
    fetchJson<{ status: string }>("/healthz")
      .then((res) => setApiOk(res.status === "ok"))
      .catch(() => setApiOk(false));
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-surface ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <TopBar darkMode={darkMode} setDarkMode={setDarkMode} />
          
          {/* Main Dashboard */}
          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Hero Section */}
            <div className="animate-fade-in">
              <Breadcrumb />
              <BackendStatus />
              <div className="mt-4 relative overflow-hidden rounded-2xl">
                <div 
                  className="h-48 bg-cover bg-center bg-no-repeat relative"
                  style={{ backgroundImage: `url(${oceanHero})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/60 to-teal-800/80" />
                  <div className="relative z-10 h-full flex items-center px-8">
                    <div className="text-white">
                      <h1 className="text-4xl font-bold mb-2 animate-slide-up">
                        CMLRE Data Platform
                      </h1>
                      {apiOk !== null && (
                        <p className={`text-sm mb-1 ${apiOk ? "text-green-200" : "text-red-200"}`}>
                          Backend: {apiOk ? "Connected" : "Offline"}
                        </p>
                      )}
                      <p className="text-xl opacity-90 animate-slide-up" style={{ animationDelay: '200ms' }}>
                        Your AI-powered oceanographic data discovery and visualization platform
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
              <StatCard
                title="Active ARGO Floats"
                value="4,827"
                change="+12.3%"
                changeType="positive"
                icon={<Waves className="h-5 w-5" />}
                description="Currently transmitting data"
              />
              <StatCard
                title="Temperature Profiles"
                value="2.4M"
                change="+5.7%"
                changeType="positive"
                icon={<Thermometer className="h-5 w-5" />}
                description="Total profiles collected"
              />
              <StatCard
                title="Data Processing"
                value="98.7%"
                change="+0.3%"
                changeType="positive"
                icon={<Activity className="h-5 w-5" />}
                description="System uptime"
              />
              <StatCard
                title="Ocean Coverage"
                value="85%"
                change="stable"
                changeType="neutral"
                icon={<Globe className="h-5 w-5" />}
                description="Global ocean monitoring"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Charts */}
              <div className="lg:col-span-2 space-y-6">
                <ChartCard />
                <QuickActions />
              </div>
              
              {/* Right Column - Activity & Chat */}
              <div className="space-y-6">
                <RecentActivity />
                <ChatInterface />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
