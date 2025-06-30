
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, FileText, User, Calendar, Globe, Download, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CVData {
  id: string;
  title: string;
  language: string;
  content: any;
  file_url?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_shared: boolean;
  is_parsed: boolean;
  parsed_data?: any;
}

interface CVPreviewProps {
  cvId: string;
  children: React.ReactNode;
}

export function CVPreview({ cvId, children }: CVPreviewProps) {
  const [cv, setCv] = useState<CVData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadCV = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("cvs")
        .select("*")
        .eq("id", cvId)
        .single();

      if (error) throw error;
      setCv(data);
    } catch (error) {
      console.error("Error loading CV:", error);
      toast({
        title: "Error",
        description: "Failed to load CV",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getLanguageFlag = (language: string) => {
    switch (language) {
      case "english":
        return "🇬🇧";
      case "swedish":
        return "🇸🇪";
      default:
        return "🌐";
    }
  };

  const downloadCV = async () => {
    if (!cv?.file_url) {
      toast({
        title: "No file available",
        description: "This CV doesn't have a downloadable file.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Extract the file path from the full URL
      const urlParts = cv.file_url.split('/storage/v1/object/public/cvs/');
      if (urlParts.length !== 2) {
        throw new Error('Invalid file URL format');
      }
      
      const filePath = urlParts[1];
      console.log('Downloading file from path:', filePath);

      // Use Supabase storage download method
      const { data, error } = await supabase.storage
        .from('cvs')
        .download(filePath);

      if (error) {
        console.error('Supabase download error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No file data received');
      }

      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${cv.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download started",
        description: "Your CV is being downloaded.",
      });
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast({
        title: "Download failed",
        description: "Failed to download CV file. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild onClick={loadCV}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>CV Preview</span>
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-pulse" />
              <p className="text-gray-600">Loading CV...</p>
            </div>
          </div>
        ) : cv ? (
          <div className="space-y-6">
            {/* CV Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">
                      {getLanguageFlag(cv.language)}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {cv.title}
                      </h1>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Created: {new Date(cv.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Updated: {new Date(cv.updated_at).toLocaleDateString()}
                        </div>
                        {cv.is_shared && (
                          <div className="flex items-center text-emerald-600">
                            <Globe className="h-3 w-3 mr-1" />
                            Shared
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {cv.file_url && (
                    <div className="flex space-x-2">
                      <Button 
                        onClick={downloadCV}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button 
                        onClick={() => window.open(cv.file_url, '_blank')}
                        variant="outline"
                        size="sm"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* CV Content */}
            <Card>
              <CardContent className="p-6">
                {cv.file_url ? (
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      File-based CV
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      This CV is stored as a file. Use the buttons above to download or view the document.
                    </p>
                    
                    {/* Show parsed data if available */}
                    {cv.is_parsed && cv.parsed_data && (
                      <div className="mt-8 text-left">
                        <h3 className="text-lg font-semibold mb-4">Extracted Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {cv.parsed_data.first_name && (
                            <div>
                              <label className="font-medium text-gray-700">First Name:</label>
                              <p className="text-gray-900">{cv.parsed_data.first_name}</p>
                            </div>
                          )}
                          {cv.parsed_data.surname && (
                            <div>
                              <label className="font-medium text-gray-700">Last Name:</label>
                              <p className="text-gray-900">{cv.parsed_data.surname}</p>
                            </div>
                          )}
                          {cv.parsed_data.email && (
                            <div>
                              <label className="font-medium text-gray-700">Email:</label>
                              <p className="text-gray-900">{cv.parsed_data.email}</p>
                            </div>
                          )}
                          {cv.parsed_data.title && (
                            <div>
                              <label className="font-medium text-gray-700">Title:</label>
                              <p className="text-gray-900">{cv.parsed_data.title}</p>
                            </div>
                          )}
                          {cv.parsed_data.location && (
                            <div>
                              <label className="font-medium text-gray-700">Location:</label>
                              <p className="text-gray-900">{cv.parsed_data.location}</p>
                            </div>
                          )}
                          {cv.parsed_data.skills && cv.parsed_data.skills.length > 0 && (
                            <div className="md:col-span-2">
                              <label className="font-medium text-gray-700">Skills:</label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {cv.parsed_data.skills.map((skill: string, index: number) => (
                                  <span 
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {cv.parsed_data.experience_summary && (
                            <div className="md:col-span-2">
                              <label className="font-medium text-gray-700">Experience Summary:</label>
                              <p className="text-gray-900 mt-1">{cv.parsed_data.experience_summary}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : cv.content ? (
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-4">CV Content</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">
                        {JSON.stringify(cv.content, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No content available
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      This CV doesn't have any content yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Failed to load CV</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
