import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, ChevronDown, Filter } from "lucide-react";
import { FilterPresets } from "./FilterPresets";
import { ActivityDateSelector } from "./ActivityDateSelector";

interface CandidatePipelineFilterProps {
  onAddCandidate: () => void;
  candidateCount?: number;
}

const responsibleUsers = [
  { id: "1", name: "John Smith" },
  { id: "2", name: "Sarah Johnson" },
  { id: "3", name: "Mike Chen" },
  { id: "4", name: "Lisa Anderson" },
];

const statusOptions = [
  { id: "open", label: "Open", color: "bg-blue-500" },
  { id: "closed", label: "Closed", color: "bg-gray-500" },
];

export function CandidatePipelineFilter({
  onAddCandidate,
  candidateCount = 0,
}: CandidatePipelineFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResponsible, setSelectedResponsible] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [activityDate, setActivityDate] = useState<Date>();

  const handleResponsibleChange = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedResponsible([...selectedResponsible, userId]);
    } else {
      setSelectedResponsible(selectedResponsible.filter((id) => id !== userId));
    }
  };

  const handleStatusChange = (statusId: string, checked: boolean) => {
    if (checked) {
      setSelectedStatuses([...selectedStatuses, statusId]);
    } else {
      setSelectedStatuses(selectedStatuses.filter((id) => id !== statusId));
    }
  };

  const currentFilters = {
    searchTerm,
    selectedResponsible,
    selectedStatuses,
    activityDate: activityDate?.toISOString(),
  };

  const applyFilterPreset = (filters: any) => {
    setSearchTerm(filters.searchTerm || "");
    setSelectedResponsible(filters.selectedResponsible || []);
    setSelectedStatuses(filters.selectedStatuses || []);
    if (filters.activityDate) {
      setActivityDate(new Date(filters.activityDate));
    }
  };

  const activeFiltersCount =
    selectedResponsible.length +
    selectedStatuses.length +
    (activityDate ? 1 : 0);

  return (
    <div className="  border-gray-200 px-4 py-3 ">
      <div className="flex items-center space-x-6 mb-3">
        {/* Add Button */}
        <Button
          onClick={onAddCandidate}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Candidate
        </Button>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64 bg-[#f1f1f1]/80 text-gray-900 placeholder:text-gray-900 rounded"
          />
        </div>

        {/* Pipeline Dropdown */}
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="bg-white/50 hover:bg-gray-300/50 text-gray-900 font-medium rounded-sm"
              >
                Consultant Pipeline
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white/50 hover:bg-gray-300/50 text-gray-900 font-medium rounded-lg">
              <DropdownMenuItem className="text-gray-900 hover:bg-gray-100">
                Consultant Pipeline
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Responsible Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="bg-white/50 hover:bg-gray-300/50 text-gray-900  font-medium rounded-sm"
            >
              Responsible
              {selectedResponsible.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 text-xs bg-gray-200 text-gray-900"
                >
                  {selectedResponsible.length}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white/50 backdrop-blur-sm hover:bg-gray-300/50 text-gray-900 font-medium rounded-lg">
            {responsibleUsers.map((user) => (
              <DropdownMenuItem key={user.id} className="hover:bg-gray-100">
                <div className="flex items-center space-x-2 w-full">
                  <Checkbox
                    id={`responsible-${user.id}`}
                    checked={selectedResponsible.includes(user.id)}
                    onCheckedChange={(checked) =>
                      handleResponsibleChange(user.id, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`responsible-${user.id}`}
                    className="text-sm font-medium text-gray-900 cursor-pointer flex-1"
                  >
                    {user.name}
                  </label>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Activity Date Filter */}
        <div className="bg-white/50 hover:bg-gray-300/50 text-gray-900 font-medium rounded-sm">
          <ActivityDateSelector
            selectedDate={activityDate}
            onDateChange={setActivityDate}
          />
        </div>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="bg-white/50 hover:bg-gray-300/50 text-gray-900 hover:text-white backdrop-blur-md font-medium rounded-sm"
            >
              Status
              {selectedStatuses.length > 0 && (
                <Badge className="ml-2 text-xs bg-blue-600 text-white">
                  Open
                </Badge>
              )}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white/50 hover:bg-gray-300/50 text-gray-900 font-medium rounded-sm">
            {statusOptions.map((status) => (
              <DropdownMenuItem key={status.id} className="hover:bg-gray-500">
                <div className="flex items-center space-x-2 w-full">
                  <Checkbox
                    id={`status-${status.id}`}
                    checked={selectedStatuses.includes(status.id)}
                    onCheckedChange={(checked) =>
                      handleStatusChange(status.id, checked as boolean)
                    }
                  />
                  <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
                  <label
                    htmlFor={`status-${status.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-white cursor-pointer flex-1"
                  >
                    {status.label}
                  </label>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Custom Filter Button */}
        <Button
          variant="ghost"
          className="bg-white/50 hover:bg-gray-300/50 text-gray-900 font-medium rounded-sm"
        >
          Custom Filter
          <Filter className="h-4 w-4 ml-2" />
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 text-xs bg-emerald-600 text-white">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter Presets Row */}
      <div className="flex items-center justify-between">
        <FilterPresets
          currentFilters={currentFilters}
          onApplyPreset={applyFilterPreset}
        />
      </div>
    </div>
  );
}
