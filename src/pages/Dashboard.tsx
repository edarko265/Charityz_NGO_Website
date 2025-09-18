import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import VolunteerDashboard from '@/components/VolunteerDashboard';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { userRole, loading: roleLoading } = useUserRole();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to appropriate dashboard based on role
  if (userRole === 'admin') {
    return <AdminDashboard />;
  }

  // Default dashboard for volunteers, members, and donors
  return <VolunteerDashboard />;
};

export default Dashboard;