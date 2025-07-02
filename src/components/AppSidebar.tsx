
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Brain, Sparkles } from "lucide-react";
import { UserProfileSection } from "./sidebar/UserProfileSection";
import { NavigationMenu } from "./sidebar/NavigationMenu";
import { SidebarFooter } from "./sidebar/SidebarFooter";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="glass border-r border-gray-200/30 dark:border-gray-800/30">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gray-900 dark:bg-gray-100">
            <Brain className="h-6 w-6 text-white dark:text-black" />
          </div>
          <div className="flex items-center space-x-1 group-data-[collapsible=icon]:hidden">
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Dflow
            </span>
            <Sparkles className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-xl font-bold text-gray-700 dark:text-gray-300">AI</span>
          </div>
        </div>
      </SidebarHeader>

      <UserProfileSection />
      
      <SidebarContent>
        <NavigationMenu />
      </SidebarContent>

      <SidebarFooter />
      
      <SidebarRail />
    </Sidebar>
  );
}
