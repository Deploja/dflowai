import { Job } from "@/types/job";

interface JobTechJob {
  id: string;
  headline: string;
  employer: {
    name: string;
  };
  workplace_address: {
    municipality: string;
    region: string;
  };
  description: {
    text: string;
  };
  application_details: {
    url?: string;
  };
  publication_date: string;
  salary_type?: {
    label: string;
  };
  employment_type?: {
    label: string;
  };
  occupation?: {
    label: string;
  };
  occupation_group?: {
    label: string;
  };
}

interface JobTechResponse {
  hits: JobTechJob[];
  total: {
    value: number;
  };
}

interface SearchParams {
  searchTerm?: string;
  location?: string;
  occupation?: string;
  source?: 'arbetsformedlingen' | 'brainwille' | 'cinode';
}

// Updated API endpoints for real services
const JOBTECH_API_BASE = "https://jobsearch.api.jobtechdev.se/search";
const BRAINVILLE_API_BASE = "https://www.brainville.com/api/jobs";
const CINODE_API_BASE = "https://api.cinode.com/v0.1/companies/jobs";

// IT-related keywords for filtering
const IT_KEYWORDS = [
  'developer', 'programmer', 'software', 'IT', 'teknisk', 'systemutvecklare',
  'webbutvecklare', 'fullstack', 'frontend', 'backend', 'devops', 
  'systemadministratör', 'databas', 'cloud', 'java', 'javascript', 'python',
  'react', 'angular', 'vue', 'node', '.net', 'c#', 'php', 'ruby',
  'ios', 'android', 'mobile', 'app', 'webb', 'cyber', 'security',
  'ai', 'machine learning', 'data', 'analyst', 'scrum', 'agile'
];

const IT_OCCUPATION_GROUPS = [
  'Data- och systemvetare',
  'Mjukvaru- och systemutvecklare',
  'Webbdesigner och webbutvecklare',
  'Systemanalytiker',
  'Systemadministratörer',
  'Nätverks- och systemtekniker',
  'Databas- och nätverksspecialister'
];

const isITRelated = (job: any): boolean => {
  const searchText = `${job.headline || job.title || ''} ${job.description?.text || job.description || ''} ${job.occupation?.label || ''} ${job.occupation_group?.label || ''}`.toLowerCase();
  
  return IT_KEYWORDS.some(keyword => searchText.includes(keyword.toLowerCase())) ||
         IT_OCCUPATION_GROUPS.some(group => searchText.includes(group.toLowerCase()));
};

const searchArbetsformedlingen = async (params: SearchParams): Promise<Job[]> => {
  try {
    // Use the exact URL format provided
    let searchQuery = 'utvecklare*';
    if (params.searchTerm) {
      searchQuery = `${params.searchTerm}*`;
    }
    
    const url = `${JOBTECH_API_BASE}?q=${encodeURIComponent(searchQuery)}&limit=50`;
    console.log('Arbetsförmedlingen API URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'JobSearchApp/1.0'
      }
    });
    
    if (!response.ok) {
      console.error(`Arbetsförmedlingen API error: ${response.status} ${response.statusText}`);
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: JobTechResponse = await response.json();
    console.log('Arbetsförmedlingen raw response:', data);
    
    const jobs: Job[] = data.hits
      ?.filter(isITRelated)
      ?.map((job: JobTechJob) => ({
        id: job.id,
        title: job.headline || 'Okänd titel',
        company: job.employer?.name || 'Okänt företag',
        location: `${job.workplace_address?.municipality || ''}, ${job.workplace_address?.region || ''}`.replace(/^, |, $/, '') || 'Okänd plats',
        description: job.description?.text?.substring(0, 300) + '...' || 'Ingen beskrivning tillgänglig',
        url: job.application_details?.url || `https://arbetsformedlingen.se/platsbanken/annonser/${job.id}`,
        published: job.publication_date || new Date().toISOString(),
        salary: job.salary_type?.label,
        employment_type: job.employment_type?.label,
        source: 'arbetsformedlingen' as const,
        tags: job.occupation?.label ? [job.occupation.label] : []
      })) || [];
    
    console.log(`Arbetsförmedlingen: Found ${jobs.length} IT jobs`);
    return jobs;
    
  } catch (error) {
    console.error('Error searching Arbetsförmedlingen:', error);
    throw error;
  }
};

