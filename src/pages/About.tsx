import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Target, Globe, Award, Calendar, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const About = () => {
  const team = [
    {
      name: "Sarah Johnson",
      role: "Executive Director",
      bio: "Leading Charity Z for over 8 years with expertise in international development.",
      experience: "15+ years"
    },
    {
      name: "Michael Chen",
      role: "Program Manager",
      bio: "Oversees project implementation and community partnerships worldwide.",
      experience: "10+ years"
    },
    {
      name: "Emma Rodriguez",
      role: "Development Director",
      bio: "Manages fundraising initiatives and donor relationships.",
      experience: "8+ years"
    },
    {
      name: "David Kim",
      role: "Operations Manager",
      bio: "Ensures efficient operations and volunteer coordination.",
      experience: "6+ years"
    }
  ];

  const milestones = [
    { year: "2015", event: "Charity Z founded with first water project in Kenya", icon: Award },
    { year: "2017", event: "Reached 1,000 beneficiaries across 3 countries", icon: Users },
    { year: "2019", event: "Launched education initiative in Guatemala", icon: Target },
    { year: "2021", event: "Expanded to 5 countries, 10,000+ people impacted", icon: Globe },
    { year: "2023", event: "Achieved sustainable operations milestone", icon: Heart },
    { year: "2024", event: "50+ active projects worldwide", icon: MapPin }
  ];

  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We approach every challenge with empathy and understanding, recognizing the dignity and worth of every person we serve."
    },
    {
      icon: Users,
      title: "Community Partnership",
      description: "We work alongside local communities as partners, ensuring their voices guide our initiatives and their ownership drives success."
    },
    {
      icon: Target,
      title: "Sustainable Impact",
      description: "Every project is designed for long-term success, creating lasting change that communities can maintain and expand."
    },
    {
      icon: Globe,
      title: "Global Perspective",
      description: "We think globally while acting locally, sharing knowledge and best practices across all our project locations."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="About Charity Z"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-60" />
        </div>
        
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            About Charity Z
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto animate-fade-in delay-300">
            Empowering communities through compassionate action and sustainable development since 2015
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-warm">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <Card className="shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg text-muted-foreground">
                  To empower communities through sustainable projects that address basic needs, 
                  education, and economic development. We work hand-in-hand with local partners 
                  to ensure lasting impact and community ownership.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in delay-200">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Our Vision</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg text-muted-foreground">
                  A world where every person has access to the resources and opportunities 
                  they need to thrive. We envision communities that are self-sufficient, 
                  resilient, and filled with hope for the future.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These principles guide everything we do and shape how we approach our work
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-3">{value.title}</h4>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Key milestones in our mission to create positive change worldwide
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              return (
                <div key={index} className="flex items-center mb-8 animate-fade-in" style={{animationDelay: `${index * 150}ms`}}>
                  <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-grow">
                    <Badge variant="outline" className="mb-2">{milestone.year}</Badge>
                    <p className="text-lg font-medium">{milestone.event}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-gradient-warm">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Leadership Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Meet the dedicated professionals leading Charity Z's mission
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                  <h4 className="font-semibold text-lg mb-1">{member.name}</h4>
                  <Badge variant="outline" className="mb-3">{member.role}</Badge>
                  <p className="text-sm text-muted-foreground mb-3">{member.bio}</p>
                  <div className="flex items-center justify-center text-xs text-primary">
                    <Calendar className="w-3 h-3 mr-1" />
                    {member.experience}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default About;