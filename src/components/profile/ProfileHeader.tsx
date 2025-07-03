import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Circle,
  Edit2,
  Check,
  X,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
} from "lucide-react";

interface ProfileHeaderProps {
  displayName: string;
  email: string;
  avatarUrl: string;
  initials: string;
  activityStatus: { status: string; last_seen: string };
  isEditingStatus: boolean;
  tempStatus: string;
  isOwnProfile: boolean;
  onEditStatus: () => void;
  onUpdateStatus: () => void;
  onCancelEdit: () => void;
  onStatusChange: (status: string) => void;
  getStatusColor: (status: string) => string;
}

export function ProfileHeader({
  displayName,
  email,
  avatarUrl,
  initials,
  activityStatus,
  isEditingStatus,
  tempStatus,
  isOwnProfile,
  onEditStatus,
  onUpdateStatus,
  onCancelEdit,
  onStatusChange,
  getStatusColor,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center min-w-[200px]">
      <Avatar className="h-24 w-24 mb-4 shadow-md">
        <AvatarImage src={avatarUrl} alt={displayName} />
        <AvatarFallback className="text-lg">{initials}</AvatarFallback>
      </Avatar>

      <h2 className="text-2xl font-bold text-center mb-2">{displayName}</h2>
      <p className="text-muted-foreground text-center mb-4">{email}</p>

      {/* Social Links */}
      <div className="flex gap-2 mb-4">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Github className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Linkedin className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Mail className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>

      {/* Activity Status */}
      <div className="flex items-center gap-2 mb-4">
        <Circle
          className={`h-3 w-3 fill-current rounded-full shadow-md ${getStatusColor(
            activityStatus.status
          )}`}
        />
        {isEditingStatus && isOwnProfile ? (
          <div className="flex items-center gap-2">
            <Select value={tempStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="w-24 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="away">Away</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={onUpdateStatus}
              className="h-8 w-8 p-0"
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancelEdit}
              className="h-8 w-8 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs shadow-md">
              {activityStatus.status.charAt(0).toUpperCase() +
                activityStatus.status.slice(1)}
            </Badge>
            {isOwnProfile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onEditStatus}
                className="h-6 w-6 p-0"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>

      {activityStatus.last_seen && (
        <p className="text-xs text-muted-foreground text-center">
          Last seen: {new Date(activityStatus.last_seen).toLocaleString()}
        </p>
      )}
    </div>
  );
}
