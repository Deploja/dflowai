
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit2, Check, X, Plus, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string | null;
  technologies: string[];
  client_name: string | null;
  project_url: string | null;
}

interface ProjectsCardProps {
  userId: string;
  isOwnProfile: boolean;
}

export function ProjectsCard({ userId, isOwnProfile }: ProjectsCardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    status: "active",
    start_date: "",
    end_date: "",
    technologies: "",
    client_name: "",
    project_url: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, [userId]);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const addProject = async () => {
    if (!newProject.title.trim() || !newProject.start_date) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: userId,
          title: newProject.title,
          description: newProject.description,
          status: newProject.status,
          start_date: newProject.start_date,
          end_date: newProject.end_date || null,
          technologies: newProject.technologies.split(',').map(t => t.trim()).filter(t => t),
          client_name: newProject.client_name || null,
          project_url: newProject.project_url || null
        })
        .select()
        .single();

      if (error) throw error;

      setProjects(prev => [data, ...prev]);
      setNewProject({
        title: "",
        description: "",
        status: "active",
        start_date: "",
        end_date: "",
        technologies: "",
        client_name: "",
        project_url: ""
      });
      setIsAdding(false);
      toast({
        title: "Project added",
        description: "Your project has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: "Error",
        description: "Failed to add project.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'paused': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
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
          <div className="p-3 border rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={newProject.title}
                onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Project title"
              />
              <Select
                value={newProject.status}
                onValueChange={(value) => setNewProject(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              value={newProject.description}
              onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Project description"
              rows={2}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={newProject.start_date}
                onChange={(e) => setNewProject(prev => ({ ...prev, start_date: e.target.value }))}
                placeholder="Start date"
              />
              <Input
                type="date"
                value={newProject.end_date}
                onChange={(e) => setNewProject(prev => ({ ...prev, end_date: e.target.value }))}
                placeholder="End date (optional)"
              />
            </div>
            <Input
              value={newProject.technologies}
              onChange={(e) => setNewProject(prev => ({ ...prev, technologies: e.target.value }))}
              placeholder="Technologies (comma separated)"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={newProject.client_name}
                onChange={(e) => setNewProject(prev => ({ ...prev, client_name: e.target.value }))}
                placeholder="Client name (optional)"
              />
              <Input
                value={newProject.project_url}
                onChange={(e) => setNewProject(prev => ({ ...prev, project_url: e.target.value }))}
                placeholder="Project URL (optional)"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={addProject} size="sm">
                <Check className="h-4 w-4 mr-1" />
                Add
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsAdding(false)}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {activeProjects.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Active Projects</h4>
            <div className="space-y-2">
              {activeProjects.map((project) => (
                <div key={project.id} className="p-2 border rounded text-sm">
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
                    </div>
                  </div>
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
                <div key={project.id} className="p-2 border rounded text-sm">
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
                  {project.client_name && (
                    <p className="text-muted-foreground text-xs">Client: {project.client_name}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {projects.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {isOwnProfile ? "No projects added yet" : "No projects listed"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
