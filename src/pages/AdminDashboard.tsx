import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, FileText, ClipboardList, BarChart, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminDashboardComponent from '@/components/AdminDashboard';
import PostsManagement from '@/components/PostsManagement';
import TasksManagement from '@/components/TasksManagement';
import ProjectsManagement from '@/components/ProjectsManagement';
import EventsManagement from '@/components/EventsManagement';
import AboutManagement from '@/components/AboutManagement';
import UserRolesManagement from '@/components/UserRolesManagement';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalUsers: number;
  activePosts: number;
  pendingTasks: number;
  totalDonations: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activePosts: 0,
    pendingTasks: 0,
    totalDonations: 'GH₵0'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // Fetch user count
      const { count: userCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });

      // Fetch active posts count
      const { count: postsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('published', true);

      // Fetch pending tasks count
      const { count: tasksCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch total donations amount
      const { data: donations } = await supabase
        .from('donations')
        .select('amount')
        .eq('payment_status', 'successful');

      const totalAmount = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;

      setStats({
        totalUsers: userCount || 0,
        activePosts: postsCount || 0,
        pendingTasks: tasksCount || 0,
        totalDonations: `$${totalAmount.toLocaleString()}`
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your charity organization from this central hub
              </p>
            </div>
            <Button onClick={fetchStats} disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 gap-2">
            <TabsTrigger value="overview" className="flex items-center gap-1 text-xs">
              <BarChart className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1 text-xs">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-1 text-xs">
              <Users className="h-4 w-4" />
              Roles
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-1 text-xs">
              <FileText className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-1 text-xs">
              <ClipboardList className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-1 text-xs">
              <FileText className="h-4 w-4" />
              About
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center gap-1 text-xs">
              <FileText className="h-4 w-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-1 text-xs">
              <ClipboardList className="h-4 w-4" />
              Tasks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? '...' : stats.totalUsers}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Registered users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? '...' : stats.activePosts}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Published posts
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? '...' : stats.pendingTasks}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting completion
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? '...' : stats.totalDonations}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Successfully raised
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common administrative tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Post
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Assign New Task
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest actions in your organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm">New volunteer registration</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm">Donation received: GH₵2,000</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                      <p className="text-sm">Task completed by volunteer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <AdminDashboardComponent />
          </TabsContent>

          <TabsContent value="roles">
            <UserRolesManagement />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsManagement />
          </TabsContent>

          <TabsContent value="events">
            <EventsManagement />
          </TabsContent>

          <TabsContent value="about">
            <AboutManagement />
          </TabsContent>

          <TabsContent value="posts">
            <PostsManagement />
          </TabsContent>

          <TabsContent value="tasks">
            <TasksManagement />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;