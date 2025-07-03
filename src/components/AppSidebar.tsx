import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { UserProfileSection } from "./sidebar/UserProfileSection";
import { NavigationMenu } from "./sidebar/NavigationMenu";
import { SidebarFooter } from "./sidebar/SidebarFooter";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="h-[calc(100vh)] mt-0 border-none">
      <UserProfileSection />

      <SidebarContent>
        <NavigationMenu />
      </SidebarContent>

      <SidebarFooter />

      <SidebarRail />
    </Sidebar>
  );
}
