import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MessagesView } from "@/components/MessagesView";
import MainHeader from "@/components/MainHeader";

export default function Messages() {
  return (
    <div>
      <MainHeader />
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <div className="flex-1 p-6">
              <MessagesView />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
