
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { CreateConsultantCVDialog } from "./CreateConsultantCVDialog";

interface CVSelectorProps {
  consultantId: string;
  selectedCVId?: string;
  onCVChange: (cvId: string | undefined) => void;
}

export function CVSelector({ consultantId, selectedCVId, onCVChange }: CVSelectorProps) {
  const [showCreateCV, setShowCreateCV] = useState(false);

  const { data: cvs, refetch } = useQuery({
    queryKey: ["consultant-cvs", consultantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cvs")
        .select("*")
        .eq("consultant_id", consultantId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleCVCreated = () => {
    refetch();
    setShowCreateCV(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Select value={selectedCVId || ""} onValueChange={(value) => onCVChange(value || undefined)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a CV" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No CV selected</SelectItem>
            {cvs?.map((cv) => (
              <SelectItem key={cv.id} value={cv.id}>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  {cv.title} ({cv.language})
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowCreateCV(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Create CV
        </Button>
      </div>

      <CreateConsultantCVDialog
        consultantId={consultantId}
        open={showCreateCV}
        onOpenChange={setShowCreateCV}
        onSuccess={handleCVCreated}
      />
    </div>
  );
}
