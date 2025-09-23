import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: ReactNode;
  description?: string;
  gradient?: boolean;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  description,
  gradient = false 
}: StatCardProps) {
  return (
    <Card className={cn(
      "stat-card hover-lift group cursor-pointer",
      gradient && "gradient-surface"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 text-muted-foreground mb-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              {icon}
            </div>
            <p className="text-sm font-medium">{title}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        
        <div className={cn(
          "text-sm font-medium px-2 py-1 rounded-full",
          changeType === "positive" && "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20",
          changeType === "negative" && "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20",
          changeType === "neutral" && "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20"
        )}>
          {change}
        </div>
      </div>
    </Card>
  );
}