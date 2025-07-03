
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Grid, List } from "lucide-react";

interface ViewModeToggleProps {
  viewMode: string;
  onViewModeChange: (value: string) => void;
}

export function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
  return (
    <div className="flex justify-end">
      <ToggleGroup type="single" value={viewMode} onValueChange={onViewModeChange}>
        <ToggleGroupItem value="cards" aria-label="Kortvy">
          <Grid className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="table" aria-label="Listvy">
          <List className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
