
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, ExternalLink, Trash2 } from "lucide-react";
import { Project } from "@/types/project";

interface ProjectItemProps {
  project: Project;
  isOwnProfile: boolean;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

export function ProjectItem({ project, isOwnProfile, onEdit, onDelete }: ProjectItemProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'paused': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="p-2 border rounded text-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{project.title}</span>
            <Badge variant={getStatusBadgeVariant(project.status)}>
              {project.status}
            </Badge>
            {project.project_url && (
              <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          {project.description && (
            <p className="text-muted-foreground mt-1">{project.description}</p>
          )}
          {project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {project.technologies.map((tech, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
          {project.client_name && (
            <p className="text-muted-foreground text-xs mt-1">Client: {project.client_name}</p>
          )}
        </div>
        {isOwnProfile && (
          <div className="flex space-x-1 ml-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(project)}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(project.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
