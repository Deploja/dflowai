
import { useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { JobSearchForm } from "@/components/JobSearchForm";
import { JobResults } from "@/components/JobResults";
import { Job } from "@/types/job";

export default function JobSearch() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeSource, setActiveSource] = useState<'all' | 'arbetsformedlingen' | 'brainwille' | 'cinode'>('all');

  const handleJobsFound = (newJobs: Job[]) => {
    setJobs(newJobs);
  };

  const handleLoadingChange = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  const handleSourceChange = (source: 'all' | 'arbetsformedlingen' | 'brainwille' | 'cinode') => {
    setActiveSource(source);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">Job Search</h1>
          </header>
          <div className="flex-1 p-6">
            <div className="space-y-6">
              <JobSearchForm 
                onJobsFound={handleJobsFound}
                onLoadingChange={handleLoadingChange}
                activeSource={activeSource}
                onSourceChange={handleSourceChange}
              />
              <JobResults jobs={jobs} loading={loading} />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
