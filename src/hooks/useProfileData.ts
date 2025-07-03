
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
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [tempStatus, setTempStatus] = useState('offline');
  const [newSkill, setNewSkill] = useState({
    skill_name: "",
    skill_type: "programming",
    proficiency_level: "intermediate",
    years_experience: 0
  });

  // Use mock data when no authentication
  const mockUserId = "00000000-0000-0000-0000-000000000001";
  const effectiveUserId = user?.id || mockUserId;
  const effectiveConsultantId = consultantId || effectiveUserId;

  useEffect(() => {
    loadProfile();
  }, [consultantId, user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setIsOwnProfile(true);
      
      // Ensure user exists in users table
      await ensureUserExists();
      
      // Try to load consultant profile if consultantId is provided
      if (consultantId) {
        const { data: consultantData, error: consultantError } = await supabase
          .from('consultants')
          .select('*')
          .eq('id', consultantId)
          .maybeSingle();

        if (consultantData) {
          setConsultant(consultantData);
        }
      }

      // Load user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', effectiveUserId)
        .maybeSingle();

      if (profileData) {
        setUserProfile(profileData);
      }

      await loadActivityStatus();
      await loadSkills();
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

  const ensureUserExists = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: effectiveUserId,
          email: user?.email || 'demo@example.com',
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error ensuring user exists:', error);
      }
    } catch (error) {
      console.error('Error ensuring user exists:', error);
    }
  };

  const loadActivityStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_status')
        .select('*')
        .eq('user_id', effectiveUserId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading activity status:', error);
        return;
      }

      if (data) {
        setActivityStatus({ status: data.status, last_seen: data.last_seen || '' });
        setTempStatus(data.status);
      } else {
        // Create initial status
        await createInitialStatus();
      }
    } catch (error) {
      console.error('Error loading activity status:', error);
    }
  };

  const createInitialStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_status')
        .insert({
          user_id: effectiveUserId,
          status: 'online',
          last_seen: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating initial status:', error);
        // Set default values for demo mode
        setActivityStatus({ status: 'online', last_seen: new Date().toISOString() });
        setTempStatus('online');
        return;
      }
      
      setActivityStatus({ status: data.status, last_seen: data.last_seen || '' });
      setTempStatus(data.status);
    } catch (error) {
      console.error('Error creating initial status:', error);
      // Set default values for demo mode
      setActivityStatus({ status: 'online', last_seen: new Date().toISOString() });
      setTempStatus('online');
    }
  };

  const updateStatus = async () => {
    try {
      const { error } = await supabase
        .from('activity_status')
        .upsert({
          user_id: effectiveUserId,
          status: tempStatus,
          last_seen: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating status:', error);
        toast({
          title: "Error",
          description: "Failed to update status.",
          variant: "destructive",
        });
        return;
      }

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
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const loadSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', effectiveUserId)
        .order('skill_type', { ascending: true });

      if (error) {
        console.error('Error loading skills:', error);
        return;
      }
      
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
          user_id: effectiveUserId,
          ...newSkill
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding skill:', error);
        toast({
          title: "Error",
          description: "Failed to add skill.",
          variant: "destructive",
        });
        return;
      }

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

      if (error) {
        console.error('Error removing skill:', error);
        toast({
          title: "Error",
          description: "Failed to remove skill.",
          variant: "destructive",
        });
        return;
      }

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
