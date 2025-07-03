import { useState } from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ConsultantsList } from "@/components/ConsultantsList";
import { AddConsultantForm } from "@/components/AddConsultantForm";
import { CandidatePipelineFilter } from "@/components/CandidatePipelineFilter";
import { useQueryClient } from "@tanstack/react-query";
import MainHeader from "@/components/MainHeader";

export default function Consultants() {
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const queryClient = useQueryClient();

  const handleCandidateAdded = () => {
    queryClient.invalidateQueries({ queryKey: ["consultants"] });
    setShowAddCandidate(false);
  };

  return (
    <div>
      <MainHeader />
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <div className="flex flex-col h-full">
              <CandidatePipelineFilter
                onAddCandidate={() => setShowAddCandidate(true)}
                candidateCount={0}
              />

              <div className="flex-1">
                <ConsultantsList
                  onAddConsultant={() => setShowAddCandidate(true)}
                />
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
    </div>
  );
}
