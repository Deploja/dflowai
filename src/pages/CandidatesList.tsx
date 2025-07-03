import { useState } from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CandidatesListView } from "@/components/CandidatesListView";
import { AddConsultantForm } from "@/components/AddConsultantForm";
import { useQueryClient } from "@tanstack/react-query";

export default function CandidatesList() {
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const queryClient = useQueryClient();

  const handleCandidateAdded = () => {
    queryClient.invalidateQueries({ queryKey: ["consultants"] });
    setShowAddCandidate(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="flex flex-col h-full">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <h1 className="text-xl font-semibold">Candidates</h1>
            </header>

            <CandidatesListView
              onAddCandidate={() => setShowAddCandidate(true)}
            />
          </div>
        </SidebarInset>
      </div>

      <AddConsultantForm
        open={showAddCandidate}
        onOpenChange={setShowAddCandidate}
        onSuccess={handleCandidateAdded}
      />
    </SidebarProvider>
  );
}
