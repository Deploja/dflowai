import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmployeesList } from "@/components/EmployeesList";
import { TeamsList } from "@/components/TeamsList";
import MainHeader from "@/components/MainHeader";

export default function Organisation() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "employees"
  );

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["employees", "teams"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  return (
    <div>
      <MainHeader />
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-white dark:bg-zinc-950">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <SidebarTrigger className="text-gray-900 dark:text-gray-100" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Organisation
                </h1>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Manage employees and teams
                  </p>
                </div>

                <Tabs
                  value={activeTab}
                  onValueChange={handleTabChange}
                  className="space-y-6"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="employees">Employees</TabsTrigger>
                    <TabsTrigger value="teams">Teams</TabsTrigger>
                  </TabsList>

                  <TabsContent value="employees">
                    <EmployeesList />
                  </TabsContent>

                  <TabsContent value="teams">
                    <TeamsList />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
