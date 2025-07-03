
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Star, MapPin, Clock, Mail, Phone, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Match {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  projectName: string;
  clientName: string;
  matchScore: number;
  skills: string[];
  location: string;
  availability: string;
  hourlyRate: number;
  experience: number;
  status: "new" | "contacted" | "interviewed" | "rejected" | "hired";
}

export function MatchesView() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [scoreFilter, setScoreFilter] = useState<string>("all");

  const matches: Match[] = [
    {
      id: "1",
      candidateName: "Alex Thompson",
      candidateEmail: "alex.thompson@email.com",
      candidatePhone: "+1 (555) 123-4567",
      projectName: "React Frontend Development",
      clientName: "TechCorp Inc.",
      matchScore: 95,
      skills: ["React", "TypeScript", "Node.js", "AWS"],
      location: "New York, NY",
      availability: "Available",
      hourlyRate: 85,
      experience: 5,
      status: "new"
    },
    {
      id: "2",
      candidateName: "Maria Rodriguez",
      candidateEmail: "maria.rodriguez@email.com", 
      candidatePhone: "+1 (555) 987-6543",
      projectName: "Full Stack Development",
      clientName: "StartupXYZ",
      matchScore: 88,
      skills: ["Vue.js", "Python", "PostgreSQL", "Docker"],
      location: "San Francisco, CA",
      availability: "Available in 2 weeks",
      hourlyRate: 95,
      experience: 7,
      status: "contacted"
    },
    {
      id: "3",
      candidateName: "David Chen",
      candidateEmail: "david.chen@email.com",
      candidatePhone: "+1 (555) 456-7890",
      projectName: "Mobile App Development",
      clientName: "MobileFirst",
      matchScore: 92,
      skills: ["React Native", "Flutter", "Firebase", "iOS"],
      location: "Austin, TX",
      availability: "Available",
      hourlyRate: 80,
      experience: 4,
      status: "interviewed"
    },
    {
      id: "4",
      candidateName: "Sarah Johnson",
      candidateEmail: "sarah.johnson@email.com",
      candidatePhone: "+1 (555) 321-0987",
      projectName: "Data Engineering",
      clientName: "DataCorp",
      matchScore: 78,
      skills: ["Python", "Spark", "Kafka", "GCP"],
      location: "Chicago, IL",
      availability: "Available in 1 month",
      hourlyRate: 110,
      experience: 8,
      status: "new"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-500";
      case "contacted": return "bg-yellow-500";
      case "interviewed": return "bg-purple-500";
      case "rejected": return "bg-red-500";
      case "hired": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredMatches = matches.filter(match => {
    if (statusFilter !== "all" && match.status !== statusFilter) return false;
    if (scoreFilter === "high" && match.matchScore < 90) return false;
    if (scoreFilter === "medium" && (match.matchScore < 80 || match.matchScore >= 90)) return false;
    if (scoreFilter === "low" && match.matchScore >= 80) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Candidate Matches</h2>
          <p className="text-gray-600">AI-powered candidate matching for your projects</p>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="interviewed">Interviewed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
            </SelectContent>
          </Select>
          <Select value={scoreFilter} onValueChange={setScoreFilter}>
            <SelectTrigger className="w-40">
              <Star className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scores</SelectItem>
              <SelectItem value="high">High (90%+)</SelectItem>
              <SelectItem value="medium">Medium (80-89%)</SelectItem>
              <SelectItem value="low">Low (&lt;80%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {filteredMatches.map((match) => (
          <Card key={match.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {match.candidateName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{match.candidateName}</CardTitle>
                    <p className="text-sm text-gray-600">{match.projectName} • {match.clientName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getMatchScoreColor(match.matchScore)}`}>
                    {match.matchScore}%
                  </div>
                  <p className="text-sm text-gray-500">Match Score</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Match Score Progress */}
              <div>
                <Progress value={match.matchScore} className="h-2" />
              </div>

              {/* Candidate Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{match.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{match.availability}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{match.candidateEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{match.candidatePhone}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p><strong>Rate:</strong> ${match.hourlyRate}/hour</p>
                  <p><strong>Experience:</strong> {match.experience} years</p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <p className="text-sm font-medium mb-2">Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {match.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex justify-between items-center pt-4 border-t">
                <Badge className={`${getStatusColor(match.status)} text-white`}>
                  {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                  <Button size="sm">
                    Contact
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMatches.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No matches found for the selected filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
