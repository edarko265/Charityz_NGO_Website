import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Users, Calendar, DollarSign, Heart, Droplets, GraduationCap, Stethoscope, Sprout } from "lucide-react";
import projectsImage from "@/assets/projects-impact.jpg";
import volunteersImage from "@/assets/volunteers-helping.jpg";

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const projects = [
    {
      id: 1,
      title: "Clean Water Initiative - Nakuru",
      location: "Nakuru County, Kenya",
      status: "Active",
      progress: 75,
      beneficiaries: 1200,
      startDate: "March 2024",
      budget: 100000,
      raised: 75000,
      description: "Building sustainable water systems including wells, pumps, and distribution networks to provide clean drinking water to remote communities.",
      image: projectsImage,
      category: "water",
      longDescription: "This comprehensive water project addresses the critical need for clean, accessible water in rural Nakuru County. We're working with local communities to install solar-powered water pumps, construct storage tanks, and establish water distribution points throughout the region.",
      impact: [
        "1,200 people gaining access to clean water",
        "Reduced waterborne diseases by 60%",
        "Women save 3+ hours daily from water collection",
        "Improved school attendance as children help less with water collection"
      ],
      nextSteps: [
        "Complete pipeline installation",
        "Train local maintenance team",
        "Establish water management committee"
      ]
    },
    {
      id: 2,
      title: "Education for All - San Pedro",
      location: "San Pedro, Guatemala",
      status: "Completed",
      progress: 100,
      beneficiaries: 300,
      startDate: "January 2023",
      budget: 160000,
      raised: 160000,
      description: "Constructed a school and provided educational resources for underprivileged children in rural Guatemala.",
      image: volunteersImage,
      category: "education",
      longDescription: "A complete educational facility including 6 classrooms, library, computer lab, and playground. The project also included teacher training, curriculum development, and provision of school supplies for 300 children.",
      impact: [
        "300 children now have access to quality education",
        "20 local teachers trained in modern teaching methods",
        "100% increase in literacy rates in the community",
        "Reduced child labor as more children attend school"
      ],
      nextSteps: [
        "Monitor educational outcomes",
        "Plan expansion for additional grades",
        "Establish scholarship program"
      ]
    },
    {
      id: 3,
      title: "Community Health Center - Mindanao",
      location: "Mindanao, Philippines",
      status: "Planning",
      progress: 25,
      beneficiaries: 2000,
      startDate: "July 2024",
      budget: 240000,
      raised: 60000,
      description: "Establishing a healthcare facility to serve rural communities with basic medical services, maternal care, and health education.",
      image: projectsImage,
      category: "healthcare",
      longDescription: "This healthcare initiative will provide essential medical services to underserved communities in rural Mindanao. The center will offer primary healthcare, maternal and child health services, vaccination programs, and health education.",
      impact: [
        "2,000 people gaining access to healthcare",
        "Maternal mortality reduction by 40%",
        "Immunization coverage increase to 95%",
        "Health education reaching 500 families monthly"
      ],
      nextSteps: [
        "Secure remaining funding",
        "Begin construction",
        "Recruit and train medical staff"
      ]
    },
    {
      id: 4,
      title: "Sustainable Agriculture Program",
      location: "Masaka, Uganda",
      status: "Active",
      progress: 60,
      beneficiaries: 800,
      startDate: "September 2023",
      budget: 120000,
      raised: 88000,
      description: "Training farmers in sustainable agriculture techniques and providing seeds, tools, and microfinance support.",
      image: volunteersImage,
      category: "agriculture",
      longDescription: "Empowering local farmers with knowledge and resources for sustainable farming practices. The program includes training on organic farming, crop diversification, water conservation, and connects farmers to local markets.",
      impact: [
        "800 farmers trained in sustainable techniques",
        "Crop yields increased by 40%",
        "Income increased by 50% for participating families",
        "Reduced pesticide use by 70%"
      ],
      nextSteps: [
        "Expand to 5 additional villages",
        "Establish farmer cooperatives",
        "Launch market linkage program"
      ]
    },
    {
      id: 5,
      title: "Emergency Relief - Flood Response",
      location: "Sylhet, Bangladesh",
      status: "Completed",
      progress: 100,
      beneficiaries: 1500,
      startDate: "August 2023",
      budget: 80000,
      raised: 80000,
      description: "Provided emergency relief including food, clean water, shelter materials, and medical aid to flood-affected communities.",
      image: projectsImage,
      category: "emergency",
      longDescription: "Rapid response to severe flooding that displaced thousands of families. Our team provided immediate relief including emergency shelter, food packages, water purification tablets, and basic medical care.",
      impact: [
        "1,500 people received emergency relief",
        "300 families provided temporary shelter",
        "Medical aid reached 500+ individuals",
        "Clean water access restored for entire affected area"
      ],
      nextSteps: [
        "Support long-term recovery efforts",
        "Help rebuild damaged infrastructure",
        "Establish disaster preparedness programs"
      ]
    }
  ];

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
    : projects.filter(project => project.category === selectedCategory);

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
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
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-white/90">
                      {categories.find(cat => cat.id === project.category)?.name}
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
                  <p className="text-sm text-muted-foreground mb-4">
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
                        <span>{project.startDate}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Funding</span>
                      <span className="font-medium">GH₵{project.raised.toLocaleString()} / GH₵{project.budget.toLocaleString()}</span>
                    </div>
                    <Progress value={(project.raised / project.budget) * 100} className="h-2" />
                    
                    <Button className="w-full mt-4" size="sm">
                      <Heart className="w-4 h-4 mr-2" />
                      Support Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
    </div>
  );
};

export default Projects;