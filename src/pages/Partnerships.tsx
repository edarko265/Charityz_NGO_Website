import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, HandHeart, Users, TrendingUp, Mail, Phone } from "lucide-react";

const Partnerships = () => {
  const partnershipTypes = [
    {
      title: "Strategic Partnerships",
      description: "Long-term collaborations aligned with your corporate values and our mission.",
      icon: <Building2 className="w-8 h-8 text-primary" />,
      benefits: ["Brand alignment", "Employee engagement", "CSR objectives", "Tax benefits"],
    },
    {
      title: "Sponsorship Programs",
      description: "Support specific projects or events with customizable sponsorship packages.",
      icon: <HandHeart className="w-8 h-8 text-primary" />,
      benefits: ["Brand visibility", "Community impact", "Event recognition", "Marketing opportunities"],
    },
    {
      title: "Employee Engagement",
      description: "Involve your team through volunteer programs and workplace giving initiatives.",
      icon: <Users className="w-8 h-8 text-primary" />,
      benefits: ["Team building", "Skill development", "Employee satisfaction", "Company culture"],
    },
    {
      title: "Impact Investments",
      description: "Create measurable social impact while achieving sustainable business outcomes.",
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      benefits: ["Social ROI", "Impact measurement", "Sustainable growth", "Innovation"],
    },
  ];

  const currentPartners = [
    "Global Tech Solutions",
    "Community Bank Alliance",
    "Green Energy Corp",
    "Healthcare Partners Inc",
    "Education Foundation",
    "Local Business Network",
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Corporate <span className="text-primary">Partnerships</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Partner with us to create meaningful change in communities worldwide while achieving your corporate social responsibility goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Partnership Team
                </Button>
                <Button size="lg" variant="outline">
                  Download Partnership Brochure
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Types */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Partnership Opportunities</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Choose from various partnership models designed to align with your business objectives and values.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {partnershipTypes.map((type, index) => (
                <Card key={index} className="border-2 hover:border-primary/20 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      {type.icon}
                      <CardTitle className="text-xl">{type.title}</CardTitle>
                    </div>
                    <p className="text-muted-foreground">{type.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {type.benefits.map((benefit) => (
                        <Badge key={benefit} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Partner With Us */}
        <section className="bg-muted/50 py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Partner With Charity Z?</h2>
              
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">15+</div>
                  <div className="text-lg font-semibold mb-2">Years of Impact</div>
                  <p className="text-muted-foreground">Proven track record of successful partnerships and community development.</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                  <div className="text-lg font-semibold mb-2">Lives Transformed</div>
                  <p className="text-muted-foreground">Measurable impact across education, healthcare, and community development.</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">25+</div>
                  <div className="text-lg font-semibold mb-2">Corporate Partners</div>
                  <p className="text-muted-foreground">Trusted partnerships with leading organizations worldwide.</p>
                </div>
              </div>

              <Card className="bg-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Partnership Benefits</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Transparent Impact Reporting:</strong> Regular updates with detailed metrics and success stories</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Custom Partnership Packages:</strong> Tailored solutions to meet your specific CSR goals</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Employee Engagement Opportunities:</strong> Volunteer programs and team building activities</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Brand Recognition:</strong> Co-marketing opportunities and event visibility</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Current Partners */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Valued Partners</h2>
              <p className="text-lg text-muted-foreground">
                We're proud to work alongside these organizations making a difference.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {currentPartners.map((partner, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <Building2 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">{partner}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make an Impact Together?</h2>
              <p className="text-xl mb-8 opacity-90">
                Let's discuss how we can create a partnership that aligns with your values and amplifies your impact.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white/10 rounded-lg p-6">
                  <Mail className="w-6 h-6 mb-3 mx-auto" />
                  <h4 className="font-semibold mb-2">Email Us</h4>
                  <p className="opacity-90">partnerships@charityz.org</p>
                </div>
                <div className="bg-white/10 rounded-lg p-6">
                  <Phone className="w-6 h-6 mb-3 mx-auto" />
                  <h4 className="font-semibold mb-2">Call Us</h4>
                  <p className="opacity-90">+1 (555) 123-4567 ext. 201</p>
                </div>
              </div>
              
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Schedule a Partnership Meeting
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Partnerships;