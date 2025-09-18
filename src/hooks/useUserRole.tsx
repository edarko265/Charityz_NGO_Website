import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'donor' | 'volunteer' | 'member' | null;

export const useUserRole = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('get_user_role', {
          user_uuid: user.id
        });

        if (error) {
          console.error('Error fetching user role:', error);
          setUserRole('donor'); // Default role
        } else {
          setUserRole(data || 'donor');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('donor'); // Default role
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const isAdmin = userRole === 'admin';
  const isDonor = userRole === 'donor';
  const isVolunteer = userRole === 'volunteer';
  const isMember = userRole === 'member';

  return {
    userRole,
    loading,
    isAdmin,
    isDonor,
    isVolunteer,
    isMember,
  };
};