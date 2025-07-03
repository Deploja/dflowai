import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Edit2, Check, X, Plus } from "lucide-react";

interface Skill {
  id: string;
  skill_name: string;
  skill_type: string;
  proficiency_level: string;
  years_experience: number;
}

interface ConsultantProfile {
  title?: string;
}

interface ProfessionalDetailsProps {
  consultant: ConsultantProfile | null;
  skills: Skill[];
  isEditingSkills: boolean;
  isOwnProfile: boolean;
  newSkill: {
    skill_name: string;
    skill_type: string;
    proficiency_level: string;
    years_experience: number;
  };
  onEditSkills: () => void;
  onAddSkill: () => void;
  onRemoveSkill: (skillId: string) => void;
  onNewSkillChange: (field: string, value: string | number) => void;
  getProficiencyColor: (level: string) => string;
}

export function ProfessionalDetails({
  consultant,
  skills,
  isEditingSkills,
  isOwnProfile,
  newSkill,
  onEditSkills,
  onAddSkill,
  onRemoveSkill,
  onNewSkillChange,
  getProficiencyColor,
}: ProfessionalDetailsProps) {
  return (
    <div className="flex-1">
      {/* Professional Info */}
      {consultant && (
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold  mb-3">Latest Experience</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 shadow-md rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">MS</span>
                </div>
                <div>
                  <p className="font-medium">
                    {consultant.title || "Software Engineer"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Microsoft Corporation
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold  mb-3">Education</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 shadow-md rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">UC</span>
                </div>
                <div>
                  <p className="font-medium">Computer Science</p>
                  <p className="text-sm text-muted-foreground">
                    University College
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Career Preferences */}
      <div className="mb-6 mt-10">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Recent Positions</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {[
                "Full-Stack Developer",
                "Web Developer",
                "Software Developer",
                "Cloud Developer",
                "DevOps",
                "UI/UX Design",
              ].map((pref, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {pref}
                </Badge>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground">Skills</p>
              {isOwnProfile && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 pl-5"
                      onClick={onEditSkills}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Skills</DialogTitle>
                      <DialogDescription>
                        Add or remove your professional skills below.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                      {/* Current Skills */}
                      {skills.length > 0 ? (
                        skills.map((skill) => (
                          <div
                            key={skill.id}
                            className="flex items-center justify-between"
                          >
                            <Badge
                              variant="outline"
                              className={`${getProficiencyColor(
                                skill.proficiency_level
                              )} text-xs`}
                            >
                              {skill.skill_name}
                              {skill.years_experience > 0 &&
                                ` (${skill.years_experience}y)`}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onRemoveSkill(skill.id)}
                              className="h-5 w-5"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No skills added yet.
                        </p>
                      )}

                      {/* Add Skill Inputs */}
                      <div className="flex gap-2">
                        <Input
                          value={newSkill.skill_name}
                          onChange={(e) =>
                            onNewSkillChange("skill_name", e.target.value)
                          }
                          placeholder="Skill name"
                          className="flex-1 h-8"
                        />
                        <Select
                          value={newSkill.proficiency_level}
                          onValueChange={(value) =>
                            onNewSkillChange("proficiency_level", value)
                          }
                        >
                          <SelectTrigger className="w-28 h-8">
                            <SelectValue placeholder="Level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          value={newSkill.years_experience}
                          onChange={(e) =>
                            onNewSkillChange(
                              "years_experience",
                              parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="Years"
                          min="0"
                          className="w-16 h-8"
                        />
                        <Button onClick={onAddSkill} size="sm" className="h-8">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="flex flex-wrap gap-1 mt-1">
              {skills.length > 0
                ? skills.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant="outline"
                      className={`${getProficiencyColor(
                        skill.proficiency_level
                      )} text-xs`}
                    >
                      {skill.skill_name}
                      {skill.years_experience > 0 &&
                        ` (${skill.years_experience}y)`}
                    </Badge>
                  ))
                : [
                    "Javascript",
                    "Typescript",
                    "React",
                    "Node.js",
                    "Next.js",
                    "Tailwind",
                    "HTML",
                    "CSS",
                    "PostgreSQL",
                    "Prisma",
                    "RESTful API",
                    "GitHub",
                    "Git",
                    "AI",
                  ].map((skill, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs bg-secondary"
                    >
                      {skill}
                    </Badge>
                  ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Employer</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm">Deploja AB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
