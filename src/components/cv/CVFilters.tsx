import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, Shield } from "lucide-react";

interface CVFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showAllAsAdmin: boolean;
  setShowAllAsAdmin: (show: boolean) => void;
  isAdminOrOwner: boolean;
}

export function CVFilters({
  searchTerm,
  setSearchTerm,
  showAllAsAdmin,
  setShowAllAsAdmin,
  isAdminOrOwner,
}: CVFiltersProps) {
  return (
    <div className="bg-card rounded shadow-md px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium">
            <Plus className="h-4 w-4 mr-2" />
            CV
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
            />
          </div>
          <Button variant="outline" className=" text-sm font-medium">
            <Filter className="h-4 w-4 mr-2" />
            Users
          </Button>
          <Button variant="outline" className=" text-sm font-medium">
            <Filter className="h-4 w-4 mr-2" />
            Team
          </Button>
          {isAdminOrOwner && (
            <Button
              variant={showAllAsAdmin ? "default" : "outline"}
              onClick={() => setShowAllAsAdmin(!showAllAsAdmin)}
              className={
                showAllAsAdmin ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
              }
            >
              <Shield className="h-4 w-4 mr-2" />
              {showAllAsAdmin ? "Viewing All CVs" : "View All CVs"}
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm ml-4 ">Filter name</span>
          <Button variant="outline" size="sm" className="">
            <Filter className="h-4 w-4" />
          </Button>
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-sm font-medium">
            0
          </span>
        </div>
      </div>
    </div>
  );
}
