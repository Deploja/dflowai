
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, MapPin, Users, AlertCircle } from "lucide-react";

interface Team {
  id: string;
  name: string;
  location: string;
  memberCount: number;
  status: "active" | "recruiting" | "inactive";
}

export function TeamsList() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for teams based on the image
  const teams: Team[] = [
    {
      id: "1",
      name: "Stockholm",
      location: "Stockholm",
      memberCount: 13,
      status: "recruiting"
    },
    {
      id: "2", 
      name: "Göteborg",
      location: "Göteborg",
      memberCount: 1,
      status: "active"
    },
    {
      id: "3",
      name: "Malmö",
      location: "Malmö", 
      memberCount: 0,
      status: "inactive"
    }
  ];

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "recruiting":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Responsible
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Location
          </Button>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Team
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <Card key={team.id} className="hover:shadow-lg transition-shadow cursor-pointer relative">
            {team.status === "recruiting" && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-blue-500 text-white">
                  Recruiting
                </Badge>
              </div>
            )}
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm">
                  <Users className="h-4 w-4 mr-1" />
                  {team.memberCount} {team.memberCount === 1 ? 'member' : 'members'}
                </div>
                
                <h3 className="font-semibold text-xl text-gray-900 dark:text-gray-100">
                  {team.name}
                </h3>
                
                <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  {team.location}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            <Users className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg">No teams found</p>
            <p className="text-sm">Create your first team to get started</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Team
          </Button>
        </div>
      )}
    </div>
  );
}
