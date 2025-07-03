
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Globe, Eye } from "lucide-react";
import { CVShareDialog } from "../CVShareDialog";
import { CVPreview } from "../CVPreview";

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

interface CVCardProps {
  cv: CV;
  isAdminOrOwner: boolean;
}

// Avatar Component with loading logic
const CVAvatar = ({ userId, userName }: { userId: string; userName?: string }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    loadUserAvatar();
  }, [userId]);

  const loadUserAvatar = async () => {
    try {
      const extensions = ['jpg', 'png', 'jpeg', 'webp'];
      
      for (const ext of extensions) {
        const { data } = await supabase.storage
          .from('avatars')
          .getPublicUrl(`${userId}.${ext}`);
        
        const response = await fetch(data.publicUrl);
        if (response.ok) {
          setAvatarUrl(data.publicUrl);
          break;
        }
      }
    } catch (error) {
      console.error("Error loading user avatar:", error);
    }
  };

  return (
    <Avatar className="h-5 w-5 mr-2">
      <AvatarImage 
        src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`} 
        alt={userName || "User"}
      />
      <AvatarFallback className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        {userName?.charAt(0) || 'U'}
      </AvatarFallback>
    </Avatar>
  );
};

export function CVCard({ cv, isAdminOrOwner }: CVCardProps) {
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

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {getLanguageFlag(cv.language)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {cv.title}
                </h3>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CVAvatar userId={cv.user_id} userName={cv.user?.name} />
                  {cv.user?.name}
                  {!cv.isOwn && isAdminOrOwner && (
                    <Badge variant="outline" className="ml-2 text-xs bg-blue-50 text-blue-700 border-blue-200">
                      Employee
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              {cv.is_shared && (
                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                  <Globe className="h-3 w-3 mr-1" />
                  Shared
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-between">
              <span>Last activity</span>
              <div className="text-right">
                <div>{cv.last_activity_at ? formatDate(cv.last_activity_at) : formatDate(cv.updated_at)}</div>
                <div className="flex items-center">
                  <CVAvatar userId={cv.user_id} userName={cv.user?.name} />
                  By {cv.user?.name}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Created</span>
              <div className="text-right">
                <div>{formatDate(cv.created_at)}</div>
                <div className="flex items-center">
                  <CVAvatar userId={cv.user_id} userName={cv.user?.name} />
                  By {cv.user?.name}
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <CVShareDialog cv={cv}>
              <Button variant="outline" size="sm" className="flex-1">
                <Globe className="h-3 w-3 mr-1" />
                Share
              </Button>
            </CVShareDialog>
            <CVPreview cvId={cv.id}>
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="h-3 w-3 mr-1" />
                Preview
              </Button>
            </CVPreview>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
