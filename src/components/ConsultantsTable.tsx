
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, MapPin, Mail, Phone, DollarSign } from "lucide-react";

interface Consultant {
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

interface ConsultantsTableProps {
  consultants: Consultant[];
  consultantRevenues: Record<string, number>;
  onEditConsultant: (consultant: Consultant) => void;
  formatCurrency: (amount: number) => string;
}

// Avatar Cell Component with avatar loading
const AvatarCell = ({ consultant, onClick }: { consultant: Consultant; onClick: () => void }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    loadConsultantAvatar();
  }, [consultant.id]);

  const loadConsultantAvatar = async () => {
    try {
      const extensions = ['jpg', 'png', 'jpeg', 'webp'];
      
      for (const ext of extensions) {
        const { data } = await supabase.storage
          .from('avatars')
          .getPublicUrl(`${consultant.id}.${ext}`);
        
        const response = await fetch(data.publicUrl);
        if (response.ok) {
          setAvatarUrl(data.publicUrl);
          break;
        }
      }
    } catch (error) {
      console.error("Error loading consultant avatar:", error);
    }
  };

  return (
    <div 
      className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded-lg transition-colors"
      onClick={onClick}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage 
          src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${consultant.first_name} ${consultant.surname}`} 
          alt={`${consultant.first_name} ${consultant.surname}`}
        />
        <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs">
          {consultant.first_name.charAt(0)}{consultant.surname.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {consultant.first_name} {consultant.surname}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {consultant.title}
        </div>
      </div>
    </div>
  );
};

export function ConsultantsTable({ 
  consultants, 
  consultantRevenues, 
  onEditConsultant, 
  formatCurrency 
}: ConsultantsTableProps) {
  const navigate = useNavigate();

  const handleConsultantClick = (consultantId: string) => {
    navigate(`/profile/${consultantId}`);
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultants.map((consultant) => {
            const totalRevenue = consultantRevenues?.[consultant.id] || 0;
            return (
              <TableRow key={consultant.id}>
                <TableCell>
                  <AvatarCell
                    consultant={consultant}
                    onClick={() => handleConsultantClick(consultant.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="h-3 w-3 mr-1" />
                      {consultant.email}
                    </div>
                    {consultant.phone && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="h-3 w-3 mr-1" />
                        {consultant.phone}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-3 w-3 mr-1" />
                      {consultant.location}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {consultant.location}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {consultant.skills.slice(0, 2).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {consultant.skills.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{consultant.skills.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {consultant.experience_years} years
                  </span>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm font-medium text-green-600 dark:text-green-400">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {formatCurrency(totalRevenue)}
                    </div>
                    <div className="text-xs text-gray-500">
                      ${consultant.hourly_rate}/h
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={consultant.availability === 'Available' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {consultant.availability === 'Available' ? 'Available' : 
                     consultant.availability === 'Busy' ? 'Busy' : 'Partially Available'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditConsultant(consultant)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
