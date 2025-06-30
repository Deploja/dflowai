import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarFooter as SidebarFooterPrimitive,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import {
  getUserDisplayName,
  getUserInitials,
  loadUserAvatar,
  findConsultantProfile,
} from "./userUtils";

export function SidebarFooter() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Mock user data when no authentication
  const mockUser = {
    id: "00000000-0000-0000-0000-000000000001",
    email: "demo@example.com",
  };

  const effectiveUser = user || mockUser;

  useEffect(() => {
    if (effectiveUser.id) {
      loadUserAvatar(effectiveUser.id).then(setAvatarUrl);
    }
  }, [effectiveUser.id]);

  const handleProfileClick = async () => {
    // In demo mode without auth, navigate directly to profile
    if (!user) {
      navigate(`/profile`);
      return;
    }

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

  return (
    <SidebarFooterPrimitive className="p-4 space-y-2">
      <div className="flex items-center justify-between">
        <ThemeToggle />
      </div>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="w-full justify-start data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      avatarUrl ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${getUserDisplayName(
                        effectiveUser
                      )}`
                    }
                    alt="Profile picture"
                  />
                  <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    {getUserInitials(effectiveUser)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">
                    {getUserDisplayName(effectiveUser)}
                  </span>
                  <span className="truncate text-xs text-gray-600 dark:text-gray-400">
                    {effectiveUser?.email}
                  </span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side="bottom"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        avatarUrl ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${getUserDisplayName(
                          effectiveUser
                        )}`
                      }
                      alt="Profile picture"
                    />
                    <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                      {getUserInitials(effectiveUser)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {getUserDisplayName(effectiveUser)}
                    </span>
                    <span className="truncate text-xs text-gray-600 dark:text-gray-400">
                      {effectiveUser?.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooterPrimitive>
  );
}
