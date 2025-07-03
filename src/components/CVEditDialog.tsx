
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2, Save, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CV {
  id: string;
  title: string;
  language: string;
  is_shared: boolean;
}

interface CVEditDialogProps {
  cv: CV;
  onSuccess?: () => void;
  children: React.ReactNode;
}

export function CVEditDialog({ cv, onSuccess, children }: CVEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(cv.title);
  const [language, setLanguage] = useState(cv.language);
  const [isShared, setIsShared] = useState(cv.is_shared);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your CV.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from('cvs')
        .update({
          title: title.trim(),
          language,
          is_shared: isShared
        })
        .eq('id', cv.id);

      if (error) throw error;

      toast({
        title: "CV updated",
        description: "Your CV has been updated successfully.",
      });

      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error updating CV:', error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update CV.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="h-5 w-5" />
            Edit CV
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">CV Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={saving}
              placeholder="Enter CV title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-language">Language</Label>
            <select
              id="edit-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={saving}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="english">English</option>
              <option value="swedish">Swedish</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="edit-shared"
              checked={isShared}
              onChange={(e) => setIsShared(e.target.checked)}
              disabled={saving}
              className="h-4 w-4"
            />
            <Label htmlFor="edit-shared">Share publicly</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={!title.trim() || saving}
              className="flex-1"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
