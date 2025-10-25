import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin, Users, Calendar, Heart, Droplets, GraduationCap, Stethoscope, Sprout, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProjectDetailModal from "@/components/ProjectDetailModal";

interface Project {
  id: string;
  title: string;
  location: string;
  status: string;
  progress: number;
  beneficiaries: number;
  start_date: string;
  budget: number;
  raised: number;
  description: string;
  primary_image_url: string | null;
  category: string;
  images: any;
}

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();

    // Set up real-time subscription
    const channel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const categories = [
    { id: "all", name: "All Projects", icon: Heart },
    { id: "water", name: "Water & Sanitation", icon: Droplets },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "healthcare", name: "Healthcare", icon: Stethoscope },
    { id: "agriculture", name: "Agriculture", icon: Sprout },
    { id: "emergency", name: "Emergency Relief", icon: Heart }
  ];

  const filteredProjects = selectedCategory === "all" 
    ? projects 
    : projects.filter(project => project.category.toLowerCase() === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-primary text-primary-foreground";
      case "Completed": return "bg-green-500 text-white";
      case "Planning": return "bg-orange-500 text-white";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Our Projects
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto animate-fade-in delay-300">
            Transforming communities through sustainable development initiatives worldwide
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 animate-scale-in delay-500">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
              <div className="text-white/80">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">15</div>
              <div className="text-white/80">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">25,000+</div>
              <div className="text-white/80">Lives Impacted</div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Categories */}
      <section className="py-12 bg-gradient-warm">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground mb-4">
                {selectedCategory === "all" 
                  ? "No projects available yet." 
                  : "No projects found in this category."}
              </p>
              {selectedCategory === "all" && (
                <p className="text-muted-foreground">
                  Check back soon for new community projects!
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <Card 
                  key={project.id} 
                  className="overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in cursor-pointer" 
                  style={{animationDelay: `${index * 150}ms`}}
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="relative h-48 overflow-hidden">
                    {project.primary_image_url ? (
                      <img
                        src={project.primary_image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Heart className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className="bg-white/90">
                        {categories.find(cat => cat.id === project.category.toLowerCase())?.name || project.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {project.location}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span>{project.beneficiaries.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span>{project.start_date}</span>
                        </div>
                      </div>
                      
                      {project.budget && (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <span>Funding</span>
                            <span className="font-medium">
                              GH₵{(project.raised || 0).toLocaleString()} / GH₵{project.budget.toLocaleString()}
                            </span>
                          </div>
                          <Progress value={(project.raised || 0) / project.budget * 100} className="h-2" />
                        </>
                      )}
                      
                      <Button 
                        className="w-full mt-4" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProjectClick(project);
                        }}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Support Project
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-warm">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Own Project</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Have an idea for a community project? We're always looking for new opportunities 
            to make a positive impact. Let's work together to bring your vision to life.
          </p>
          <Button size="lg">
            <Heart className="w-5 h-5 mr-2" />
            Propose a Project
          </Button>
        </div>
      </section>

      <Footer />
      <Chatbot />
      
      <ProjectDetailModal
        project={selectedProject}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
};

export default Projects;