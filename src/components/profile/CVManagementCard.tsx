import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Eye,
  Download,
  Edit2,
  Trash2,
  Upload,
  FileText,
  Globe,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CVPreview } from "@/components/CVPreview";
import { CVUpload } from "@/components/CVUpload";
import { CVEditDialog } from "@/components/CVEditDialog";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/components/AuthProvider";

interface CV {
  id: string;
  title: string;
  language: string;
  is_shared: boolean;
  is_parsed: boolean;
  created_at: string;
  updated_at: string;
  file_url: string | null;
  user_id: string;
}

interface CVManagementCardProps {
  userId: string;
  isOwnProfile: boolean;
}

export function CVManagementCard({
  userId,
  isOwnProfile,
}: CVManagementCardProps) {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Store CVs in localStorage for demo mode
  const DEMO_CVS_KEY = `demo_cvs_${userId}`;

  useEffect(() => {
    loadCVs();
  }, [userId]);

  const loadCVs = async () => {
    try {
      setLoading(true);
      console.log(
        "Loading CVs for user:",
        userId,
        "isOwnProfile:",
        isOwnProfile
      );

      const effectiveUserId = user?.id || userId;
      console.log("Using effective user ID:", effectiveUserId);

      // Try to load from Supabase first
      let supabaseData: CV[] = [];
      try {
        let query = supabase.from("cvs").select("*");

        if (isOwnProfile) {
          query = query.eq("user_id", effectiveUserId);
        } else {
          query = query.eq("user_id", userId).eq("is_shared", true);
        }

        query = query.order("created_at", { ascending: false });

        const { data, error } = await query;

        if (!error && data) {
          supabaseData = data;
          console.log("Loaded CVs from Supabase:", supabaseData);
        }
      } catch (error) {
        console.log("Supabase query failed, using demo mode");
      }

      // Load from localStorage for demo mode
      let demoData: CV[] = [];
      if (isOwnProfile) {
        try {
          const stored = localStorage.getItem(DEMO_CVS_KEY);
          if (stored) {
            demoData = JSON.parse(stored);
            console.log("Loaded CVs from localStorage:", demoData);
          }
        } catch (error) {
          console.error("Error loading from localStorage:", error);
        }
      }

      // Combine and deduplicate data
      const allCvs = [...supabaseData, ...demoData];
      const uniqueCvs = allCvs.filter(
        (cv, index, self) => self.findIndex((c) => c.id === cv.id) === index
      );

      setCvs(uniqueCvs);
      console.log("Final CVs list:", uniqueCvs);
    } catch (error) {
      console.error("Error loading CVs:", error);
      toast({
        title: "Demo Mode",
        description:
          "CV functionality is available in demo mode. Upload a CV to get started!",
      });
      setCvs([]);
    } finally {
      setLoading(false);
    }
  };

  const saveCVsToDemo = (updatedCvs: CV[]) => {
    try {
      localStorage.setItem(DEMO_CVS_KEY, JSON.stringify(updatedCvs));
      console.log("Saved CVs to localStorage:", updatedCvs);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const downloadCV = async (cv: CV) => {
    if (!cv.file_url) {
      toast({
        title: "No file available",
        description: "This CV doesn't have a downloadable file.",
        variant: "destructive",
      });
      return;
    }

    try {
      // For blob URLs (demo mode), directly download
      if (cv.file_url.startsWith("blob:")) {
        const a = document.createElement("a");
        a.href = cv.file_url;
        a.download = `${cv.title}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        toast({
          title: "Download started",
          description: "Your CV is being downloaded.",
        });
        return;
      }

      // For Supabase URLs
      const urlParts = cv.file_url.split("/storage/v1/object/public/cvs/");
      if (urlParts.length !== 2) {
        throw new Error("Invalid file URL format");
      }

      const filePath = urlParts[1];
      const { data, error } = await supabase.storage
        .from("cvs")
        .download(filePath);

      if (error) throw error;
      if (!data) throw new Error("No file data received");

      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${cv.title}.pdf`;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download started",
        description: "Your CV is being downloaded.",
      });
    } catch (error) {
      console.error("Error downloading CV:", error);
      toast({
        title: "Download failed",
        description: "Failed to download CV file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteCV = async (cvId: string) => {
    if (!confirm("Are you sure you want to delete this CV?")) return;

    try {
      // Try to delete from Supabase
      const { error } = await supabase.from("cvs").delete().eq("id", cvId);

      if (error && error.code !== "23503") {
        console.warn("Supabase delete failed:", error);
      }
    } catch (error) {
      console.warn("Supabase delete failed:", error);
    }

    // Always remove from local state and localStorage
    const updatedCvs = cvs.filter((cv) => cv.id !== cvId);
    setCvs(updatedCvs);
    saveCVsToDemo(updatedCvs);

    toast({
      title: "CV deleted",
      description: "Your CV has been deleted successfully.",
    });
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleUploadSuccess = () => {
    setShowUpload(false);
    loadCVs();
  };

  const handleEditSuccess = () => {
    loadCVs();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">CV Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading CVs...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">CV Management</CardTitle>
          {isOwnProfile && (
            <Dialog open={showUpload} onOpenChange={setShowUpload}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Upload className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <CVUpload onSuccess={handleUploadSuccess} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {cvs.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Edited</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cvs.map((cv, index) => (
                  <TableRow
                    key={cv.id}
                    className={index % 2 === 0 ? "bg-inherit" : "bg-gray-50"}
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-xl">
                          {getLanguageFlag(cv.language)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-400">
                            {cv.title}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            {cv.is_shared && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                              >
                                <Globe className="h-3 w-3 mr-1" />
                                Shared
                              </Badge>
                            )}
                            {cv.is_parsed && (
                              <Badge variant="secondary" className="text-xs">
                                Parsed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="text-sm text-gray-400">
                        {formatDate(cv.updated_at)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <Avatar className="h-4 w-4 mr-1">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=User`}
                            alt="User"
                          />
                          <AvatarFallback className="text-xs bg-gray-100 text-gray-400">
                            U
                          </AvatarFallback>
                        </Avatar>
                        By You
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="text-sm text-gray-400">
                        {formatDate(cv.created_at)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <Avatar className="h-4 w-4 mr-1">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=User`}
                            alt="User"
                          />
                          <AvatarFallback className="text-xs bg-gray-100 text-gray-900">
                            U
                          </AvatarFallback>
                        </Avatar>
                        By You
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex space-x-2">
                        <CVPreview cvId={cv.id}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </CVPreview>
                        {cv.file_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadCV(cv)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        {isOwnProfile && (
                          <>
                            <CVEditDialog cv={cv} onSuccess={handleEditSuccess}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </CVEditDialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCV(cv.id)}
                              className="text-destructive hover:text-destructive hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isOwnProfile ? "No CVs uploaded yet" : "No CVs available"}
            </p>
            {isOwnProfile && (
              <Dialog open={showUpload} onOpenChange={setShowUpload}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Upload className="h-4 w-4 mr-1" />
                    Upload Your First CV
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <CVUpload onSuccess={handleUploadSuccess} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
