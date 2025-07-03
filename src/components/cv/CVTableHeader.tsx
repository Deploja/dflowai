import { TableHead } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SortField, SortDirection } from "./CVTableTypes";

interface SortableHeaderProps {
  field: SortField;
  children: React.ReactNode;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export function SortableHeader({
  field,
  children,
  sortField,
  sortDirection,
  onSort,
}: SortableHeaderProps) {
  return (
    <TableHead
      className="cursor-pointer select-none text-forground text-xs font-semibold uppercase tracking-wider py-3 px-6 border-b border-gray-200"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center justify-between">
        {children}
        <div className="flex flex-col ml-1">
          <ChevronUp
            className={`h-4 w-4 ${
              sortField === field && sortDirection === "asc"
                ? "text-blue-600"
                : "text-forground"
            }`}
          />
          <ChevronDown
            className={`h-4 w-4 -mt-1 ${
              sortField === field && sortDirection === "desc"
                ? "text-blue-600"
                : "text-forground"
            }`}
          />
        </div>
      </div>
    </TableHead>
  );
}
