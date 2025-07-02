
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Mail } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Recruiter" | "User";
  status: "Active" | "Inactive";
  joinDate: string;
  avatar?: string;
}

// User Row Component with avatar loading
const UserRow = ({ user }: { user: User }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    loadUserAvatar();
  }, [user.id]);

  const loadUserAvatar = async () => {
    try {
      const extensions = ['jpg', 'png', 'jpeg', 'webp'];
      
      for (const ext of extensions) {
        const { data } = await supabase.storage
          .from('avatars')
          .getPublicUrl(`${user.id}.${ext}`);
        
        const response = await fetch(data.publicUrl);
        if (response.ok) {
          setAvatarUrl(data.publicUrl);
          break;
        }
      }
    } catch (error) {
      console.error("Error loading user avatar:", error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-700 border-red-200";
      case "Manager":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Recruiter":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "User":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage 
            src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
            alt={user.name}
          />
          <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            {user.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-gray-900 dark:text-gray-100">{user.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
          <div className="text-xs text-gray-400">Joined {user.joinDate}</div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Badge className={getRoleColor(user.role)}>
          {user.role}
        </Badge>
        <Badge variant={user.status === "Active" ? "default" : "secondary"}>
          {user.status}
        </Badge>
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm">
            <Mail className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  // Mock data - would come from Supabase in real implementation
  const users: User[] = [
    {
      id: "1",
      name: "John Smith",
      email: "john@company.com",
      role: "Admin",
      status: "Active",
      joinDate: "2024-01-15"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "Manager",
      status: "Active",
      joinDate: "2024-02-20"
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike@company.com",
      role: "User",
      status: "Active",
      joinDate: "2024-03-10"
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">User Management</h2>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
            <SelectItem value="Recruiter">Recruiter</SelectItem>
            <SelectItem value="User">User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
