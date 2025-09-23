import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

const activities = [
  {
    id: 1,
    type: "data_upload",
    title: "New ARGO float data processed",
    description: "Float #4902917 - 847 new profiles added",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    status: "completed",
    avatar: "AR"
  },
  {
    id: 2,
    type: "analysis",
    title: "Temperature anomaly detected",
    description: "Arabian Sea region showing 2.3°C above average",
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    status: "alert",
    avatar: "TA"
  },
  {
    id: 3,
    type: "query",
    title: "AI chat query processed",
    description: "Salinity profiles near equator analysis completed",
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    status: "completed",
    avatar: "AI"
  },
  {
    id: 4,
    type: "maintenance",
    title: "System maintenance scheduled",
    description: "Database optimization planned for 02:00 UTC",
    timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    status: "scheduled",
    avatar: "SM"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "alert":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    case "scheduled":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

export function RecentActivity() {
  return (
    <Card className="card-ocean h-fit">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest updates from your ocean data platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div 
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Avatar className="h-8 w-8 mt-0.5">
                <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-teal-500 text-white">
                  {activity.avatar}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.title}
                  </p>
                  <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground mb-1">
                  {activity.description}
                </p>
                
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}