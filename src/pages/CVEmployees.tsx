import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CVManager } from "@/components/CVManager";
import MainHeader from "@/components/MainHeader";

export default function CVEmployees() {
  return (
    <div>
      <MainHeader />
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <div className="flex-1 p-6">
              <CVManager />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
