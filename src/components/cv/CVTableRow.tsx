
import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Globe, Eye, Trash2 } from "lucide-react";
import { CVShareDialog } from "../CVShareDialog";
import { CVPreview } from "../CVPreview";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CV } from "./CVTableTypes";

interface CVTableRowProps {
  cv: CV;
  index: number;
}

export function CVTableRowComponent({ cv, index }: CVTableRowProps) {
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const getLanguageFlag = (language: string) => {
    switch (language) {
      case "english":
        return "🇬🇧";
      case "swedish":
        return "🇸🇪";
      default:
        return "🌐";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this CV?')) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from('cvs')
        .delete()
        .eq('id', cv.id);

      if (error) throw error;

      toast({
        title: "CV deleted",
        description: "The CV has been deleted successfully.",
      });

      // Reload the page to refresh the data
      window.location.reload();
    } catch (error) {
      console.error('Error deleting CV:', error);
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete CV.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <TableRow className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
      <TableCell className="py-4 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="text-xl">
            {getLanguageFlag(cv.language)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{cv.title}</div>
            <div className="flex items-center space-x-2 mt-1">
              {cv.is_shared && (
                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                  <Globe className="h-3 w-3 mr-1" />
                  Shared
                </Badge>
              )}
            </div>
          </div>
        </div>
      </TableCell>
      
      <TableCell className="py-4 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${cv.user?.name}`} 
              alt={cv.user?.name || "User"}
            />
            <AvatarFallback className="text-sm bg-gray-100 text-gray-900">
              {cv.user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-gray-900">{cv.user?.name}</div>
            {!cv.isOwn && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 mt-1">
                Employee
              </Badge>
            )}
          </div>
        </div>
      </TableCell>
      
      <TableCell className="py-4 px-6 border-b border-gray-200">
        <div className="text-sm text-gray-900">
          {formatDate(cv.last_activity_at || cv.updated_at)}
        </div>
        <div className="text-xs text-gray-500 mt-1 flex items-center">
          <Avatar className="h-4 w-4 mr-1">
            <AvatarImage 
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${cv.user?.name}`} 
              alt={cv.user?.name || "User"}
            />
            <AvatarFallback className="text-xs bg-gray-100 text-gray-900">
              {cv.user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          By {cv.user?.name}
        </div>
      </TableCell>
      
      <TableCell className="py-4 px-6 border-b border-gray-200">
        <div className="text-sm text-gray-900">
          {formatDate(cv.created_at)}
        </div>
        <div className="text-xs text-gray-500 mt-1 flex items-center">
          <Avatar className="h-4 w-4 mr-1">
            <AvatarImage 
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${cv.user?.name}`} 
              alt={cv.user?.name || "User"}
            />
            <AvatarFallback className="text-xs bg-gray-100 text-gray-900">
              {cv.user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          By {cv.user?.name}
        </div>
      </TableCell>
      
      <TableCell className="py-4 px-6 border-b border-gray-200">
        <div className="flex space-x-2">
          <CVShareDialog cv={cv}>
            <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
              <Globe className="h-4 w-4" />
            </Button>
          </CVShareDialog>
          <CVPreview cvId={cv.id}>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              <Eye className="h-4 w-4" />
            </Button>
          </CVPreview>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
