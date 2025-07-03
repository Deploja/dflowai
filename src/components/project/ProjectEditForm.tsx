
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, X } from "lucide-react";
import { Project, EditingProject } from "@/types/project";

interface ProjectEditFormProps {
  project: Project;
  onSave: (editingProject: EditingProject) => Promise<boolean>;
  onCancel: () => void;
}

export function ProjectEditForm({ project, onSave, onCancel }: ProjectEditFormProps) {
  const [editingProject, setEditingProject] = useState<EditingProject>({});

  useEffect(() => {
    setEditingProject({
      ...project,
      technologies: project.technologies.join(', ')
    });
  }, [project]);

  const handleSave = async () => {
    const success = await onSave(editingProject);
    if (success) {
      onCancel();
    }
  };

  return (
    <div className="space-y-2">
      <Input
        value={editingProject.title || ''}
        onChange={(e) => setEditingProject(prev => ({ ...prev, title: e.target.value }))}
        placeholder="Project title"
      />
      <Textarea
        value={editingProject.description || ''}
        onChange={(e) => setEditingProject(prev => ({ ...prev, description: e.target.value }))}
        placeholder="Project description"
        rows={2}
      />
      <Input
        value={editingProject.technologies || ''}
        onChange={(e) => setEditingProject(prev => ({ ...prev, technologies: e.target.value }))}
        placeholder="Technologies (comma separated)"
      />
      <div className="flex space-x-2">
        <Button onClick={handleSave} size="sm">
          <Check className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
