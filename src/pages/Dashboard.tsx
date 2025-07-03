import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, Users, MessageSquare, Calendar } from "lucide-react";
import { DashboardOverview } from "@/components/DashboardOverview";
import { DashboardQuickActions } from "@/components/DashboardQuickActions";
import MainHeader from "@/components/MainHeader";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Consultants",
      value: "127",
      icon: Users,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Active Projects",
      value: "23",
      icon: Calendar,
      change: "+3%",
      changeType: "positive" as const,
    },
    {
      title: "Messages",
      value: "89",
      icon: MessageSquare,
      change: "-2%",
      changeType: "negative" as const,
    },
    {
      title: "Revenue",
      value: "$45,231",
      icon: BarChart3,
      change: "+18%",
      changeType: "positive" as const,
    },
  ];

  return (
    <div>
      <MainHeader />
      <SidebarProvider>
        <div className="min-h-screen flex flex-col">
          <div className="flex flex-1 overflow-hidden z-0 ">
            <AppSidebar />
            <SidebarInset>
              <div className="flex-1 p-6 space-y-6">
                {/* Stats Grid */}
                <h1 className="text-xl font-semibold">Dashboard</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            {stat.title}
                          </CardTitle>
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <p
                            className={`text-xs ${
                              stat.changeType === "positive"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {stat.change} from last month
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Overview Section */}
                <DashboardOverview />

                {/* Quick Actions */}
                <DashboardQuickActions />
              </div>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
