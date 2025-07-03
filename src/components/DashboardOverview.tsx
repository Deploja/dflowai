
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Calendar, Clock, TrendingUp } from "lucide-react";

export function DashboardOverview() {
  const recentMessages = [
    {
      id: "1",
      sender: "John Smith",
      content: "Thanks for the update on the project timeline",
      timestamp: new Date(2024, 5, 25, 14, 30),
      isUnread: true
    },
    {
      id: "2",
      sender: "Sarah Johnson",
      content: "Can we schedule a call for tomorrow?",
      timestamp: new Date(2024, 5, 25, 10, 15),
      isUnread: true
    },
    {
      id: "3",
      sender: "Team Alpha",
      content: "Meeting notes have been shared",
      timestamp: new Date(2024, 5, 24, 16, 45),
      isUnread: false
    }
  ];

  const recentProjects = [
    {
      id: "1",
      name: "Enterprise Migration",
      status: "In Progress",
      dueDate: "2024-07-15",
      consultant: "Alice Cooper"
    },
    {
      id: "2",
      name: "Mobile App Development",
      status: "Planning",
      dueDate: "2024-08-01",
      consultant: "Bob Wilson"
    },
    {
      id: "3",
      name: "System Integration",
      status: "Completed",
      dueDate: "2024-06-20",
      consultant: "Carol Davis"
    }
  ];

  const upcomingActivities = [
    {
      id: "1",
      title: "Client Meeting - TechCorp",
      time: "10:00 AM",
      type: "meeting"
    },
    {
      id: "2",
      title: "Project Review",
      time: "2:00 PM",
      type: "review"
    },
    {
      id: "3",
      title: "Team Standup",
      time: "9:00 AM Tomorrow",
      type: "standup"
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Recent Messages */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recent Messages
          </CardTitle>
          <CardDescription>Latest communications</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="space-y-3">
              {recentMessages.map((message) => (
                <div key={message.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {message.sender.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{message.sender}</p>
                      {message.isUnread && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{message.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Recent Projects */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Active Projects
          </CardTitle>
          <CardDescription>Current project status</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <div key={project.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{project.name}</h4>
                    <Badge variant={
                      project.status === "Completed" ? "default" :
                      project.status === "In Progress" ? "secondary" : "outline"
                    }>
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">Consultant: {project.consultant}</p>
                  <p className="text-xs text-gray-500">Due: {new Date(project.dueDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Upcoming Activities */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Today's Schedule
          </CardTitle>
          <CardDescription>Upcoming activities</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="space-y-3">
              {upcomingActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
