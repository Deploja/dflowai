import { Link } from "react-router-dom";
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
    <Sidebar
      collapsible="icon"
      className="h-[calc(100vh-64px)] mt-16 border-none"
    >
      <UserProfileSection />

      <SidebarContent>
        <NavigationMenu />
      </SidebarContent>

      <SidebarFooter />

      <SidebarRail />
    </Sidebar>
  );
}
