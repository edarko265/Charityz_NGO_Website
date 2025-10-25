import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, TrendingUp, Users, DollarSign, Target, MapPin, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DonationTrend {
  date: string;
  amount: number;
  count: number;
}

interface VolunteerMetric {
  status: string;
  count: number;
}

interface ProjectProgress {
  title: string;
  progress: number;
  budget: number;
  raised: number;
}

interface GeographicData {
  location: string;
  count: number;
}

const Analytics = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [donationTrends, setDonationTrends] = useState<DonationTrend[]>([]);
  const [volunteerMetrics, setVolunteerMetrics] = useState<VolunteerMetric[]>([]);
  const [projectProgress, setProjectProgress] = useState<ProjectProgress[]>([]);
  const [geographicData, setGeographicData] = useState<GeographicData[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalDonations: 0,
    totalDonors: 0,
    totalVolunteers: 0,
    activeProjects: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch donation trends (last 6 months)
      const { data: donations } = await supabase
        .from("donations")
        .select("amount, created_at, payment_status")
        .eq("payment_status", "successful")
        .order("created_at", { ascending: true });

      // Process donation trends by month
      const trends = processDonationTrends(donations || []);
      setDonationTrends(trends);

      // Fetch volunteer metrics
      const { data: volunteers } = await supabase
        .from("volunteers")
        .select("status");

      const metrics = processVolunteerMetrics(volunteers || []);
      setVolunteerMetrics(metrics);

      // Fetch project progress
      const { data: projects } = await supabase
        .from("projects")
        .select("title, progress, budget, raised")
        .order("progress", { ascending: false })
        .limit(10);

      setProjectProgress(projects || []);

      // Fetch geographic distribution (from projects)
      const { data: projectLocations } = await supabase
        .from("projects")
        .select("location");

      const geoData = processGeographicData(projectLocations || []);
      setGeographicData(geoData);

      // Calculate total stats
      const { data: donorCount } = await supabase
        .from("donors")
        .select("id", { count: "exact" });

      const totalDonations = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;

      const { data: activeProjectsData } = await supabase
        .from("projects")
        .select("id", { count: "exact" })
        .eq("status", "Active");

      setTotalStats({
        totalDonations,
        totalDonors: donorCount?.length || 0,
        totalVolunteers: volunteers?.length || 0,
        activeProjects: activeProjectsData?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processDonationTrends = (donations: any[]) => {
    const monthlyData: { [key: string]: { amount: number; count: number } } = {};

    donations.forEach((donation) => {
      const date = new Date(donation.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { amount: 0, count: 0 };
      }

      monthlyData[monthKey].amount += Number(donation.amount);
      monthlyData[monthKey].count += 1;
    });

    return Object.entries(monthlyData)
      .map(([date, data]) => ({
        date,
        amount: data.amount,
        count: data.count,
      }))
      .slice(-6); // Last 6 months
  };

  const processVolunteerMetrics = (volunteers: any[]) => {
    const statusCounts: { [key: string]: number } = {};

    volunteers.forEach((volunteer) => {
      const status = volunteer.status || "pending";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
    }));
  };

  const processGeographicData = (locations: any[]) => {
    const locationCounts: { [key: string]: number } = {};

    locations.forEach((item) => {
      const location = item.location || "Unknown";
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    return Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).join(","));
    const csv = [headers, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: `${filename} exported successfully`,
    });
  };

  const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "#f59e0b", "#10b981", "#ef4444"];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-20">
          <div className="text-center">Loading analytics...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <section className="py-20">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Analytics & Reports</h1>
              <p className="text-muted-foreground">Comprehensive insights into your organization's impact</p>
            </div>
            <Button onClick={() => exportToCSV(donationTrends, "donation-trends")}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">GH₵{totalStats.totalDonations.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStats.totalDonors}</div>
                <p className="text-xs text-muted-foreground">Unique donors</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Volunteers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStats.totalVolunteers}</div>
                <p className="text-xs text-muted-foreground">Total registered</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStats.activeProjects}</div>
                <p className="text-xs text-muted-foreground">Currently running</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics Tabs */}
          <Tabs defaultValue="donations" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="donations">Donations</TabsTrigger>
              <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="geography">Geography</TabsTrigger>
            </TabsList>

            <TabsContent value="donations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Donation Trends (Last 6 Months)</CardTitle>
                  <CardDescription>Monthly donation amounts and transaction counts</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={donationTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="amount"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                        name="Amount (GH₵)"
                      />
                      <Line yAxisId="right" type="monotone" dataKey="count" stroke="#f59e0b" name="Transaction Count" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button onClick={() => exportToCSV(donationTrends, "donation-trends")} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Donation Data
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="volunteers" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Volunteer Status Distribution</CardTitle>
                    <CardDescription>Breakdown by application status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={volunteerMetrics} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100} label>
                          {volunteerMetrics.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Volunteer Metrics</CardTitle>
                    <CardDescription>Detailed breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {volunteerMetrics.map((metric, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="font-medium">{metric.status}</span>
                          </div>
                          <span className="text-2xl font-bold">{metric.count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button onClick={() => exportToCSV(volunteerMetrics, "volunteer-metrics")} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Volunteer Data
              </Button>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top 10 Projects by Progress</CardTitle>
                  <CardDescription>Project completion and funding status</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={projectProgress} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="title" type="category" width={150} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="progress" fill="hsl(var(--primary))" name="Progress %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Funding Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projectProgress.slice(0, 5).map((project, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{project.title}</span>
                          <span className="text-sm text-muted-foreground">
                            GH₵{project.raised?.toLocaleString() || 0} / GH₵{project.budget?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${Math.min(((project.raised || 0) / (project.budget || 1)) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button onClick={() => exportToCSV(projectProgress, "project-progress")} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Project Data
              </Button>
            </TabsContent>

            <TabsContent value="geography" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                  <CardDescription>Projects by location</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={geographicData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="location" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="hsl(var(--primary))" name="Project Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {geographicData.map((location, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{location.location}</span>
                        </div>
                        <span className="text-lg font-bold">{location.count} projects</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button onClick={() => exportToCSV(geographicData, "geographic-distribution")} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Geographic Data
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Analytics;
