
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const getUserDisplayName = (user: User | any) => {
  if (!user) return "Demo User";
  return user.email?.split("@")[0] || "Demo User";
};

export const getUserInitials = (user: User | any) => {
  const name = getUserDisplayName(user);
  return name.charAt(0).toUpperCase();
};

export const getUserRole = () => {
  return "Consultant";
};

export const loadUserAvatar = async (userId: string) => {
  try {
    const { data } = await supabase.storage
      .from('avatars')
      .getPublicUrl(`${userId}.jpg`);
    
    // Check if the file actually exists by trying to fetch it
    const response = await fetch(data.publicUrl);
    if (response.ok) {
      return data.publicUrl;
    } else {
      // Try other common extensions
      const extensions = ['png', 'jpeg', 'webp'];
      for (const ext of extensions) {
        const { data: altData } = await supabase.storage
          .from('avatars')
          .getPublicUrl(`${userId}.${ext}`);
        
        const altResponse = await fetch(altData.publicUrl);
        if (altResponse.ok) {
          return altData.publicUrl;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error loading avatar:", error);
    return null;
  }
};

export const uploadUserAvatar = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true });

  if (uploadError) throw uploadError;

  // Get the public URL for the uploaded image
  const { data } = await supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  return data.publicUrl;
};

export const findConsultantProfile = async (userEmail: string) => {
  const { data: consultant, error } = await supabase
    .from("consultants")
    .select("id")
    .eq("email", userEmail)
    .maybeSingle();

  if (error) throw error;
  return consultant;
};
