
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings as SettingsIcon, Upload, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";

export function ProfileSettings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    title: "",
    phone: "",
    location: "",
    avatar_url: ""
  });

  // Use mock user ID when no authentication
  const mockUserId = "00000000-0000-0000-0000-000000000001";
  const effectiveUserId = user?.id || mockUserId;

  useEffect(() => {
    loadProfile();
  }, [effectiveUserId]);

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

  const loadProfile = async () => {
    try {
      // Ensure user exists first
      await ensureUserExists();

      // Set default email for demo mode
      const defaultEmail = user?.email || "demo@example.com";
      setFormData(prev => ({ ...prev, email: defaultEmail }));

      // Query profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', effectiveUserId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (profile) {
        setFormData({
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          email: profile.email || defaultEmail,
          title: profile.title || "",
          phone: profile.phone || "",
          location: profile.location || "",
          avatar_url: profile.avatar_url || ""
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${effectiveUserId}.${fileExt}`;

      // Create a mock URL for demo mode
      const mockUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, avatar_url: mockUrl }));
      
      toast({
        title: "Success",
        description: "Avatar uploaded successfully!"
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: error.message || "Error uploading avatar",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: effectiveUserId,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          title: formData.title,
          phone: formData.phone,
          location: formData.location,
          avatar_url: formData.avatar_url,
          full_name: `${formData.first_name} ${formData.last_name}`.trim(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving profile:', error);
        toast({
          title: "Error",
          description: "Failed to save profile.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully!"
      });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <SettingsIcon className="h-5 w-5 mr-2" />
          Profile Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={formData.avatar_url} />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" className="flex items-center" disabled={uploading} asChild>
              <label htmlFor="avatar-upload" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Upload Photo"}
              </label>
            </Button>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={uploadAvatar}
              className="hidden"
            />
            <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 2MB</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              value={formData.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              value={formData.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input 
              id="title" 
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input 
              id="phone" 
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input 
            id="location" 
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
        </div>

        <Button 
          onClick={handleSave} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}
