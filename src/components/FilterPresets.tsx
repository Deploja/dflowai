
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Save, Filter, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface FilterPreset {
  id: string;
  name: string;
  filters: any;
  created_at: string;
}

interface FilterPresetsProps {
  currentFilters: any;
  onApplyPreset: (filters: any) => void;
}

export function FilterPresets({ currentFilters, onApplyPreset }: FilterPresetsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const { data: presets, refetch } = useQuery({
    queryKey: ["filter-presets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("filter_presets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as FilterPreset[];
    },
  });

  const savePreset = async () => {
    if (!presetName.trim()) return;

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("No authenticated user found");
        return;
      }

      const { error } = await supabase
        .from("filter_presets")
        .insert({
          name: presetName,
          filters: currentFilters,
          user_id: user.id,
        });

      if (error) throw error;

      setPresetName("");
      setIsOpen(false);
      refetch();
    } catch (error) {
      console.error("Error saving preset:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const deletePreset = async (id: string) => {
    try {
      const { error } = await supabase
        .from("filter_presets")
        .delete()
        .eq("id", id);

      if (error) throw error;
      refetch();
    } catch (error) {
      console.error("Error deleting preset:", error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Filter
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Save Filter Preset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Preset name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
            />
            <Button onClick={savePreset} disabled={isSaving || !presetName.trim()}>
              {isSaving ? "Saving..." : "Save Preset"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap gap-2">
        {presets?.map((preset) => (
          <div key={preset.id} className="flex items-center">
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => onApplyPreset(preset.filters)}
            >
              <Filter className="h-3 w-3 mr-1" />
              {preset.name}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 ml-1"
              onClick={() => deletePreset(preset.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
