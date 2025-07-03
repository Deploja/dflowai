
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, FileText, Users } from "lucide-react";
import { Link } from "react-router-dom";

export function DashboardQuickActions() {
  const quickActions = [
    {
      title: "Add Consultant",
      description: "Register a new consultant",
      icon: Plus,
      href: "/consultants",
      color: "bg-blue-500"
    },
    {
      title: "Search Jobs",
      description: "Find matching opportunities",
      icon: Search,
      href: "/job-search",
      color: "bg-green-500"
    },
    {
      title: "Create CV",
      description: "Generate new CV",
      icon: FileText,
      href: "/cv/employees",
      color: "bg-purple-500"
    },
    {
      title: "View Matches",
      description: "Check consultant matches",
      icon: Users,
      href: "/matches",
      color: "bg-orange-500"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                asChild
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
              >
                <Link to={action.href}>
                  <div className={`p-2 rounded-full ${action.color} text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">{action.title}</p>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </div>
                </Link>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
