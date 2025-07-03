
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Mail, Download, Copy, Check, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CV {
  id: string;
  title: string;
  share_token: string;
  is_shared: boolean;
}

interface CVShareDialogProps {
  cv: CV;
  children: React.ReactNode;
}

export function CVShareDialog({ cv, children }: CVShareDialogProps) {
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const shareUrl = `${window.location.origin}/cv/${cv.share_token}`;

  const handleShareByEmail = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create a share record
      const { error } = await supabase
        .from("cv_shares")
        .insert({
          cv_id: cv.id,
          share_method: "email",
          shared_with_email: email,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        });

      if (error) throw error;

      // Enable sharing if not already enabled
      if (!cv.is_shared) {
        await supabase
          .from("cvs")
          .update({ is_shared: true })
          .eq("id", cv.id);
      }

      toast({
        title: "Shared successfully",
        description: `CV shared with ${email}`,
      });
      setEmail("");
    } catch (error) {
      console.error("Error sharing CV:", error);
      toast({
        title: "Error",
        description: "Failed to share CV",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      // Enable sharing if not already enabled
      if (!cv.is_shared) {
        await supabase
          .from("cvs")
          .update({ is_shared: true })
          .eq("id", cv.id);
      }

      toast({
        title: "Link copied",
        description: "Share link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      // Create a share record
      const { error } = await supabase
        .from("cv_shares")
        .insert({
          cv_id: cv.id,
          share_method: "download",
          created_by: (await supabase.auth.getUser()).data.user?.id,
        });

      if (error) throw error;

      toast({
        title: "Download ready",
        description: "CV download link has been generated",
      });
    } catch (error) {
      console.error("Error creating download:", error);
      toast({
        title: "Error",
        description: "Failed to create download",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Share CV: {cv.title}</span>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="link" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="download">Download</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Share this CV with a public link</p>
              <div className="flex space-x-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button 
                  onClick={handleCopyLink}
                  variant="outline"
                  size="sm"
                  className="px-3"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              {cv.is_shared && (
                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                  <Globe className="h-3 w-3 mr-1" />
                  Currently shared
                </Badge>
              )}
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Send CV directly to someone's email</p>
              <div className="flex space-x-2">
                <Input 
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleShareByEmail}
                  disabled={isLoading}
                  size="sm"
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Send
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="download" className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Generate a downloadable version</p>
              <Button 
                onClick={handleDownload}
                disabled={isLoading}
                className="w-full"
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                {isLoading ? "Generating..." : "Generate Download"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
