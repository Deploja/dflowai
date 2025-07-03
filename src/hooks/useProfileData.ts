
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";

interface ConsultantProfile {
  id: string;
  first_name: string;
  surname: string;
  email: string;
  phone?: string;
  location?: string;
  title?: string;
  skills: string[];
  experience_years: number;
  hourly_rate: number;
  availability: string;
  status: string;
  created_at: string;
}

interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  title?: string;
  avatar_url?: string;
}

interface ActivityStatus {
  status: string;
  last_seen: string;
}

interface Skill {
  id: string;
  skill_name: string;
  skill_type: string;
  proficiency_level: string;
  years_experience: number;
}

export function useProfileData() {
  const { consultantId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [consultant, setConsultant] = useState<ConsultantProfile | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activityStatus, setActivityStatus] = useState<ActivityStatus>({ status: 'offline', last_seen: '' });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [tempStatus, setTempStatus] = useState('offline');
  const [newSkill, setNewSkill] = useState({
    skill_name: "",
    skill_type: "programming",
    proficiency_level: "intermediate",
    years_experience: 0
  });

  useEffect(() => {
    loadProfile();
  }, [consultantId, user]);

  const loadProfile = async () => {
    if (!consultantId) return;

    try {
      setLoading(true);

      // First try to load as consultant profile
      const { data: consultantData, error: consultantError } = await supabase
        .from('consultants')
        .select('*')
        .eq('id', consultantId)
        .maybeSingle();

      if (consultantData) {
        setConsultant(consultantData);

        // Check if this is the user's own consultant profile
        if (user && consultantData.email === user.email) {
          setIsOwnProfile(true);

          // Load user profile data for additional info
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (profileData) {
            setUserProfile(profileData);
          }

          // Load activity status, skills for own profile
          await loadActivityStatus();
          await loadSkills();
        }
      } else {
        // If not found as consultant, try to load as user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', consultantId)
          .maybeSingle();

        if (profileData) {
          setUserProfile(profileData);
          setIsOwnProfile(user?.id === consultantId);

          if (user?.id === consultantId) {
            await loadActivityStatus();
            await loadSkills();
          }
        } else {
          toast({
            title: "Profile not found",
            description: "The requested profile could not be found.",
            variant: "destructive",
          });
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Could not load profile information.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadActivityStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_status')
        .select('*')
        .eq('user_id', consultantId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setActivityStatus({ status: data.status, last_seen: data.last_seen });
        setTempStatus(data.status);
      } else if (isOwnProfile) {
        await createInitialStatus();
      }
    } catch (error) {
      console.error('Error loading activity status:', error);
    }
  };

  const createInitialStatus = async () => {
    try {
      const { error } = await supabase
        .from('activity_status')
        .insert({
          user_id: consultantId,
          status: 'online',
          last_seen: new Date().toISOString()
        });

      if (error) throw error;
      setActivityStatus({ status: 'online', last_seen: new Date().toISOString() });
    } catch (error) {
      console.error('Error creating initial status:', error);
    }
  };

  const updateStatus = async () => {
    try {
      const { error } = await supabase
        .from('activity_status')
        .upsert({
          user_id: consultantId,
          status: tempStatus,
          last_seen: new Date().toISOString()
        });

      if (error) throw error;

      setActivityStatus({ status: tempStatus, last_seen: new Date().toISOString() });
      setIsEditingStatus(false);
      toast({
        title: "Status updated",
        description: "Your activity status has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update activity status.",
        variant: "destructive",
      });
    }
  };

  const loadSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', consultantId)
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
          user_id: consultantId,
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

  return {
    consultant,
    userProfile,
    activityStatus,
    skills,
    loading,
    isOwnProfile,
    isEditingStatus,
    isEditingSkills,
    tempStatus,
    newSkill,
    setIsEditingStatus,
    setIsEditingSkills,
    setTempStatus,
    setNewSkill,
    updateStatus,
    addSkill,
    removeSkill,
    navigate
  };
}
