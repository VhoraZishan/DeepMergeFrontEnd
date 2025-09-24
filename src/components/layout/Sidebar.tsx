import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Waves, 
  BarChart3, 
  MessageSquare, 
  Database, 
  Map, 
  Settings, 
  Search,
  Activity,
  Globe,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "AI Chat", href: "/chat", icon: MessageSquare },
  { name: "Ocean Map", href: "/map", icon: Map },
  { name: "Data Explorer", href: "/data", icon: Database },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "Live Feeds", href: "/feeds", icon: Activity },
  { name: "Global View", href: "/global", icon: Globe },
  { name: "Search", href: "/search", icon: Search },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const location = useLocation();

  return (
    <div className={cn(
      "relative h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900",
      "border-r border-slate-700/50 transition-all duration-300 ease-in-out",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-teal-900/20" />
      
      {/* Header */}
      <div className="relative flex items-center justify-between p-4 border-b border-slate-700/50">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500">
              <Waves className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">CMLRE Data Platform</h1>
              <p className="text-xs text-slate-400">Ocean Data Platform</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white hover:bg-slate-700/50"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="relative p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                "relative group",
                isActive
                  ? "bg-gradient-to-r from-blue-500/20 to-teal-500/20 text-white border border-blue-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-teal-400 rounded-r-full" />
              )}
              
              <item.icon className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
              
              {!collapsed && (
                <span className="truncate">{item.name}</span>
              )}
              
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50">
        <NavLink
          to="/settings"
          className={cn(
            "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
            "text-slate-300 hover:text-white hover:bg-slate-700/50",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <Settings className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </div>
    </div>
  );
}