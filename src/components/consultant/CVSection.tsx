
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CVSelector } from "@/components/CVSelector";
import { Control } from "react-hook-form";

interface CVSectionProps {
  control: Control<any>;
  consultantId: string;
}

export function CVSection({ control, consultantId }: CVSectionProps) {
  return (
    <FormField
      control={control}
      name="cv_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>CV</FormLabel>
          <FormControl>
            <CVSelector
              consultantId={consultantId}
              selectedCVId={field.value}
              onCVChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
