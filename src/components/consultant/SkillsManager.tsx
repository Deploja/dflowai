
import { useState } from "react";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { UseFormSetValue, UseFormWatch, FieldErrors } from "react-hook-form";

interface SkillsManagerProps {
  skills: string[];
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  errors: FieldErrors<any>;
}

export function SkillsManager({ skills, setValue, watch, errors }: SkillsManagerProps) {
  const [currentSkill, setCurrentSkill] = useState("");
  const watchedSkills = watch("skills");

  const addSkill = () => {
    if (currentSkill && !watchedSkills.includes(currentSkill)) {
      setValue("skills", [...watchedSkills, currentSkill]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setValue("skills", watchedSkills.filter((skill: string) => skill !== skillToRemove));
  };

  // Get the error message safely
  const getErrorMessage = () => {
    const skillsError = errors.skills;
    if (skillsError && typeof skillsError === 'object' && 'message' in skillsError) {
      return skillsError.message;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <FormLabel>Skills</FormLabel>
      <div className="flex gap-2">
        <Input
          value={currentSkill}
          onChange={(e) => setCurrentSkill(e.target.value)}
          placeholder="Add skill"
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
        />
        <Button type="button" onClick={addSkill}>
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {watchedSkills.map((skill: string, index: number) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {skill}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => removeSkill(skill)}
            />
          </Badge>
        ))}
      </div>
      {getErrorMessage() && (
        <p className="text-sm font-medium text-destructive">
          {String(getErrorMessage())}
        </p>
      )}
    </div>
  );
}
