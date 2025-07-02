import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnSortDropdown } from "./ColumnSortDropdown";

interface Candidate {
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
  status: string;
  last_activity_date?: string;
  responsible_user_id?: string;
}

interface CandidateKanbanBoardProps {
  candidates: Candidate[];
}

const CandidateCard = ({ candidate, index }: { candidate: Candidate; index: number }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCandidateAvatar();
  }, [candidate.id]);

  const loadCandidateAvatar = async () => {
    try {
      const extensions = ['jpg', 'png', 'jpeg', 'webp'];
      
      for (const ext of extensions) {
        const { data } = await supabase.storage
          .from('avatars')
          .getPublicUrl(`${candidate.id}.${ext}`);
        
        const response = await fetch(data.publicUrl);
        if (response.ok) {
          setAvatarUrl(data.publicUrl);
          break;
        }
      }
    } catch (error) {
      console.error("Error loading candidate avatar:", error);
    }
  };

  const getInitials = () => {
    return `${candidate.first_name.charAt(0)}${candidate.surname.charAt(0)}`.toUpperCase();
  };

  const getAvailabilityColor = () => {
    switch (candidate.availability.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'busy':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleCardClick = () => {
    navigate(`/profile/${candidate.id}`);
  };

  return (
    <Draggable draggableId={candidate.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-2 ${snapshot.isDragging ? 'opacity-75' : ''}`}
        >
          <Card 
            className="cursor-pointer hover:shadow-sm transition-shadow border border-gray-200 bg-white"
            onClick={handleCardClick}
          >
            <CardContent className="p-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <Avatar className="h-6 w-6 flex-shrink-0">
                    <AvatarImage 
                      src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${candidate.first_name}${candidate.surname}`} 
                      alt={`${candidate.first_name} ${candidate.surname}`} 
                    />
                    <AvatarFallback className="bg-blue-500 text-white text-xs font-medium">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-xs truncate">
                      {candidate.first_name} {candidate.surname}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {candidate.title}
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <MoreVertical className="h-3 w-3" />
                </button>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <Badge 
                  className={`text-xs px-1.5 py-0.5 rounded-full border ${getAvailabilityColor()}`}
                >
                  {candidate.availability}
                </Badge>
                <div className="text-xs text-gray-400">
                  {Math.floor(Math.random() * 10)} days
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

const columns = [
  { id: 'prospect', title: 'Prospect', count: 0 },
  { id: 'focus', title: 'Not Focus', count: 0 },
  { id: 'presented-prospect', title: 'Presented Prospect', count: 0 },
  { id: 'phone-coordination', title: 'Phone Coordination/First Call', count: 0 },
  { id: 'follow-up', title: 'Follow-up/Second Call', count: 0 },
  { id: 'high-interest', title: 'High Interest', count: 0 },
  { id: 'upgrading-other-agreements', title: 'Upgrading/Other Agreements', count: 0 },
  { id: 'seeking-upgrade', title: 'Seeking Upgrade!', count: 0 },
  { id: 'postponed', title: 'Postponed', count: 0 },
  { id: 'not-track', title: 'Not Track', count: 0 },
  { id: 'ok-if', title: 'OK IF', count: 0 },
];

export function CandidateKanbanBoard({ candidates }: CandidateKanbanBoardProps) {
  const queryClient = useQueryClient();
  const [sortedCandidates, setSortedCandidates] = useState(candidates);
  const [sortConfig, setSortConfig] = useState<{ field: string; direction: "asc" | "desc" } | null>(null);
  
  useEffect(() => {
    setSortedCandidates(candidates);
  }, [candidates]);

  // Group candidates by their status
  const candidatesByColumn = columns.reduce((acc, column) => {
    acc[column.id] = sortedCandidates.filter(candidate => 
      (candidate.status || 'prospect') === column.id
    );
    return acc;
  }, {} as Record<string, Candidate[]>);

  // Update column counts
  const columnsWithCounts = columns.map(column => ({
    ...column,
    count: candidatesByColumn[column.id]?.length || 0
  }));

  const updateCandidateStatus = async (candidateId: string, newStatus: string) => {
    try {
      console.log(`Updating candidate ${candidateId} status to ${newStatus}`);
      
      const { error } = await supabase
        .from('consultants')
        .update({ status: newStatus })
        .eq('id', candidateId);

      if (error) {
        console.error('Error updating candidate status:', error);
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: ["consultants"] });
      
      console.log(`Successfully updated candidate ${candidateId} status to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update candidate status:', error);
    }
  };

  const handleSort = (columnId: string, field: string, direction: "asc" | "desc") => {
    const columnCandidates = candidatesByColumn[columnId] || [];
    
    const sorted = [...columnCandidates].sort((a, b) => {
      let aValue, bValue;
      
      switch (field) {
        case 'name':
          aValue = `${a.first_name} ${a.surname}`.toLowerCase();
          bValue = `${b.first_name} ${b.surname}`.toLowerCase();
          break;
        case 'activity':
          aValue = a.last_activity_date || '';
          bValue = b.last_activity_date || '';
          break;
        case 'availability':
          aValue = a.availability.toLowerCase();
          bValue = b.availability.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // Update the candidates for this specific column
    const newCandidatesByColumn = { ...candidatesByColumn };
    newCandidatesByColumn[columnId] = sorted;
    
    // Flatten back to a single array
    const allSorted = Object.values(newCandidatesByColumn).flat();
    setSortedCandidates(allSorted);
    setSortConfig({ field, direction });
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    updateCandidateStatus(draggableId, destination.droppableId);
  };

  return (
    <div className="bg-white min-h-screen h-full">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex overflow-x-auto h-full">
          {columnsWithCounts.map((column) => {
            const columnCandidates = candidatesByColumn[column.id] || [];
            return (
              <div key={column.id} className="flex-shrink-0 w-64 bg-white border-r border-gray-200 h-full">
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 text-sm">{column.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {column.count}
                      </span>
                      <ColumnSortDropdown 
                        columnId={column.id}
                        onSort={(field, direction) => handleSort(column.id, field, direction)}
                      />
                    </div>
                  </div>
                </div>
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-2 space-y-2 min-h-[calc(100vh-200px)] max-h-[calc(100vh-200px)] overflow-y-auto ${
                        snapshot.isDraggingOver ? 'bg-blue-50' : ''
                      }`}
                    >
                      {columnCandidates.map((candidate, index) => (
                        <CandidateCard key={candidate.id} candidate={candidate} index={index} />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
