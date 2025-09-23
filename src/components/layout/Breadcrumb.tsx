import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

const routeLabels: Record<string, string> = {
  "/": "Dashboard",
  "/chat": "AI Chat",
  "/map": "Ocean Map", 
  "/data": "Data Explorer",
  "/analytics": "Analytics",
  "/feeds": "Live Feeds",
  "/global": "Global View",
  "/search": "Search",
  "/settings": "Settings"
};

export function Breadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/", current: location.pathname === "/" }
  ];

  let currentPath = "";
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;
    const label = routeLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    breadcrumbItems.push({
      label,
      href: currentPath,
      current: isLast
    });
  });

  // Remove duplicate dashboard if we're on the home page
  if (location.pathname === "/" && breadcrumbItems.length > 1) {
    breadcrumbItems.splice(1);
  }

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
            )}
            
            {index === 0 && (
              <Home className="h-4 w-4 mr-2 text-muted-foreground" />
            )}
            
            {item.current ? (
              <span className="font-medium text-foreground">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className={cn(
                  "font-medium text-muted-foreground hover:text-foreground transition-colors",
                  index === 0 && "text-primary hover:text-primary/80"
                )}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}