const searchBrainville = async (params: SearchParams): Promise<Job[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add search parameters
    if (params.searchTerm) {
      queryParams.append('q', params.searchTerm);
    } else {
      queryParams.append('q', 'developer');
    }
    
    if (params.location) {
      queryParams.append('location', params.location);
    }
    
    queryParams.append('category', 'tech');
    queryParams.append('limit', '20');
    
    const url = `${BRAINVILLE_API_BASE}?${queryParams.toString()}`;
    console.log('Brainville API URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'JobSearchApp/1.0'
      }
    });
    
    if (!response.ok) {
      console.error(`Brainville API error: ${response.status} ${response.statusText}`);
      throw new Error(`Brainville API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Brainville raw response:', data);
    
    // Transform Brainville data to our Job interface
    const jobs: Job[] = data.jobs?.map((job: any) => ({
      id: `brainville-${job.id}`,
      title: job.title || job.name,
      company: job.company?.name || job.companyName,
      location: job.location?.city || job.location,
      description: job.description?.substring(0, 300) + '...',
      url: job.applicationUrl || job.url,
      published: job.publishedAt || job.createdAt,
      salary: job.salary,
      employment_type: job.employmentType,
      source: 'brainwille' as const,
      positions: job.positions,
      deadline: job.deadline,
      tags: job.skills || job.tags || []
    })) || [];
    
    console.log(`Brainville: Found ${jobs.length} jobs`);
    return jobs;
    
  } catch (error) {
    console.error('Error searching Brainville:', error);
    throw error;
  }
};

const searchCinode = async (params: SearchParams): Promise<Job[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add search parameters for Cinode
    if (params.searchTerm) {
      queryParams.append('search', params.searchTerm);
    } else {
      queryParams.append('search', 'developer');
    }
    
    if (params.location) {
      queryParams.append('location', params.location);
    }
    
    queryParams.append('skills', 'javascript,react,python,java');
    queryParams.append('limit', '20');
    
    const url = `${CINODE_API_BASE}?${queryParams.toString()}`;
    console.log('Cinode API URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'JobSearchApp/1.0',
        'Authorization': 'Bearer your-cinode-api-key' // You'll need to get this from Cinode
      }
    });
    
    if (!response.ok) {
      console.error(`Cinode API error: ${response.status} ${response.statusText}`);
      throw new Error(`Cinode API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Cinode raw response:', data);
    
    // Transform Cinode data to our Job interface
    const jobs: Job[] = data.result?.map((job: any) => ({
      id: `cinode-${job.id}`,
      title: job.title,
      company: job.company?.name,
      location: `${job.location?.city}, ${job.location?.country}`,
      description: job.description?.substring(0, 300) + '...',
      url: job.applicationUrl,
      published: job.publishedDate,
      salary: job.salaryRange,
      employment_type: job.assignmentType,
      source: 'cinode' as const,
      tags: job.skills?.map((skill: any) => skill.name) || []
    })) || [];
    
    console.log(`Cinode: Found ${jobs.length} jobs`);
    return jobs;
    
  } catch (error) {
    console.error('Error searching Cinode:', error);
    throw error;
  }
};

export const searchJobs = async (params: SearchParams): Promise<Job[]> => {
  console.log('Starting job search with params:', params);
  
  const results = await Promise.allSettled([
    // Search specific source or all sources
    !params.source || params.source === 'arbetsformedlingen' ? searchArbetsformedlingen(params) : Promise.resolve([]),
    !params.source || params.source === 'brainwille' ? searchBrainville(params) : Promise.resolve([]),
    !params.source || params.source === 'cinode' ? searchCinode(params) : Promise.resolve([])
  ]);
  
  let allJobs: Job[] = [];
  
  // Process results and handle failures gracefully
  results.forEach((result, index) => {
    const sourceName = ['Arbetsförmedlingen', 'Brainville', 'Cinode'][index];
    
    if (result.status === 'fulfilled') {
      allJobs = [...allJobs, ...result.value];
      console.log(`${sourceName}: Successfully fetched ${result.value.length} jobs`);
    } else {
      console.error(`${sourceName}: Failed to fetch jobs:`, result.reason);
      
      // Add fallback mock data for failed sources to show the UI still works
      if (index === 1) { // Brainville fallback
        allJobs.push({
          id: "fallback-brainville-1",
          title: "Senior React Developer (API Error - Demo)",
          company: "Demo Company",
          location: "Stockholm",
          description: "This is fallback data shown because the Brainville API is not accessible. In production, you would see real job listings here.",
          url: "https://brainville.com",
          published: new Date().toISOString(),
          salary: "Demo salary",
          employment_type: "Tillsvidareanställning",
          source: 'brainwille' as const,
          tags: ["React", "Demo"]
        });
      }
      
      if (index === 2) { // Cinode fallback
        allJobs.push({
          id: "fallback-cinode-1",
          title: "DevOps Engineer (API Error - Demo)",
          company: "Demo Consulting",
          location: "Göteborg",
          description: "This is fallback data shown because the Cinode API is not accessible. In production, you would see real job listings here.",
          url: "https://cinode.com",
          published: new Date().toISOString(),
          salary: "Demo rate",
          employment_type: "Konsultuppdrag",
          source: 'cinode' as const,
          tags: ["DevOps", "Demo"]
        });
      }
    }
  });
  
  // Sort by published date (newest first)
  allJobs.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
  
  console.log(`Total jobs found: ${allJobs.length}`);
  return allJobs;
};
