
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BasicInfoFields } from "./consultant/BasicInfoFields";
import { RoleAvailabilityFields } from "./consultant/RoleAvailabilityFields";
import { SkillsManager } from "./consultant/SkillsManager";
import { CVSection } from "./consultant/CVSection";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  surname: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  experience_years: z.number().min(0, "Experience must be 0 or higher"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  availability: z.string().min(1, "Availability is required"),
  hourly_rate: z.number().min(0, "Hourly rate must be 0 or higher"),
  role: z.string().min(1, "Role is required"),
  cv_id: z.string().optional(),
});

interface EditConsultantFormProps {
  consultant: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditConsultantForm({ consultant, open, onOpenChange, onSuccess }: EditConsultantFormProps) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: consultant?.first_name || "",
      surname: consultant?.surname || "",
      email: consultant?.email || "",
      phone: consultant?.phone || "",
      title: consultant?.title || "",
      location: consultant?.location || "",
      experience_years: consultant?.experience_years || 0,
      skills: consultant?.skills || [],
      availability: consultant?.availability || "Available",
      hourly_rate: consultant?.hourly_rate || 0,
      role: consultant?.role || "consultant",
      cv_id: consultant?.cv_id || undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Updating consultant with ID:", consultant.id);
      console.log("Update values:", values);

      const { error } = await supabase
        .from("consultants")
        .update(values)
        .eq("id", consultant.id);

      if (error) {
        console.error("Error updating consultant:", error);
        throw error;
      }

      console.log("Consultant updated successfully");
      toast({
        title: "Success!",
        description: "Consultant has been updated successfully.",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error updating consultant:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the consultant.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit consultant</DialogTitle>
          <DialogDescription>
            Update the consultant's information below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BasicInfoFields control={form.control} />
            
            <RoleAvailabilityFields control={form.control} />

            <CVSection control={form.control} consultantId={consultant.id} />

            <SkillsManager 
              skills={form.watch("skills")}
              setValue={form.setValue}
              watch={form.watch}
              errors={form.formState.errors}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Update consultant
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
