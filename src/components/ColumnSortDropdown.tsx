
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, ArrowUp, ArrowDown } from "lucide-react";

interface ColumnSortDropdownProps {
  onSort: (field: string, direction: "asc" | "desc") => void;
  columnId: string;
}

export function ColumnSortDropdown({ onSort, columnId }: ColumnSortDropdownProps) {
  const sortOptions = [
    { field: 'created', label: 'Created' },
    { field: 'name', label: 'Name' },
    { field: 'rating', label: 'Rating' },
    { field: 'responsible', label: 'Responsible' }
  ];

  const [currentSort, setCurrentSort] = useState<{ field: string; direction: "asc" | "desc" } | null>(null);

  const handleSort = (field: string) => {
    // If clicking the same field, toggle direction. Otherwise start with ascending
    const direction = currentSort?.field === field && currentSort?.direction === "asc" ? "desc" : "asc";
    setCurrentSort({ field, direction });
    onSort(field, direction);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white border shadow-lg z-50">
        {sortOptions.map((option) => (
          <DropdownMenuItem 
            key={option.field}
            onClick={() => handleSort(option.field)} 
            className="cursor-pointer flex items-center"
          >
            <span className="flex-1">{option.label}</span>
            {currentSort?.field === option.field && (
              currentSort.direction === "asc" ? (
                <ArrowUp className="h-4 w-4 ml-2" />
              ) : (
                <ArrowDown className="h-4 w-4 ml-2" />
              )
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
