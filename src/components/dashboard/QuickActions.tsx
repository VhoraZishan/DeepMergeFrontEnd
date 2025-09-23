import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  MessageSquareText, 
  Upload, 
  Map, 
  BarChart3, 
  Download, 
  Zap 
} from "lucide-react";

const actions = [
  {
    title: "Start AI Chat",
    description: "Ask questions about ocean data",
    icon: MessageSquareText,
    href: "/chat",
    gradient: "from-blue-500 to-purple-600"
  },
  {
    title: "Upload Data",
    description: "Import new NetCDF files",
    icon: Upload,
    href: "/data",
    gradient: "from-teal-500 to-blue-600"
  },
  {
    title: "View Map",
    description: "Explore float locations",
    icon: Map,
    href: "/map",
    gradient: "from-green-500 to-teal-600"
  },
  {
    title: "Analytics",
    description: "Generate reports",
    icon: BarChart3,
    href: "/analytics",
    gradient: "from-purple-500 to-pink-600"
  },
  {
    title: "Global View",
    description: "Worldwide data overview",
    icon: Download,
    href: "/global",
    gradient: "from-orange-500 to-red-600"
  },
  {
    title: "Quick Search",
    description: "Find datasets quickly",
    icon: Zap,
    href: "/search",
    gradient: "from-yellow-500 to-orange-600"
  }
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card className="card-ocean">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 hover-lift group border-border/50 hover:border-primary/50"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => navigate(action.href)}
            >
              <div className={`p-3 rounded-lg bg-gradient-to-r ${action.gradient} text-white group-hover:scale-110 transition-transform`}>
                <action.icon className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}