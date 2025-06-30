
import { RevenueOverview } from "@/components/RevenueOverview";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Revenue() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="ml-auto flex items-center gap-2">
              <h1 className="text-xl font-semibold">Revenue</h1>
            </div>
          </header>
          <div className="flex-1 p-6">
            <RevenueOverview />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
