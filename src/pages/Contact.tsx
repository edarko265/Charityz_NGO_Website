import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Users, Heart, Globe } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "info@charityz.org",
      description: "We typically respond within 24 hours",
      action: "mailto:info@charityz.org"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      description: "Mon-Fri, 9 AM - 5 PM EST",
      action: "tel:+15551234567"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "123 Hope Street\nCity, State 12345",
      description: "Open by appointment",
      action: "#"
    },
    {
      icon: Clock,
      title: "Office Hours",
      content: "Monday - Friday\n9:00 AM - 5:00 PM EST",
      description: "Emergency contact available 24/7",
      action: "#"
    }
  ];

  const officeLocations = [
    {
      city: "Headquarters - New York",
      address: "123 Hope Street, New York, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "ny@charityz.org"
    },
    {
      city: "Regional Office - Kenya",
      address: "Nakuru County, Kenya",
      phone: "+254 700 123 456",
      email: "kenya@charityz.org"
    },
    {
      city: "Regional Office - Guatemala",
      address: "San Pedro, Guatemala",
      phone: "+502 1234 5678",
      email: "guatemala@charityz.org"
    }
  ];

  const departments = [
    {
      name: "General Inquiry",
      email: "info@charityz.org",
      description: "Questions about our work, programs, or general information"
    },
    {
      name: "Volunteer Coordination",
      email: "volunteers@charityz.org",
      description: "Volunteer opportunities, applications, and coordination"
    },
    {
      name: "Donations & Fundraising",
      email: "donations@charityz.org",
      description: "Donation inquiries, corporate partnerships, and fundraising"
    },
    {
      name: "Media & Communications",
      email: "media@charityz.org",
      description: "Press inquiries, interviews, and media requests"
    },
    {
      name: "Project Partnerships",
      email: "partnerships@charityz.org",
      description: "Community partnerships and project collaboration"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto animate-fade-in delay-300">
            We'd love to hear from you. Get in touch with questions, ideas, or to learn how you can get involved.
          </p>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-20 bg-gradient-warm">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="text-center shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 150}ms`}}>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{info.title}</h3>
                    <p className="text-sm font-medium mb-2 whitespace-pre-line">{info.content}</p>
                    <p className="text-xs text-muted-foreground mb-4">{info.description}</p>
                    {info.action !== "#" && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={info.action}>Contact</a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-primary" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="First Name" />
                  <Input placeholder="Last Name" />
                </div>
                <Input placeholder="Email Address" type="email" />
                <Input placeholder="Phone Number (Optional)" type="tel" />
                <Input placeholder="Organization (Optional)" />
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="volunteer">Volunteer Opportunities</SelectItem>
                      <SelectItem value="donation">Donation Questions</SelectItem>
                      <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                      <SelectItem value="media">Media Inquiry</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea 
                    placeholder="Tell us how we can help or share your ideas..." 
                    rows={6} 
                  />
                </div>

                <Button className="w-full" size="lg">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  We'll get back to you within 24 hours during business days.
                </p>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <div className="space-y-6">
              {/* Department Contacts */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Department Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments.map((dept, index) => (
                      <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                        <h4 className="font-medium mb-1">{dept.name}</h4>
                        <p className="text-sm text-primary mb-1">
                          <a href={`mailto:${dept.email}`} className="hover:underline">
                            {dept.email}
                          </a>
                        </p>
                        <p className="text-xs text-muted-foreground">{dept.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Office Locations */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-primary" />
                    Our Locations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {officeLocations.map((location, index) => (
                      <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                        <h4 className="font-medium mb-2">{location.city}</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-start">
                            <MapPin className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{location.address}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-2 flex-shrink-0" />
                            <span>{location.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-3 h-3 mr-2 flex-shrink-0" />
                            <a href={`mailto:${location.email}`} className="text-primary hover:underline">
                              {location.email}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-card bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Ready to Make a Difference?
                  </h3>
                  <p className="mb-6 text-primary-foreground/90">
                    Don't wait to get involved. Every moment counts when it comes to creating positive change.
                  </p>
                  <div className="space-y-3">
                    <Button variant="secondary" className="w-full">
                      <Heart className="w-4 h-4 mr-2" />
                      Donate Now
                    </Button>
                    <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-primary">
                      <Users className="w-4 h-4 mr-2" />
                      Volunteer Today
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-warm">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Quick answers to common questions. Can't find what you're looking for? Contact us directly!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">How can I track my donation impact?</h4>
                <p className="text-sm text-muted-foreground">We provide regular updates through our newsletter and send impact reports to all donors showing exactly how their contributions are making a difference.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Are my donations tax-deductible?</h4>
                <p className="text-sm text-muted-foreground">Yes, Charity Z is a registered 501(c)(3) non-profit organization. All donations are tax-deductible to the full extent allowed by law.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Can I volunteer remotely?</h4>
                <p className="text-sm text-muted-foreground">Absolutely! We have many remote volunteer opportunities including social media management, administrative support, and virtual fundraising assistance.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">How do you ensure project sustainability?</h4>
                <p className="text-sm text-muted-foreground">We work closely with local communities from planning to implementation, ensuring they have the knowledge and resources to maintain projects long-term.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">What percentage goes to overhead?</h4>
                <p className="text-sm text-muted-foreground">We maintain low overhead costs with 85% of donations going directly to programs and 15% covering essential administrative and fundraising expenses.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Can I visit project sites?</h4>
                <p className="text-sm text-muted-foreground">We organize donor and volunteer trips to project sites several times a year. Contact us to learn about upcoming opportunities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default Contact;