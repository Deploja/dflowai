
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, DollarSign, Plus, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Project {
  id: string;
  name: string;
  client: string;
  status: "active" | "completed" | "on-hold" | "planning";
  progress: number;
  startDate: Date;
  endDate: Date;
  budget: number;
  team: string[];
  description: string;
}

export function ProjectsView() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const projects: Project[] = [
    {
      id: "1",
      name: "Web Application Redesign",
      client: "TechCorp Inc.",
      status: "active",
      progress: 65,
      startDate: new Date(2024, 5, 1),
      endDate: new Date(2024, 7, 15),
      budget: 85000,
      team: ["John Smith", "Sarah Johnson", "Mike Chen"],
      description: "Complete redesign of the company's main web application with modern UI/UX."
    },
    {
      id: "2",
      name: "Mobile App Development",
      client: "StartupXYZ",
      status: "active",
      progress: 30,
      startDate: new Date(2024, 5, 15),
      endDate: new Date(2024, 8, 30),
      budget: 120000,
      team: ["Alice Brown", "David Wilson"],
      description: "Native mobile application for iOS and Android platforms."
    },
    {
      id: "3",
      name: "Data Migration Project",
      client: "Enterprise Solutions",
      status: "completed",
      progress: 100,
      startDate: new Date(2024, 3, 1),
      endDate: new Date(2024, 4, 30),
      budget: 65000,
      team: ["Emma Davis", "Tom Anderson"],
      description: "Migration of legacy data systems to modern cloud infrastructure."
    },
    {
      id: "4",
      name: "E-commerce Platform",
      client: "RetailMega",
      status: "planning",
      progress: 5,
      startDate: new Date(2024, 6, 1),
      endDate: new Date(2024, 10, 15),
      budget: 200000,
      team: ["Lisa Rodriguez"],
      description: "Custom e-commerce platform with advanced analytics and reporting."
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "completed": return "bg-blue-500";
      case "on-hold": return "bg-yellow-500";
      case "planning": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const filteredProjects = statusFilter === "all" 
    ? projects 
    : projects.filter(project => project.status === statusFilter);

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Projects Overview</h2>
          <p className="text-gray-600">Manage and track all your projects</p>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <p className="text-sm text-gray-600">{project.client}</p>
                </div>
                <Badge className={`${getStatusColor(project.status)} text-white`}>
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700">{project.description}</p>
              
              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {/* Project Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{project.startDate.toLocaleDateString()} - {project.endDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span>${project.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{project.team.length} team members</span>
                </div>
              </div>

              {/* Team Members */}
              <div>
                <p className="text-sm font-medium mb-2">Team:</p>
                <div className="flex flex-wrap gap-1">
                  {project.team.map((member, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {member}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No projects found for the selected filter.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
