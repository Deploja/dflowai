
import { Button } from "@/components/ui/button";

interface CVTablePaginationProps {
  totalCVs: number;
}

export function CVTablePagination({ totalCVs }: CVTablePaginationProps) {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
      <div className="text-sm text-gray-600">
        {totalCVs} of {totalCVs} CV{totalCVs !== 1 ? 's' : ''}
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" disabled className="text-gray-400 border-gray-300">
          Previous
        </Button>
        <div className="flex items-center space-x-1">
          <Button size="sm" className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700 px-3 py-1">
            1
          </Button>
        </div>
        <Button variant="outline" size="sm" disabled className="text-gray-400 border-gray-300">
          Next
        </Button>
      </div>
    </div>
  );
}
