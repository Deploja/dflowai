
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, Edit, Trash2, TrendingUp } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  employeeCount: number;
  inDemand: boolean;
}

export function SkillsManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const skills: Skill[] = [
    {
      id: "1",
      name: "React",
      category: "Frontend",
      level: 85,
      employeeCount: 12,
      inDemand: true
    },
    {
      id: "2",
      name: "Node.js",
      category: "Backend",
      level: 78,
      employeeCount: 8,
      inDemand: true
    },
    {
      id: "3",
      name: "Project Management",
      category: "Management",
      level: 92,
      employeeCount: 5,
      inDemand: false
    },
    {
      id: "4",
      name: "AWS",
      category: "Cloud",
      level: 70,
      employeeCount: 6,
      inDemand: true
    }
  ];

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Frontend":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Backend":
        return "bg-green-100 text-green-700 border-green-200";
      case "Management":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Cloud":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Skills Management</h2>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill) => (
          <Card key={skill.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{skill.name}</CardTitle>
                {skill.inDemand && (
                  <Badge className="bg-red-100 text-red-700 border-red-200">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    In Demand
                  </Badge>
                )}
              </div>
              <Badge className={getCategoryColor(skill.category)}>
                {skill.category}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Team Proficiency</span>
                  <span>{skill.level}%</span>
                </div>
                <Progress value={skill.level} className="h-2" />
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {skill.employeeCount} employees
                </span>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
