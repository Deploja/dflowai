import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase, Code, Database } from "lucide-react";
import { Job } from "@/types/job";
import { searchJobs } from "@/services/jobSearchService";
import { useToast } from "@/hooks/use-toast";

interface JobSearchFormProps {
  onJobsFound: (jobs: Job[]) => void;
  onLoadingChange: (loading: boolean) => void;
  activeSource: "all" | "arbetsformedlingen" | "brainwille" | "cinode";
  onSourceChange: (
    source: "all" | "arbetsformedlingen" | "brainwille" | "cinode"
  ) => void;
}

export function JobSearchForm({
  onJobsFound,
  onLoadingChange,
  activeSource,
  onSourceChange,
}: JobSearchFormProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [occupation, setOccupation] = useState("");
  const { toast } = useToast();

  const quickSearchTerms = [
    { label: "Latest Programmer Jobs", icon: Code, search: "programmer" },
    { label: "Latest Database Jobs", icon: Database, search: "database" },
  ];

  const recentJobs = ["React Developer", "Python Developer", "DevOps Engineer"];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    onLoadingChange(true);

    try {
      console.log("Starting job search with params:", {
        searchTerm,
        location,
        occupation,
        source: activeSource,
      });

      const jobs = await searchJobs({
        searchTerm: searchTerm.trim() || undefined,
        location: location.trim() || undefined,
        occupation: occupation.trim() || undefined,
        source: activeSource === "all" ? undefined : activeSource,
      });

      console.log("Job search completed, found jobs:", jobs.length);

      onJobsFound(jobs);

      toast({
        title: "Search completed",
        description: `Found ${jobs.length} jobs matching your criteria.`,
      });
    } catch (error) {
      console.error("Error searching jobs:", error);

      toast({
        title: "Search error",
        description:
          "Something went wrong during the search. Please try again later.",
        variant: "destructive",
      });

      onJobsFound([]);
    } finally {
      onLoadingChange(false);
    }
  };

  const handleQuickSearch = async (searchQuery: string) => {
    setSearchTerm(searchQuery);
    onLoadingChange(true);

    try {
      const jobs = await searchJobs({
        searchTerm: searchQuery,
        source: activeSource === "all" ? undefined : activeSource,
      });

      onJobsFound(jobs);

      toast({
        title: "Search completed",
        description: `Found ${jobs.length} jobs for "${searchQuery}".`,
      });
    } catch (error) {
      console.error("Error in quick search:", error);
      toast({
        title: "Search error",
        description:
          "Something went wrong during the search. Please try again later.",
        variant: "destructive",
      });
      onJobsFound([]);
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Search Card */}
      <Card className=" ">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Search className="mr-3 h-7 w-7" />
            Search Jobs
          </CardTitle>
          <p className=" mt-1">
            Search for jobs using keywords, location, or occupation from
            multiple job platforms.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Tabs */}
          <div className="flex space-x-1 p-1 rounded-sm">
            <button className="flex items-center space-x-2 px-4 py-2  rounded-sm text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700">
              <Search className="h-4 w-4" />
              <span>Keywords</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2  rounded-sm text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2  rounded-sm text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700">
              <Briefcase className="h-4 w-4" />
              <span>Occupation</span>
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder='Search by keywords... (try "developer", "Stockholm", "engineer")'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                variant="outline"
                className="h-10 px-8"
              >
                Search
              </Button>
              <Button
                type="button"
                variant="default"
                size="lg"
                className="h-10 px-6 "
              >
                Recent Jobs
              </Button>
            </div>

            {/* Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="location"
                  className="text-gray-700 dark:text-gray-300 mb-2 block"
                >
                  Location
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Stockholm, Gothenburg..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className=""
                />
              </div>
              <div>
                <Label
                  htmlFor="occupation"
                  className="text-gray-700 dark:text-gray-300 mb-2 block"
                >
                  Occupation
                </Label>
                <Input
                  id="occupation"
                  type="text"
                  placeholder="Software Engineer, Developer..."
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className=""
                />
              </div>
            </div>
          </form>

          {/* Quick Search Buttons */}
          <div className="flex flex-wrap gap-3">
            {quickSearchTerms.map((term) => (
              <Button
                key={term.search}
                onClick={() => handleQuickSearch(term.search)}
                variant="outline"
                className="flex items-center space-x-2 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
              >
                <term.icon className="h-4 w-4" />
                <span>{term.label}</span>
              </Button>
            ))}
          </div>

          {/* Recent Jobs */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recent searches:
            </h4>
            <div className="flex flex-wrap gap-2">
              {recentJobs.map((job) => (
                <Badge
                  key={job}
                  variant="secondary"
                  className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => handleQuickSearch(job)}
                >
                  {job}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
