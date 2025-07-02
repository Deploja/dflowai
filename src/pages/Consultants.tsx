
import { useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ConsultantsList } from "@/components/ConsultantsList";
import { AddConsultantForm } from "@/components/AddConsultantForm";
import { CandidatePipelineFilter } from "@/components/CandidatePipelineFilter";
import { useQueryClient } from "@tanstack/react-query";

export default function Consultants() {
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
              <h1 className="text-xl font-semibold">Consultants</h1>
            </header>
            
            <CandidatePipelineFilter 
              onAddCandidate={() => setShowAddCandidate(true)}
              candidateCount={0}
            />
            
            <div className="flex-1">
              <ConsultantsList onAddConsultant={() => setShowAddCandidate(true)} />
            </div>
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
