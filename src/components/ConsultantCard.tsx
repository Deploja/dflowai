import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, Mail, Phone, Edit } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

interface Consultant {
  id: string;
  first_name: string;
  surname: string;
  email: string;
  phone: string | null;
  title: string;
  location: string;
  experience_years: number;
  hourly_rate: number;
  availability: string;
  skills: string[];
}

interface ConsultantCardProps {
  consultant: Consultant;
  totalRevenue: number;
  formatCurrency: (amount: number) => string;
  onEdit: (consultant: Consultant) => void;
}

const ConsultantCard = ({ consultant, totalRevenue, formatCurrency, onEdit }: ConsultantCardProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadConsultantAvatar();
  }, [consultant.id]);

  const loadConsultantAvatar = async () => {
    try {
      // Try different common image extensions
      const extensions = ['jpg', 'png', 'jpeg', 'webp'];
      
      for (const ext of extensions) {
        const { data } = await supabase.storage
          .from('avatars')
          .getPublicUrl(`${consultant.id}.${ext}`);
        
        // Check if the file actually exists by trying to fetch it
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

  const getInitials = () => {
    return `${consultant.first_name.charAt(0)}${consultant.surname.charAt(0)}`.toUpperCase();
  };

  const getAvailabilityColor = () => {
    switch (consultant.availability.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'busy':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'partially available':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCardClick = () => {
    navigate(`/profile/${consultant.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when editing
    onEdit(consultant);
  };

  return (
    <Card 
      className="glass h-full transition-all duration-200 hover:shadow-lg border-gray-200/50 dark:border-gray-700/50 cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage 
              src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${consultant.first_name}${consultant.surname}`} 
              alt={`${consultant.first_name} ${consultant.surname}`} 
            />
            <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-lg">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {consultant.first_name} {consultant.surname}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
              {consultant.title}
            </p>
            <Badge 
              variant="outline" 
              className={`mt-2 text-xs ${getAvailabilityColor()}`}
            >
              {consultant.availability}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{consultant.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{consultant.experience_years} years experience</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>${consultant.hourly_rate}/hour</span>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{consultant.email}</span>
          </div>

          {consultant.phone && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{consultant.phone}</span>
            </div>
          )}

          {totalRevenue > 0 && (
            <div className="flex items-center text-sm text-green-600 dark:text-green-400">
              <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Total revenue: {formatCurrency(totalRevenue)}</span>
            </div>
          )}
        </div>

        {consultant.skills.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {consultant.skills.slice(0, 3).map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {skill}
                </Badge>
              ))}
              {consultant.skills.length > 3 && (
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  +{consultant.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleEditClick}
            className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsultantCard;
