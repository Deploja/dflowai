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

export default function Profile() {
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
    return "Unknown User";
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
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <h1 className="text-xl font-semibold">Loading Profile...</h1>
            </header>
            <div className="flex-1 p-6">
              <div className="animate-pulse space-y-6">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-xl font-semibold">Profile</h1>
            {isOwnProfile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/settings")}
                className="ml-auto"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Profile
              </Button>
            )}
          </header>
          <div className="flex-1 p-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              {/* Main Profile Card */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <ProfileHeader
                      displayName={getDisplayName()}
                      email={consultant?.email || userProfile?.email || ""}
                      avatarUrl={getAvatarUrl()}
                      initials={getInitials()}
                      activityStatus={activityStatus}
                      isEditingStatus={isEditingStatus}
                      tempStatus={tempStatus}
                      isOwnProfile={isOwnProfile}
                      onEditStatus={() => setIsEditingStatus(true)}
                      onUpdateStatus={updateStatus}
                      onCancelEdit={() => {
                        setIsEditingStatus(false);
                        setTempStatus(activityStatus.status);
                      }}
                      onStatusChange={setTempStatus}
                      getStatusColor={getStatusColor}
                    />
                    <div className="mt-6 pt-6 border-t">
                      <ContactInformation
                        consultant={consultant}
                        userProfile={userProfile}
                      />
                    </div>

                    <ProfessionalDetails
                      consultant={consultant}
                      skills={skills}
                      isEditingSkills={isEditingSkills}
                      isOwnProfile={isOwnProfile}
                      newSkill={newSkill}
                      onEditSkills={() => setIsEditingSkills(!isEditingSkills)}
                      onAddSkill={addSkill}
                      onRemoveSkill={removeSkill}
                      onNewSkillChange={handleNewSkillChange}
                      getProficiencyColor={getProficiencyColor}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Content Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <PresentationCard
                    userId={consultant?.id || userProfile?.id || ""}
                    isOwnProfile={isOwnProfile}
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <ProjectsCard
                    userId={consultant?.id || userProfile?.id || ""}
                    isOwnProfile={isOwnProfile}
                  />
                  <CVManagementCard
                    userId={consultant?.id || userProfile?.id || ""}
                    isOwnProfile={isOwnProfile}
                  />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
