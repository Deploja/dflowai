
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Project, EditingProject, NewProject } from "@/types/project";

interface UseProjectsProps {
  userId: string;
  isOwnProfile: boolean;
}

export function useProjects({ userId, isOwnProfile }: UseProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const { toast } = useToast();

  const effectiveUserId = userId;
  const DEMO_PROJECTS_KEY = `demo_projects_${effectiveUserId}`;

  useEffect(() => {
    if (effectiveUserId && isOwnProfile) {
      loadProjects();
    }
  }, [effectiveUserId, isOwnProfile]);

  const saveProjectsToDemo = (updatedProjects: Project[]) => {
    try {
      localStorage.setItem(DEMO_PROJECTS_KEY, JSON.stringify(updatedProjects));
      console.log('Saved projects to localStorage:', updatedProjects);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const loadProjects = async () => {
    try {
      console.log('Loading projects for user:', effectiveUserId);
      
      // Try to load from Supabase first
      let supabaseData: Project[] = [];
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', effectiveUserId)
          .order('start_date', { ascending: false });

        if (!error && data) {
          supabaseData = data;
          console.log('Loaded projects from Supabase:', supabaseData);
        }
      } catch (error) {
        console.log('Supabase query failed, using demo mode');
      }

      // Load from localStorage for demo mode
      let demoData: Project[] = [];
      try {
        const stored = localStorage.getItem(DEMO_PROJECTS_KEY);
        if (stored) {
          demoData = JSON.parse(stored);
          console.log('Loaded projects from localStorage:', demoData);
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }

      // Combine and deduplicate data
      const allProjects = [...supabaseData, ...demoData];
      const uniqueProjects = allProjects.filter((project, index, self) => 
        self.findIndex(p => p.id === project.id) === index
      );

      setProjects(uniqueProjects);
      console.log('Final projects list:', uniqueProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      if (!error.message?.includes('Auth session missing')) {
        toast({
          title: "Error loading projects",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  const addProject = async (newProject: NewProject) => {
    if (!newProject.title.trim() || !newProject.start_date) {
      toast({
        title: "Required fields missing",
        description: "Please enter a title and start date.",
        variant: "destructive",
      });
      return false;
    }

    const projectData = {
      id: Date.now().toString(),
      user_id: effectiveUserId,
      title: newProject.title,
      description: newProject.description,
      status: newProject.status,
      start_date: newProject.start_date,
      end_date: newProject.end_date || null,
      technologies: newProject.technologies.split(',').map(t => t.trim()).filter(t => t),
      client_name: newProject.client_name || null,
      project_url: newProject.project_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      console.log('Adding project for user:', effectiveUserId);
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (error && error.code !== '23503') {
        throw error;
      }

      const finalData = data || projectData;
      console.log('Project added successfully:', finalData);
      
      const updatedProjects = [finalData, ...projects];
      setProjects(updatedProjects);
      
      if (!data) {
        saveProjectsToDemo(updatedProjects);
      }
    } catch (error) {
      console.error('Error adding project:', error);
      // In demo mode, still add locally
      const updatedProjects = [projectData, ...projects];
      setProjects(updatedProjects);
      saveProjectsToDemo(updatedProjects);
    }

    toast({
      title: "Project added",
      description: "Your project has been added successfully.",
    });
    return true;
  };

  const updateProject = async (editingProject: EditingProject) => {
    if (!editingProject.title?.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for the project.",
        variant: "destructive",
      });
      return false;
    }

    const technologiesArray = editingProject.technologies 
      ? editingProject.technologies.split(',').map(t => t.trim()).filter(t => t)
      : [];

    const updatedProject: Partial<Project> = {
      ...editingProject,
      technologies: technologiesArray
    };

    try {
      const { error } = await supabase
        .from('projects')
        .update(updatedProject)
        .eq('id', editingProject.id);

      if (error && error.code !== '23503') {
        throw error;
      }
    } catch (error) {
      console.warn('Supabase update failed:', error);
    }

    // Always update local state
    const updatedProjects = projects.map(p => 
      p.id === editingProject.id ? { ...p, ...updatedProject } : p
    );
    setProjects(updatedProjects);
    saveProjectsToDemo(updatedProjects);

    toast({
      title: "Project updated",
      description: "Your project has been updated successfully.",
    });
    return true;
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return false;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error && error.code !== '23503') {
        throw error;
      }
    } catch (error) {
      console.warn('Supabase delete failed:', error);
    }

    // Always remove from local state
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    saveProjectsToDemo(updatedProjects);

    toast({
      title: "Project deleted",
      description: "Your project has been deleted successfully.",
    });
    return true;
  };

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
  };
}
