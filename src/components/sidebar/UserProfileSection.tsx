
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { 
  getUserDisplayName, 
  getUserInitials, 
  getUserRole, 
  loadUserAvatar, 
  uploadUserAvatar,
  findConsultantProfile 
} from "./userUtils";

export function UserProfileSection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      loadUserAvatar(user.id).then(setAvatarUrl);
    }
  }, [user]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const newAvatarUrl = await uploadUserAvatar(user.id, file);
      setAvatarUrl(newAvatarUrl);

      toast({
        title: "Image uploaded",
        description: "Your profile picture has been updated.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Could not upload image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleProfileClick = async () => {
    if (!user) return;
    
    try {
      const consultant = await findConsultantProfile(user.email!);

      if (consultant) {
        navigate(`/profile/${consultant.id}`);
      } else {
        toast({
          title: "Profile not found",
          description: "You don't have a consultant profile yet.",
        });
      }
    } catch (error) {
      console.error("Error checking consultant profile:", error);
      toast({
        title: "Error",
        description: "Could not access your profile.",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="p-4 border-b border-gray-200/30 dark:border-gray-800/30 group-data-[collapsible=icon]:hidden">
      <div 
        className="flex flex-col items-center space-y-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-3 rounded-lg transition-colors"
        onClick={handleProfileClick}
      >
        <div className="relative">
          <Avatar className="h-16 w-16">
            <AvatarImage 
              src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${getUserDisplayName(user)}`} 
              alt="Profile picture"
            />
            <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-lg">
              {getUserInitials(user)}
            </AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            variant="secondary"
            className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full p-0"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            disabled={uploading}
          >
            <Camera className="h-3 w-3" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
        <div className="text-center">
          <div className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {getUserDisplayName(user)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {getUserRole()}
          </div>
        </div>
      </div>
    </div>
  );
}
