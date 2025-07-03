
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X } from "lucide-react";
import { NewProject } from "@/types/project";

interface ProjectFormProps {
  onSubmit: (project: NewProject) => Promise<boolean>;
  onCancel: () => void;
}

export function ProjectForm({ onSubmit, onCancel }: ProjectFormProps) {
  const [newProject, setNewProject] = useState<NewProject>({
    title: "",
    description: "",
    status: "active",
    start_date: "",
    end_date: "",
    technologies: "",
    client_name: "",
    project_url: ""
  });

  const handleSubmit = async () => {
    const success = await onSubmit(newProject);
    if (success) {
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
    }
  };

  return (
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
        <Button onClick={handleSubmit} size="sm">
          <Check className="h-4 w-4 mr-1" />
          Add
        </Button>
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
