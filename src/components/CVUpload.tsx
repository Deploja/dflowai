import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";

interface CVUploadProps {
  onSuccess?: () => void;
}

export function CVUpload({ onSuccess }: CVUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("english");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const extractTextFromPDF = async (file: File): Promise<string> => {
    // For now, we'll use a simple approach. In production, you'd want to use a proper PDF parser
    // This is a placeholder that would need a proper PDF parsing library
    return `PDF content extraction would happen here for file: ${file.name}`;
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type === "application/pdf") {
      return await extractTextFromPDF(file);
    } else if (file.type === "text/plain") {
      return await file.text();
    } else {
      throw new Error(
        "Unsupported file type. Please upload a PDF or TXT file."
      );
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSave = async () => {
    if (!selectedFile || !user) return;

    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your CV.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("cvs")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("cvs").getPublicUrl(fileName);

      // Create CV record
      const { data: cvData, error: cvError } = await supabase
        .from("cvs")
        .insert({
          user_id: user.id,
          title,
          language,
          file_url: publicUrl,
          is_parsed: false,
        })
        .select()
        .single();

      if (cvError) throw cvError;

      toast({
        title: "CV uploaded",
        description:
          "Your CV has been uploaded successfully. Starting parsing...",
      });

      // Extract text and parse CV
      setParsing(true);
      const cvText = await extractTextFromFile(selectedFile);

      // Call parsing edge function
      const { data: parseData, error: parseError } =
        await supabase.functions.invoke("parse-cv", {
          body: {
            cvText,
            cvId: cvData.id,
            userId: user.id,
          },
        });

      if (parseError) {
        console.error("Parsing error:", parseError);
        toast({
          title: "Parsing completed with warnings",
          description:
            "CV uploaded successfully, but parsing encountered some issues.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "CV processed successfully",
          description:
            "Your CV has been uploaded, parsed, and your profile has been updated.",
        });
      }

      setTitle("");
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById("cv-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      onSuccess?.();
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "Failed to upload CV.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setParsing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload CV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cv-title">CV Title</Label>
          <Input
            id="cv-title"
            placeholder="e.g., Senior Developer CV 2024"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={uploading || parsing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cv-language">Language</Label>
          <select
            id="cv-language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={uploading || parsing}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="english">English</option>
            <option value="swedish">Swedish</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cv-file">CV File (PDF or TXT)</Label>
          <Input
            id="cv-file"
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileSelect}
            disabled={uploading || parsing}
          />
          {selectedFile && (
            <p className="text-sm text-muted-foreground">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={!selectedFile || !title.trim() || uploading || parsing}
            className="flex-1"
          >
            <Save className="h-4 w-4 mr-2" />
            Save CV
          </Button>
        </div>

        {(uploading || parsing) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {uploading && "Uploading CV..."}
            {parsing && "Parsing CV and updating profile..."}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <FileText className="h-4 w-4 inline mr-1" />
          Supported formats: PDF, TXT. The CV will be automatically parsed to
          extract skills, contact information, and experience summary.
        </div>
      </CardContent>
    </Card>
  );
}
