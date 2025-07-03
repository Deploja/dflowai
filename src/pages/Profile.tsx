import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { PresentationCard } from "@/components/profile/PresentationCard";
import { ProjectsCard } from "@/components/profile/ProjectsCard";
import { CVManagementCard } from "@/components/profile/CVManagementCard";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfessionalDetails } from "@/components/profile/ProfessionalDetails";
import { ContactInformation } from "@/components/profile/ContactInformation";
import { useProfileData } from "@/hooks/useProfileData";
import { useAuth } from "@/components/AuthProvider";
import MainHeader from "@/components/MainHeader";

export default function Profile() {
  const { user } = useAuth();
  const {
    consultant,
    userProfile,
    activityStatus,
    skills,
    loading,
    isOwnProfile,
    isEditingStatus,
    isEditingSkills,
    tempStatus,
    newSkill,
    setIsEditingStatus,
    setIsEditingSkills,
    setTempStatus,
    setNewSkill,
    updateStatus,
    addSkill,
    removeSkill,
    navigate,
  } = useProfileData();

  // For now, use a mock user ID when no authentication
  const mockUserId = "00000000-0000-0000-0000-000000000001";
  const effectiveUserId = user?.id || mockUserId;

  const getDisplayName = () => {
    if (consultant) {
      return `${consultant.first_name} ${consultant.surname}`;
    }
    if (userProfile) {
      return (
        userProfile.full_name ||
        `${userProfile.first_name || ""} ${
          userProfile.last_name || ""
        }`.trim() ||
        userProfile.email?.split("@")[0] ||
        "User"
      );
    }
    return "Tony Forsman";
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getAvatarUrl = () => {
    if (userProfile?.avatar_url) return userProfile.avatar_url;
    return `https://api.dicebear.com/7.x/initials/svg?seed=${getDisplayName()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-500";
      case "busy":
        return "text-red-500";
      case "away":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case "expert":
        return "bg-green-100 text-green-800 border-green-200";
      case "advanced":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "beginner":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleNewSkillChange = (field: string, value: string | number) => {
    setNewSkill((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <div className="flex-1 p-6">
              <div className="animate-pulse space-y-6">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <div>
      <MainHeader />
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 px-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>

              {isOwnProfile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/settings")}
                  className="ml-auto"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Profile
                </Button>
              )}
            </header>
            <div className="flex-1 p-6 ">
              <div className="max-w-6xl mx-auto">
                {/* Main Profile Card */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <ProfileHeader
                        displayName={getDisplayName()}
                        email={
                          consultant?.email ||
                          userProfile?.email ||
                          "Junior Fullstack Developer" //Have to add skript to auto fill from parsing.
                        }
                        avatarUrl={getAvatarUrl()}
                        initials={getInitials()}
                        activityStatus={activityStatus}
                        isEditingStatus={isEditingStatus}
                        tempStatus={tempStatus}
                        isOwnProfile={true} // Always allow editing in demo mode
                        onEditStatus={() => setIsEditingStatus(true)}
                        onUpdateStatus={updateStatus}
                        onCancelEdit={() => {
                          setIsEditingStatus(false);
                          setTempStatus(activityStatus.status);
                        }}
                        onStatusChange={setTempStatus}
                        getStatusColor={getStatusColor}
                      />

                      <ProfessionalDetails
                        consultant={consultant}
                        skills={skills}
                        isEditingSkills={isEditingSkills}
                        isOwnProfile={true} // Always allow editing in demo mode
                        newSkill={newSkill}
                        onEditSkills={() =>
                          setIsEditingSkills(!isEditingSkills)
                        }
                        onAddSkill={addSkill}
                        onRemoveSkill={removeSkill}
                        onNewSkillChange={handleNewSkillChange}
                        getProficiencyColor={getProficiencyColor}
                      />
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <ContactInformation
                        consultant={consultant}
                        userProfile={userProfile}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Content Cards */}
                <div className="grid grid-rows-[auto,1fr] gap-6">
                  <div className="space-y-6">
                    <PresentationCard
                      userId={effectiveUserId}
                      isOwnProfile={true}
                    />
                  </div>

                  <div className="space-y-6">
                    <ProjectsCard
                      userId={effectiveUserId}
                      isOwnProfile={true}
                    />
                    <CVManagementCard
                      userId={effectiveUserId}
                      isOwnProfile={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
