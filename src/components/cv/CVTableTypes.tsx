
export interface CV {
  id: string;
  title: string;
  language: string;
  user_id: string;
  is_shared: boolean;
  share_token: string;
  created_at: string;
  updated_at: string;
  last_activity_at: string | null;
  last_activity_by: string | null;
  created_by: string | null;
  user?: {
    name: string;
    avatar?: string;
  };
  isOwn: boolean;
}

export interface CVTableProps {
  cvs: CV[];
  isAdminOrOwner: boolean;
}

export type SortField = 'title' | 'user' | 'last_activity' | 'created_at';
export type SortDirection = 'asc' | 'desc';
