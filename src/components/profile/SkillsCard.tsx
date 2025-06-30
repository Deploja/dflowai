
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit2, Check, X, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Skill {
  id: string;
  skill_name: string;
  skill_type: string;
  proficiency_level: string;
  years_experience: number;
}

interface SkillsCardProps {
  userId: string;
  isOwnProfile: boolean;
}

export function SkillsCard({ userId, isOwnProfile }: SkillsCardProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState({
    skill_name: "",
    skill_type: "programming",
    proficiency_level: "intermediate",
    years_experience: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSkills();
  }, [userId]);

  const loadSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', userId)
        .order('skill_type', { ascending: true });

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error loading skills:', error);
    }
  };

  const addSkill = async () => {
    if (!newSkill.skill_name.trim()) return;

    try {
      const { data, error } = await supabase
        .from('user_skills')
        .insert({
          user_id: userId,
          ...newSkill
        })
        .select()
        .single();

      if (error) throw error;

      setSkills(prev => [...prev, data]);
      setNewSkill({
        skill_name: "",
        skill_type: "programming",
        proficiency_level: "intermediate",
        years_experience: 0
      });
      toast({
        title: "Skill added",
        description: "Your skill has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: "Error",
        description: "Failed to add skill.",
        variant: "destructive",
      });
    }
  };

  const removeSkill = async (skillId: string) => {
    try {
      const { error } = await supabase
        .from('user_skills')
        .delete()
        .eq('id', skillId);

      if (error) throw error;

      setSkills(prev => prev.filter(skill => skill.id !== skillId));
      toast({
        title: "Skill removed",
        description: "Your skill has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing skill:', error);
      toast({
        title: "Error",
        description: "Failed to remove skill.",
        variant: "destructive",
      });
    }
  };

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-green-100 text-green-800 border-green-200';
      case 'advanced': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'beginner': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Programming Skills</CardTitle>
          {isOwnProfile && (
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? <Check className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <div key={skill.id} className="relative group">
                  <Badge
                    variant="outline"
                    className={`${getProficiencyColor(skill.proficiency_level)} text-xs`}
                  >
                    {skill.skill_name}
                    {skill.years_experience > 0 && ` (${skill.years_experience}y)`}
                  </Badge>
                  {isEditing && isOwnProfile && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeSkill(skill.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {isOwnProfile ? "No skills added yet" : "No skills listed"}
            </p>
          )}

          {isEditing && isOwnProfile && (
            <div className="pt-3 border-t space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={newSkill.skill_name}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, skill_name: e.target.value }))}
                  placeholder="Skill name"
                />
                <Select
                  value={newSkill.skill_type}
                  onValueChange={(value) => setNewSkill(prev => ({ ...prev, skill_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="framework">Framework</SelectItem>
                    <SelectItem value="tool">Tool</SelectItem>
                    <SelectItem value="language">Language</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={newSkill.proficiency_level}
                  onValueChange={(value) => setNewSkill(prev => ({ ...prev, proficiency_level: value }))}
                >
                  <SelectTrigger>
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
                  onChange={(e) => setNewSkill(prev => ({ ...prev, years_experience: parseInt(e.target.value) || 0 }))}
                  placeholder="Years"
                  min="0"
                />
              </div>
              <Button onClick={addSkill} size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
