import { RevenueOverview } from "@/components/RevenueOverview";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import MainHeader from "@/components/MainHeader";

export default function Revenue() {
  return (
    <div>
      <MainHeader />
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <div className="flex-1 p-6">
              <RevenueOverview />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
