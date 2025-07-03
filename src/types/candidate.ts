
export interface Consultant {
  id: string;
  first_name: string;
  surname: string;
  email: string;
  phone: string;
  title: string;
  location: string;
  experience_years: number;
  skills: string[];
  availability: string;
  hourly_rate: number;
  created_at: string;
  status: string;
  last_activity_date?: string;
  responsible_user_id?: string;
  profiles?: {
    first_name: string;
    last_name: string;
    full_name: string;
  } | null;
}

export interface SortConfig {
  field: string;
  direction: "asc" | "desc";
}

export interface CandidatesListViewProps {
  onAddCandidate: () => void;
}
