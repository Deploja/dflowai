
export interface Project {
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

export interface EditingProject {
  id?: string;
  title?: string;
  description?: string;
  status?: string;
  start_date?: string;
  end_date?: string | null;
  technologies?: string; // This is a string in edit mode (comma-separated)
  client_name?: string | null;
  project_url?: string | null;
}

export interface NewProject {
  title: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  technologies: string;
  client_name: string;
  project_url: string;
}
