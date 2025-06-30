
import { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SortableHeader } from "./CVTableHeader";
import { CVTableRowComponent } from "./CVTableRow";
import { CVTablePagination } from "./CVTablePagination";
import { CVTableProps, SortField, SortDirection } from "./CVTableTypes";

export function CVTable({ cvs, isAdminOrOwner }: CVTableProps) {
  const [sortField, setSortField] = useState<SortField>('last_activity');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedCVs = [...cvs].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case 'title':
        aValue = a.title;
        bValue = b.title;
        break;
      case 'user':
        aValue = a.user?.name || '';
        bValue = b.user?.name || '';
        break;
      case 'last_activity':
        aValue = new Date(a.last_activity_at || a.updated_at).getTime();
        bValue = new Date(b.last_activity_at || b.updated_at).getTime();
        break;
      case 'created_at':
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
      default:
        return 0;
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b border-gray-200">
            <SortableHeader 
              field="title" 
              sortField={sortField} 
              sortDirection={sortDirection} 
              onSort={handleSort}
            >
              TITLE
            </SortableHeader>
            <SortableHeader 
              field="user" 
              sortField={sortField} 
              sortDirection={sortDirection} 
              onSort={handleSort}
            >
              USER
            </SortableHeader>
            <SortableHeader 
              field="last_activity" 
              sortField={sortField} 
              sortDirection={sortDirection} 
              onSort={handleSort}
            >
              LATEST ACTIVITY
            </SortableHeader>
            <SortableHeader 
              field="created_at" 
              sortField={sortField} 
              sortDirection={sortDirection} 
              onSort={handleSort}
            >
              CREATED
            </SortableHeader>
            <TableHead className="w-12 text-xs font-semibold text-gray-600 uppercase tracking-wider py-3 px-6 border-b border-gray-200"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCVs.map((cv, index) => (
            <CVTableRowComponent key={cv.id} cv={cv} index={index} />
          ))}
        </TableBody>
      </Table>
      
      <CVTablePagination totalCVs={cvs.length} />
    </div>
  );
}
