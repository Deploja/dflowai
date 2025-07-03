import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { EmptyConsultantsState } from "./EmptyConsultantsState";
import { CandidatePipelineFilter } from "./CandidatePipelineFilter";
import { CandidateTableHeader } from "./candidates/CandidateTableHeader";
import { CandidateTableRow } from "./candidates/CandidateTableRow";
import { CandidateTableFooter } from "./candidates/CandidateTableFooter";
import { CandidateSortDropdown } from "./candidates/CandidateSortDropdown";
import { useCandidatesData } from "@/hooks/useCandidatesData";
import { CandidatesListViewProps } from "@/types/candidate";

const ITEMS_PER_PAGE = 15;

export function CandidatesListView({
  onAddCandidate,
}: CandidatesListViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { consultants, isLoading, error, handleSort, sortConfig } =
    useCandidatesData();

  // For now, show all consultants - filtering will be handled by the filter component
  const filteredConsultants = consultants || [];

  const totalPages = Math.ceil(filteredConsultants.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedConsultants = filteredConsultants.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortWithPageReset = (
    field: string,
    direction: "asc" | "desc"
  ) => {
    handleSort(field, direction);
    setCurrentPage(1); // Reset to first page when sorting
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading candidates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-800 m-6">
        <CardContent className="pt-6">
          <p className="text-red-600 dark:text-red-400">
            An error occurred while fetching candidates: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!consultants || consultants.length === 0) {
    return <EmptyConsultantsState onAddConsultant={onAddCandidate} />;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header with Candidates title */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">Candidates</h1>
      </div>

      {/* Pipeline Filter Component */}
      <CandidatePipelineFilter
        onAddCandidate={onAddCandidate}
        candidateCount={filteredConsultants.length}
      />

      {/* Sort Controls */}
      <div className="px-6 py-2 border-b border-gray-200">
        <CandidateSortDropdown
          onSort={handleSortWithPageReset}
          currentSort={sortConfig}
        />
      </div>

      {/* Table container */}
      <div className="flex-1 mx-6 rounded-lg shadow-sm border border-gray-200">
        <Table>
          <CandidateTableHeader onSort={handleSortWithPageReset} />
          <TableBody>
            {paginatedConsultants.map((consultant) => (
              <CandidateTableRow key={consultant.id} consultant={consultant} />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <CandidateTableFooter
        currentPage={currentPage}
        totalPages={totalPages}
        totalCandidates={filteredConsultants.length}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
