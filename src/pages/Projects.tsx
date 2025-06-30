
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ProjectsView } from "@/components/ProjectsView";

export default function Projects() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">Projects</h1>
          </header>
          <div className="flex-1 p-6">
            <ProjectsView />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
