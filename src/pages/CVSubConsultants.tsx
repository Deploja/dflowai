import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CVManager } from "@/components/CVManager";
import MainHeader from "@/components/MainHeader";

export default function CVSubConsultants() {
  return (
    <div>
      <MainHeader />
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <div className="flex-1 p-6">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Sub-consultants CV Management</CardTitle>
                  <CardDescription>
                    Manage CVs for sub-consultants and external contractors
                  </CardDescription>
                </CardHeader>
              </Card>
              <CVManager />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
