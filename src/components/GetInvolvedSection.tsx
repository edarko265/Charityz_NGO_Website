import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Briefcase, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const GetInvolvedSection = () => {
  const ways = [
    {
      icon: Heart,
      title: "Become a Donor",
      description: "Support our mission with a one-time gift or monthly donation. Every contribution makes a difference.",
      action: "Donate Now",
      link: "/donate",
      color: "bg-primary text-primary-foreground",
      features: [
        "Tax-deductible donations",
        "Monthly giving options",
        "Impact reports",
        "Donor recognition"
      ]
    },
    {
      icon: Users,
      title: "Join as a Member",
      description: "Become part of our community and help shape our initiatives through active participation.",
      action: "Become a Member",
      link: "/membership",
      color: "bg-charity-brown text-white",
      features: [
        "Monthly newsletters",
        "Member events",
        "Voting rights",
        "Special recognition"
      ]
    },
    {
      icon: Briefcase,
      title: "Volunteer with Us",
      description: "Share your skills and time to directly impact communities and help us achieve our goals.",
      action: "Start Volunteering",
      link: "/volunteer",
      color: "bg-green-600 text-white",
      features: [
        "Flexible scheduling",
        "Skill-based opportunities",
        "Training provided",
        "Certificate of service"
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-warm">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Involved</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            There are many ways to support our mission. Whether through donations, 
            membership, or volunteering, your involvement makes a real difference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {ways.map((way, index) => {
            const Icon = way.icon;
            return (
              <Card key={index} className="shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 200}ms`}}>
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 ${way.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl">{way.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-center">
                    {way.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {way.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button asChild className="w-full mt-6">
                    <Link to={way.link}>
                      {way.action}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="bg-card rounded-lg p-8 text-center shadow-card">
          <h3 className="text-2xl font-bold mb-4">Have Questions?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our team is here to help you find the best way to get involved. 
            Reach out to learn more about our programs and opportunities.
          </p>
          <Button asChild variant="outline" size="lg">
            <Link to="/contact">
              <Mail className="w-4 h-4 mr-2" />
              Contact Us
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GetInvolvedSection;