
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  getProficiencyColor
}: ProfessionalDetailsProps) {
  return (
    <div className="flex-1">
      {/* Professional Info */}
      {consultant && (
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Latest Experience</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">MS</span>
                </div>
                <div>
                  <p className="font-medium">{consultant.title || 'Software Engineer'}</p>
                  <p className="text-sm text-muted-foreground">Microsoft Corporation</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Education</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">UC</span>
                </div>
                <div>
                  <p className="font-medium">Computer Science</p>
                  <p className="text-sm text-muted-foreground">University College</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Career Preferences */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Career Preferences</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Position Preferences</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {['AR-GE Engineering', 'Product Development', 'Testing', 'Quality Control', 'Design'].map((pref, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {pref}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Skills</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {skills.length > 0 ? skills.map((skill) => (
                <div key={skill.id} className="relative group">
                  <Badge
                    variant="outline"
                    className={`${getProficiencyColor(skill.proficiency_level)} text-xs`}
                  >
                    {skill.skill_name}
                    {skill.years_experience > 0 && ` (${skill.years_experience}y)`}
                  </Badge>
                  {isEditingSkills && isOwnProfile && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onRemoveSkill(skill.id)}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  )}
                </div>
              )) : (
                ['AutoCAD', 'Project Planning', 'Microsoft Office', 'SAP'].map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))
              )}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Other Preferences</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm">Turkey, Europe, USA, Canada +12</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-medium">€4550</span>
              <span className="text-xs text-muted-foreground">/month</span>
            </div>
          </div>
        </div>

        {/* Skills Management for Own Profile */}
        {isOwnProfile && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Manage Skills</h4>
              <Button variant="ghost" size="sm" onClick={onEditSkills}>
                {isEditingSkills ? <Check className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              </Button>
            </div>

            {isEditingSkills && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newSkill.skill_name}
                    onChange={(e) => onNewSkillChange('skill_name', e.target.value)}
                    placeholder="Skill name"
                    className="flex-1 h-8"
                  />
                  <Select
                    value={newSkill.proficiency_level}
                    onValueChange={(value) => onNewSkillChange('proficiency_level', value)}
                  >
                    <SelectTrigger className="w-28 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={newSkill.years_experience}
                    onChange={(e) => onNewSkillChange('years_experience', parseInt(e.target.value) || 0)}
                    placeholder="Years"
                    min="0"
                    className="w-16 h-8"
                  />
                  <Button onClick={onAddSkill} size="sm" className="h-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
