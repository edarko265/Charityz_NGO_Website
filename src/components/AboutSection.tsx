import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Target, Globe } from "lucide-react";

const AboutSection = () => {
  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We believe in the power of empathy and kindness to create lasting change in communities."
    },
    {
      icon: Users,
      title: "Community",
      description: "Together we are stronger. We build bridges and foster connections that empower everyone."
    },
    {
      icon: Target,
      title: "Impact",
      description: "Every action we take is measured by its positive impact on the lives we touch."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Local action with global vision - we create change that transcends borders."
    }
  ];

  return (
    <section className="py-20 bg-gradient-warm">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Charity Z</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Founded on the belief that everyone deserves hope, opportunity, and dignity, 
            Charity Z has been transforming lives and communities for years.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Our Mission</h3>
            <p className="text-lg text-muted-foreground">
              To empower communities through sustainable projects that address basic needs, 
              education, and economic development. We work hand-in-hand with local partners 
              to ensure lasting impact and community ownership.
            </p>
            <p className="text-lg text-muted-foreground">
              From providing clean water and education to supporting small businesses and 
              healthcare initiatives, we tackle the root causes of poverty and inequality.
            </p>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Our Vision</h3>
            <p className="text-lg text-muted-foreground">
              A world where every person has access to the resources and opportunities 
              they need to thrive. We envision communities that are self-sufficient, 
              resilient, and filled with hope for the future.
            </p>
            <p className="text-lg text-muted-foreground">
              Through collaboration, innovation, and unwavering commitment, we strive 
              to create sustainable change that lasts for generations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card key={index} className="shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">{value.title}</h4>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;