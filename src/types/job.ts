
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  published: string;
  salary?: string;
  employment_type?: string;
  source: 'arbetsformedlingen' | 'brainwille' | 'cinode';
  positions?: number;
  deadline?: string;
  tags?: string[];
}
