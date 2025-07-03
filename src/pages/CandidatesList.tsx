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
import MainHeader from "@/components/MainHeader";

export default function CandidatesList() {
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
    </div>
  );
}
