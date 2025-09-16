import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, MapPin, Users, Calendar } from "lucide-react";
import projectsImage from "@/assets/projects-impact.jpg";
import volunteersImage from "@/assets/volunteers-helping.jpg";

const ProjectsSection = () => {
  const projects = [
    {
      id: 1,
      title: "Clean Water Initiative",
      location: "Rural Kenya",
      status: "Active",
      progress: 75,
      beneficiaries: 1200,
      startDate: "March 2024",
      description: "Building sustainable water systems to provide clean drinking water to remote communities.",
      image: projectsImage,
      category: "Water & Sanitation"
    },
    {
      id: 2,
      title: "Education for All",
      location: "Guatemala",
      status: "Completed",
      progress: 100,
      beneficiaries: 300,
      startDate: "January 2023",
      description: "Constructed a school and provided educational resources for underprivileged children.",
      image: volunteersImage,
      category: "Education"
    },
    {
      id: 3,
      title: "Community Health Center",
      location: "Philippines",
      status: "Planning",
      progress: 25,
      beneficiaries: 2000,
      startDate: "July 2024",
      description: "Establishing a healthcare facility to serve rural communities with basic medical services.",
      image: projectsImage,
      category: "Healthcare"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-primary text-primary-foreground";
      case "Completed": return "bg-green-500 text-white";
      case "Planning": return "bg-orange-500 text-white";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Projects</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From water wells to schools, healthcare facilities to sustainable farming - 
            see how we're making a real difference in communities worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project, index) => (
            <Card key={project.id} className="overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 150}ms`}}>
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="mb-2">{project.title}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {project.location}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="w-fit">
                  {project.category}
                </Badge>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {project.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {project.beneficiaries.toLocaleString()} people
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {project.startDate}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline">
            View All Projects
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;