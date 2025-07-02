
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MoreHorizontal, ChevronRight } from "lucide-react";
import { Consultant } from "@/types/candidate";
import { getInitials, formatDate, getStatusDisplay } from "@/utils/candidateUtils";

interface CandidateTableRowProps {
  consultant: Consultant;
}

export function CandidateTableRow({ consultant }: CandidateTableRowProps) {
  const statusDisplay = getStatusDisplay(consultant.status);

  const renderStars = (rating: number = 4) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getResponsibleUserDisplay = () => {
    if (consultant.profiles?.full_name) {
      return consultant.profiles.full_name;
    }
    if (consultant.profiles?.first_name && consultant.profiles?.last_name) {
      return `${consultant.profiles.first_name} ${consultant.profiles.last_name}`;
    }
    return '-';
  };

  return (
    <TableRow className="hover:bg-gray-50 border-b border-gray-100">
      <TableCell className="py-4 px-4">
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </TableCell>
      <TableCell className="py-4 px-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-sm font-medium text-white">
            {getInitials(consultant.first_name, consultant.surname)}
          </div>
          <div>
            <div className="font-medium text-gray-900 text-sm">
              {consultant.first_name} {consultant.surname}
            </div>
            <div className="text-sm text-gray-500">{consultant.title}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="py-4 px-4">
        <div className="text-sm">
          <div className="text-gray-900">Konsultpipeline</div>
          <div className="text-gray-500">({statusDisplay.label})</div>
        </div>
      </TableCell>
      <TableCell className="py-4 px-4">
        <Badge 
          variant={statusDisplay.variant}
          className={
            statusDisplay.variant === 'default' 
              ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200 text-xs" 
              : statusDisplay.variant === 'outline'
              ? "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 text-xs"
              : "text-xs"
          }
        >
          {statusDisplay.label}
        </Badge>
      </TableCell>
      <TableCell className="py-4 px-4">
        <div className="text-sm text-gray-600">
          {getResponsibleUserDisplay()}
        </div>
      </TableCell>
      <TableCell className="py-4 px-4 text-center text-gray-500 text-sm">
        {consultant.availability || '-'}
      </TableCell>
      <TableCell className="py-4 px-4 text-sm text-gray-600">
        {formatDate(consultant.created_at)}
      </TableCell>
      <TableCell className="py-4 px-4">
        <div className="flex space-x-0.5">
          {renderStars(Math.floor(Math.random() * 3) + 3)}
        </div>
      </TableCell>
      <TableCell className="py-4 px-4">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
