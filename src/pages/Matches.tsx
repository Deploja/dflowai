import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MatchesView } from "@/components/MatchesView";
import MainHeader from "@/components/MainHeader";

export default function Matches() {
  return (
    <div>
      <MainHeader />
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <div className="flex-1 p-6">
              <MatchesView />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
