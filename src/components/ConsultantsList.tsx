import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { EditConsultantForm } from "./EditConsultantForm";
import { CandidateKanbanBoard } from "./CandidateKanbanBoard";
import { EmptyConsultantsState } from "./EmptyConsultantsState";

interface Consultant {
  id: string;
  first_name: string;
  surname: string;
  email: string;
  phone: string;
  title: string;
  location: string;
  experience_years: number;
  skills: string[];
  availability: string;
  hourly_rate: number;
  created_at: string;
  status: string;
}

interface ConsultantsListProps {
  onAddConsultant: () => void;
}

export function ConsultantsList({ onAddConsultant }: ConsultantsListProps) {
  const [editingConsultant, setEditingConsultant] = useState<Consultant | null>(
    null
  );
  const [showEditForm, setShowEditForm] = useState(false);

  const {
    data: consultants,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["consultants"],
    queryFn: async () => {
      console.log("Fetching candidates...");
      const { data, error } = await supabase
        .from("consultants")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching candidates:", error);
        throw error;
      }

      console.log("Fetched candidates:", data);
      return data as Consultant[];
    },
  });

  const handleEditSuccess = () => {
    setShowEditForm(false);
    setEditingConsultant(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading candidates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardContent className="pt-6">
          <p className="text-red-600 dark:text-red-400">
            An error occurred while fetching candidates: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!consultants || consultants.length === 0) {
    return <EmptyConsultantsState onAddConsultant={onAddConsultant} />;
  }

  return (
    <div className="h-full">
      <CandidateKanbanBoard candidates={consultants} />

      {editingConsultant && (
        <EditConsultantForm
          consultant={editingConsultant}
          open={showEditForm}
          onOpenChange={setShowEditForm}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
