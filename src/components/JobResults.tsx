import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building, Calendar, ExternalLink, Loader2, Users, Clock, Tag } from "lucide-react";
import { Job } from "@/types/job";

interface JobResultsProps {
  jobs: Job[];
  loading: boolean;
}

const getSourceBadgeColor = (source: string) => {
  switch (source) {
    case 'arbetsformedlingen':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'brainwille':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'cinode':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

const formatSource = (source: string) => {
  switch (source) {
    case 'arbetsformedlingen':
      return 'Employment Agency';
    case 'brainwille':
      return 'Brainville';
    case 'cinode':
      return 'Cinode';
    default:
      return source;
  }
};

export function JobResults({ jobs, loading }: JobResultsProps) {
  if (loading) {
    return (
      <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-gray-800">
        <CardContent className="flex items-center justify-center py-16">
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-lg">Searching for jobs...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-gray-800">
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="text-xl font-medium mb-2">No jobs found</p>
            <p className="text-base">Try different search terms or filter less specifically.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Job Listings ({jobs.length} found)
        </h2>
        <div className="flex items-center space-x-4">
          <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100">
            <option>Day published...</option>
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
          <Button variant="outline" size="sm">
            Clear Cache
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900 dark:text-gray-100 mb-2">
                        {job.title}
                        <Badge className={`ml-3 text-xs ${getSourceBadgeColor(job.source)}`}>
                          {formatSource(job.source).toUpperCase()}
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 text-sm">
                        <div className="flex items-center space-x-1">
                          <Building className="h-4 w-4" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(job.published).toLocaleDateString('en-US')}</span>
                        </div>
                        {job.positions && (
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{job.positions} positions</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {job.deadline && (
                    <div className="flex items-center space-x-1 text-sm text-amber-600 dark:text-amber-400">
                      <Clock className="h-4 w-4" />
                      <span>Deadline: {new Date(job.deadline).toLocaleDateString('en-US')}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-end space-y-2 ml-6">
                  {job.employment_type && (
                    <Badge variant="outline" className="border-gray-300 dark:border-gray-600 whitespace-nowrap">
                      {job.employment_type}
                    </Badge>
                  )}
                  {job.salary && (
                    <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {job.salary}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                {job.description}
              </p>
              
              {job.tags && job.tags.length > 0 && (
                <div className="flex items-center space-x-2 mb-4">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <div className="flex flex-wrap gap-1">
                    {job.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Published: {new Date(job.published).toLocaleDateString('en-US')}
                </div>
                <Button 
                  asChild
                  className="bg-gray-800 hover:bg-gray-900 text-white dark:bg-gray-200 dark:hover:bg-gray-100 dark:text-black"
                >
                  <a href={job.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Job
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
