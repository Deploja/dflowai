
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { CVCard } from "./CVCard";

interface CV {
  id: string;
  title: string;
  language: string;
  user_id: string;
  is_shared: boolean;
  share_token: string;
  created_at: string;
  updated_at: string;
  last_activity_at: string | null;
  last_activity_by: string | null;
  created_by: string | null;
  user?: {
    name: string;
    avatar?: string;
  };
  isOwn: boolean;
}

interface CVGridProps {
  cvs: CV[];
  isAdminOrOwner: boolean;
  showCreateButton?: boolean;
}

export function CVGrid({ cvs, isAdminOrOwner, showCreateButton = false }: CVGridProps) {
  if (cvs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-600 mb-4">
          <FileText className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg">No CVs found</p>
          <p className="text-sm">
            {showCreateButton ? "Create your first CV to get started" : "No CVs match your search criteria"}
          </p>
        </div>
        {showCreateButton && (
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create CV
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cvs.map((cv) => (
        <CVCard key={cv.id} cv={cv} isAdminOrOwner={isAdminOrOwner} />
      ))}
    </div>
  );
}
