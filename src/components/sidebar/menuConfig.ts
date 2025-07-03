
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Calendar,
  Target,
  Search,
  DollarSign,
  FileText,
  UsersIcon,
  List,
  GitBranch,
  UserCheck,
  UserPlus
} from "lucide-react";

export const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Matches",
    url: "/matches",
    icon: Target,
  },
  {
    title: "Job Search",
    url: "/job-search",
    icon: Search,
  },
  {
    title: "Revenue",
    url: "/revenue",
    icon: DollarSign,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquare,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: Calendar,
  },
];

export const cvSubItems = [
  {
    title: "Employees",
    url: "/cv/employees",
    icon: Users,
  },
  {
    title: "Candidates", 
    url: "/cv/candidates",
    icon: UserCheck,
  },
  {
    title: "Sub-consultants",
    url: "/cv/sub-consultants", 
    icon: UserPlus,
  },
];

export const organisationSubItems = [
  {
    title: "Employees",
    url: "/organisation?tab=employees",
    icon: Users,
  },
  {
    title: "Teams",
    url: "/organisation?tab=teams",
    icon: UsersIcon,
  },
];

export const candidatesSubItems = [
  {
    title: "Pipeline",
    url: "/consultants",
    icon: GitBranch,
  },
  {
    title: "List",
    url: "/candidates-list",
    icon: List,
  },
];
