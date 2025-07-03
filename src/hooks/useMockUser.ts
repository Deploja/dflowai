
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useMockUser() {
  const { toast } = useToast();

  useEffect(() => {
    const createMockUserProfile = async () => {
      const mockUserId = '00000000-0000-0000-0000-000000000001';
      
      try {
        // Check if mock user profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', mockUserId)
          .maybeSingle();

        if (!existingProfile) {
          // Create mock user profile
          const { error } = await supabase
            .from('profiles')
            .insert({
              id: mockUserId,
              email: 'demo@example.com',
              first_name: 'Demo',
              last_name: 'User',
              full_name: 'Demo User',
              title: 'Software Engineer'
            });

          if (error && error.code !== '23505') { // Ignore duplicate key errors
            console.error('Error creating mock user profile:', error);
          }
        }
      } catch (error) {
        console.error('Error setting up mock user:', error);
      }
    };

    createMockUserProfile();
  }, []);
}
