
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CVManager } from "@/components/CVManager";

export default function CVEmployees() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">CV - Employees</h1>
          </header>
          <div className="flex-1 p-6">
            <CVManager />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
