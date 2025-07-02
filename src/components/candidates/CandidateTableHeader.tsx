
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnSortDropdown } from "../ColumnSortDropdown";

interface CandidateTableHeaderProps {
  onSort: (field: string, direction: "asc" | "desc") => void;
}

export function CandidateTableHeader({ onSort }: CandidateTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow className="border-b border-gray-200 bg-gray-50 hover:bg-gray-50">
        <TableHead className="w-4 py-3 px-4"></TableHead>
        <TableHead className="font-medium text-gray-700 text-xs uppercase tracking-wider py-3 px-4">
          <div className="flex items-center space-x-2">
            <span>NAME</span>
            <ColumnSortDropdown onSort={onSort} columnId="name" />
          </div>
        </TableHead>
        <TableHead className="font-medium text-gray-700 text-xs uppercase tracking-wider py-3 px-4">
          <div className="flex items-center space-x-2">
            <span>PIPE / STAGE</span>
            <ColumnSortDropdown onSort={onSort} columnId="status" />
          </div>
        </TableHead>
        <TableHead className="font-medium text-gray-700 text-xs uppercase tracking-wider py-3 px-4">
          <div className="flex items-center space-x-2">
            <span>STATUS</span>
            <ColumnSortDropdown onSort={onSort} columnId="status" />
          </div>
        </TableHead>
        <TableHead className="font-medium text-gray-700 text-xs uppercase tracking-wider py-3 px-4">
          <div className="flex items-center space-x-2">
            <span>RESPONSIBLE</span>
            <ColumnSortDropdown onSort={onSort} columnId="responsible" />
          </div>
        </TableHead>
        <TableHead className="font-medium text-gray-700 text-xs uppercase tracking-wider py-3 px-4">
          <div className="flex items-center space-x-2">
            <span>AVAILABLE</span>
            <ColumnSortDropdown onSort={onSort} columnId="availability" />
          </div>
        </TableHead>
        <TableHead className="font-medium text-gray-700 text-xs uppercase tracking-wider py-3 px-4">
          <div className="flex items-center space-x-2">
            <span>ADDED</span>
            <ColumnSortDropdown onSort={onSort} columnId="created" />
          </div>
        </TableHead>
        <TableHead className="font-medium text-gray-700 text-xs uppercase tracking-wider py-3 px-4">
          <div className="flex items-center space-x-2">
            <span>RATING</span>
            <ColumnSortDropdown onSort={onSort} columnId="rating" />
          </div>
        </TableHead>
        <TableHead className="w-4 py-3 px-4"></TableHead>
      </TableRow>
    </TableHeader>
  );
}
