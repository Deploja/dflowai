
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { ProjectForm } from "@/components/project/ProjectForm";
import { ProjectEditForm } from "@/components/project/ProjectEditForm";
import { ProjectItem } from "@/components/project/ProjectItem";
import { Project } from "@/types/project";

interface ProjectsCardProps {
  userId: string;
  isOwnProfile: boolean;
}

export function ProjectsCard({ userId, isOwnProfile }: ProjectsCardProps) {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const { projects, addProject, updateProject, deleteProject } = useProjects({
    userId,
    isOwnProfile,
  });

  const handleAddProject = async (newProject: any) => {
    const success = await addProject(newProject);
    if (success) {
      setIsAdding(false);
    }
    return success;
  };

  const handleUpdateProject = async (updatedProject: any) => {
    const success = await updateProject(updatedProject);
    if (success) {
      setIsEditing(null);
      setEditingProject(null);
    }
    return success;
  };

  const handleEditProject = (project: Project) => {
    setIsEditing(project.id);
    setEditingProject(project);
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditingProject(null);
  };

  const activeProjects = projects.filter(p => p.status === 'active');
  const recentProjects = projects.filter(p => p.status !== 'active').slice(0, 3);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Projects</CardTitle>
          {isOwnProfile && (
            <Button variant="ghost" size="sm" onClick={() => setIsAdding(!isAdding)}>
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <ProjectForm
            onSubmit={handleAddProject}
            onCancel={() => setIsAdding(false)}
          />
        )}

        {activeProjects.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Active Projects</h4>
            <div className="space-y-2">
              {activeProjects.map((project) => (
                <div key={project.id}>
                  {isEditing === project.id && editingProject ? (
                    <ProjectEditForm
                      project={editingProject}
                      onSave={handleUpdateProject}
                      onCancel={handleCancelEdit}
                    />
                  ) : (
                    <ProjectItem
                      project={project}
                      isOwnProfile={isOwnProfile}
                      onEdit={handleEditProject}
                      onDelete={deleteProject}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {recentProjects.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Recent Projects</h4>
            <div className="space-y-2">
              {recentProjects.map((project) => (
                <ProjectItem
                  key={project.id}
                  project={project}
                  isOwnProfile={isOwnProfile}
                  onEdit={handleEditProject}
                  onDelete={deleteProject}
                />
              ))}
            </div>
          </div>
        )}

        {projects.length === 0 && !isAdding && (
          <p className="text-sm text-muted-foreground">
            {isOwnProfile ? "No projects added yet" : "No projects listed"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
