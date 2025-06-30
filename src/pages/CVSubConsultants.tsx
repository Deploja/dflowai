
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CVManager } from "@/components/CVManager";

export default function CVSubConsultants() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">CV - Sub-consultants</h1>
          </header>
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
  );
}
