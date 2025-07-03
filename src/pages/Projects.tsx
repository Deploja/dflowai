import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ProjectsView } from "@/components/ProjectsView";
import MainHeader from "@/components/MainHeader";

export default function Projects() {
  return (
    <div>
      <MainHeader />
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <div className="flex-1 p-6">
              <ProjectsView />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
