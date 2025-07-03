
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, ArrowUp, ArrowDown } from "lucide-react";

interface CandidateSortDropdownProps {
  onSort: (field: string, direction: "asc" | "desc") => void;
  currentSort: { field: string; direction: "asc" | "desc" };
}

export function CandidateSortDropdown({ onSort, currentSort }: CandidateSortDropdownProps) {
  const sortOptions = [
    { value: 'created', label: 'Created' },
    { value: 'name', label: 'Name' },
    { value: 'rating', label: 'Rating' },
    { value: 'responsible', label: 'Responsible' }
  ];

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === currentSort.field);
    const direction = currentSort.direction === 'asc' ? 'Ascending' : 'Descending';
    return option ? `Sort ${direction}` : 'Sort';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          {getCurrentSortLabel()}
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white border shadow-lg z-50">
        {sortOptions.map((option) => (
          <div key={option.value}>
            <DropdownMenuItem 
              onClick={() => onSort(option.value, "asc")} 
              className="cursor-pointer"
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              {option.label} Ascending
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onSort(option.value, "desc")} 
              className="cursor-pointer"
            >
              <ArrowDown className="h-4 w-4 mr-2" />
              {option.label} Descending
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
