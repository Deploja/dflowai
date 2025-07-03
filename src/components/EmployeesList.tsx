
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, MapPin, Filter, Users } from "lucide-react";
import { AddConsultantForm } from "./AddConsultantForm";
import { EditConsultantForm } from "./EditConsultantForm";

interface Employee {
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
}

// Employee Card Component with avatar loading
const EmployeeCard = ({ employee, onClick, onEdit }: { 
  employee: Employee; 
  onClick: () => void; 
  onEdit: (e: React.MouseEvent) => void; 
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    loadEmployeeAvatar();
  }, [employee.id]);

  const loadEmployeeAvatar = async () => {
    try {
      const extensions = ['jpg', 'png', 'jpeg', 'webp'];
      
      for (const ext of extensions) {
        const { data } = await supabase.storage
          .from('avatars')
          .getPublicUrl(`${employee.id}.${ext}`);
        
        const response = await fetch(data.publicUrl);
        if (response.ok) {
          setAvatarUrl(data.publicUrl);
          break;
        }
      }
    } catch (error) {
      console.error("Error loading employee avatar:", error);
    }
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        <Avatar className="h-16 w-16 mx-auto mb-4">
          <AvatarImage 
            src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${employee.first_name} ${employee.surname}`} 
            alt={`${employee.first_name} ${employee.surname}`}
          />
          <AvatarFallback className="text-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            {employee.first_name.charAt(0)}{employee.surname.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {employee.first_name} {employee.surname}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
          {employee.title}
        </p>
        
        <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm mb-3">
          <MapPin className="h-3 w-3 mr-1" />
          {employee.location}
        </div>
        
        <div className="flex flex-wrap gap-1 justify-center">
          {employee.skills.slice(0, 2).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {employee.skills.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{employee.skills.length - 2}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export function EmployeesList() {
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { data: employees, isLoading, refetch } = useQuery({
    queryKey: ["consultants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultants")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Employee[];
    },
  });

  const filteredEmployees = employees?.filter(employee => 
    employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.location.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEmployeeAdded = () => {
    refetch();
    setShowAddEmployee(false);
  };

  const handleEmployeeClick = (employee: Employee) => {
    navigate(`/profile/${employee.id}`);
  };

  const handleEditEmployee = (e: React.MouseEvent, employee: Employee) => {
    e.stopPropagation();
    setEditingEmployee(employee);
    setShowEditForm(true);
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
    setEditingEmployee(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Input placeholder="Search employees..." className="w-64" disabled />
            <Button variant="outline" disabled>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-gray-50 dark:bg-gray-900">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto"></div>
                  <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-2/3 h-3 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
                  <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Team
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Tags
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Office location
          </Button>
        </div>
        <Button onClick={() => setShowAddEmployee(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEmployees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onClick={() => handleEmployeeClick(employee)}
            onEdit={(e) => handleEditEmployee(e, employee)}
          />
        ))}
      </div>

      {filteredEmployees.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            <Users className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg">No employees found</p>
            <p className="text-sm">Add your first employee to get started</p>
          </div>
          <Button onClick={() => setShowAddEmployee(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      )}

      <AddConsultantForm
        open={showAddEmployee}
        onOpenChange={setShowAddEmployee}
        onSuccess={handleEmployeeAdded}
      />

      {editingEmployee && (
        <EditConsultantForm
          consultant={editingEmployee}
          open={showEditForm}
          onOpenChange={setShowEditForm}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
