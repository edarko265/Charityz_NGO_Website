import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import DonationForm from "@/components/DonationForm";
import DonorDashboard from "@/components/DonorDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Users, Briefcase, CreditCard, Calendar, Mail, Phone, MapPin, ArrowRight, Shield, Award, BarChart3 } from "lucide-react";
import volunteersImage from "@/assets/volunteers-helping.jpg";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const GetInvolved = () => {
  const { toast } = useToast();
  const donationAmounts = [100, 200, 400, 1000, 2000, 4000];

  // Volunteer form state
  const [volunteerForm, setVolunteerForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    areasOfInterest: [] as string[],
    availability: '',
    skillsExperience: '',
    isSubmitting: false
  });

  // Member form state
  const [memberForm, setMemberForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    membershipType: '',
    referralSource: '',
    motivations: '',
    newsletter: false,
    events: false,
    isSubmitting: false
  });
  
  const volunteerOpportunities = [
    {
      title: "Field Volunteer",
      location: "International",
      commitment: "3-6 months",
      description: "Work directly with communities on project implementation",
      skills: ["Cross-cultural communication", "Physical fitness", "Adaptability"]
    },
    {
      title: "Administrative Support",
      location: "Remote/Office",
      commitment: "5-10 hours/week",
      description: "Help with data entry, communications, and office tasks",
      skills: ["Computer skills", "Organization", "Attention to detail"]
    },
    {
      title: "Event Coordinator",
      location: "Local",
      commitment: "Project-based",
      description: "Plan and execute fundraising and awareness events",
      skills: ["Event planning", "Communication", "Project management"]
    },
    {
      title: "Social Media Manager",
      location: "Remote",
      commitment: "3-5 hours/week",
      description: "Manage our social media presence and content creation",
      skills: ["Social media", "Content creation", "Design skills"]
    }
  ];

  const membershipBenefits = [
    "Monthly impact newsletters with exclusive updates",
    "Voting rights on key organizational decisions",
    "Access to member-only events and webinars",
    "Priority registration for volunteer opportunities",
    "Annual member appreciation dinner",
    "Tax-deductible membership fees",
    "Direct communication with leadership team",
    "Special recognition in annual reports"
  ];

  // Handle volunteer form submission
  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!volunteerForm.firstName || !volunteerForm.lastName || !volunteerForm.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setVolunteerForm(prev => ({ ...prev, isSubmitting: true }));

    try {
      const { error } = await supabase
        .from('volunteers')
        .insert({
          first_name: volunteerForm.firstName,
          last_name: volunteerForm.lastName,
          email: volunteerForm.email,
          phone: volunteerForm.phone || null,
          address: volunteerForm.address || null,
          areas_of_interest: volunteerForm.areasOfInterest,
          availability: volunteerForm.availability || null,
          skills_experience: volunteerForm.skillsExperience || null,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Application Submitted! 🎉",
        description: "Thank you for your interest in volunteering. We'll review your application and contact you soon.",
      });

      // Reset form
      setVolunteerForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        areasOfInterest: [],
        availability: '',
        skillsExperience: '',
        isSubmitting: false
      });

    } catch (error) {
      console.error('Error submitting volunteer application:', error);
      toast({
        title: "Error",
        description: "There was an issue submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setVolunteerForm(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  // Handle member form submission
  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!memberForm.firstName || !memberForm.lastName || !memberForm.email || !memberForm.membershipType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setMemberForm(prev => ({ ...prev, isSubmitting: true }));

    try {
      const { error } = await supabase
        .from('members')
        .insert({
          first_name: memberForm.firstName,
          last_name: memberForm.lastName,
          email: memberForm.email,
          phone: memberForm.phone || null,
          organization: memberForm.organization || null,
          membership_type: memberForm.membershipType,
          referral_source: memberForm.referralSource || null,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Membership Application Submitted! 🎉",
        description: "Welcome to the CharityZ community! We'll process your membership and send you a confirmation email.",
      });

      // Reset form
      setMemberForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        organization: '',
        membershipType: '',
        referralSource: '',
        motivations: '',
        newsletter: false,
        events: false,
        isSubmitting: false
      });

    } catch (error) {
      console.error('Error submitting membership application:', error);
      toast({
        title: "Error",
        description: "There was an issue submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setMemberForm(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  // Handle volunteer interest checkbox changes
  const handleInterestChange = (interest: string, checked: boolean) => {
    setVolunteerForm(prev => ({
      ...prev,
      areasOfInterest: checked 
        ? [...prev.areasOfInterest, interest]
        : prev.areasOfInterest.filter(i => i !== interest)
    }));
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Get Involved
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto animate-fade-in delay-300">
            Every contribution matters. Choose how you'd like to support our mission and create positive change.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container">
          <Tabs defaultValue="donate" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-12">
              <TabsTrigger value="donate" className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>Donate</span>
              </TabsTrigger>
              <TabsTrigger value="volunteer" className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4" />
                <span>Volunteer</span>
              </TabsTrigger>
              <TabsTrigger value="membership" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Membership</span>
              </TabsTrigger>
            </TabsList>

            {/* Donation Tab */}
            <TabsContent value="donate" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Make a Donation</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Your generosity directly funds our projects and creates lasting change in communities worldwide.
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Donation Form */}
                <div className="lg:col-span-2">
                  <DonationForm />
                </div>

                {/* Impact & Information */}
                <div className="space-y-6">
                  <Card className="shadow-card">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4 flex items-center">
                        <BarChart3 className="w-4 h-4 mr-2 text-primary" />
                        Your Impact
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                          <span className="text-sm">GH₵100 provides clean water for 1 person for 1 year</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                          <span className="text-sm">GH₵200 supplies school materials for 1 child</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                          <span className="text-sm">GH₵400 funds medical care for 5 families</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                          <span className="text-sm">GH₵1,000 supports a teacher's salary for 1 month</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-card">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Other Ways to Give</h3>
                      <div className="space-y-4">
                        <div className="border-l-4 border-primary pl-4">
                          <h4 className="font-medium">Corporate Sponsorship</h4>
                          <p className="text-sm text-muted-foreground">Partner with us for large-scale impact and CSR opportunities.</p>
                        </div>
                        <div className="border-l-4 border-primary pl-4">
                          <h4 className="font-medium">Planned Giving</h4>
                          <p className="text-sm text-muted-foreground">Include CharityZ in your will or estate planning.</p>
                        </div>
                        <div className="border-l-4 border-primary pl-4">
                          <h4 className="font-medium">International Transfers</h4>
                          <p className="text-sm text-muted-foreground">We accept donations from anywhere in the world via secure payment processing.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-card bg-gradient-to-br from-primary/5 to-secondary/5">
                    <CardContent className="p-6 text-center">
                      <Shield className="w-8 h-8 mx-auto mb-3 text-primary" />
                      <h3 className="font-semibold mb-2">100% Secure Donations</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        All transactions are processed securely through Paystack with end-to-end encryption.
                      </p>
                      <div className="flex justify-center items-center space-x-2 text-xs text-muted-foreground">
                        <span>🌍 Global Payments</span>
                        <span>•</span>
                        <span>📱 Mobile Money</span>
                        <span>•</span>
                        <span>💳 All Cards</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Volunteer Tab */}
            <TabsContent value="volunteer" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Become a Volunteer</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Share your skills, time, and passion to directly impact communities in need.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle>Volunteer Application</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Input 
                            placeholder="First Name" 
                            value={volunteerForm.firstName}
                            onChange={(e) => setVolunteerForm(prev => ({ ...prev, firstName: e.target.value }))}
                            required
                          />
                          <Input 
                            placeholder="Last Name"
                            value={volunteerForm.lastName}
                            onChange={(e) => setVolunteerForm(prev => ({ ...prev, lastName: e.target.value }))}
                            required
                          />
                        </div>
                        <Input 
                          placeholder="Email Address" 
                          type="email"
                          value={volunteerForm.email}
                          onChange={(e) => setVolunteerForm(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                        <Input 
                          placeholder="Phone Number" 
                          type="tel"
                          value={volunteerForm.phone}
                          onChange={(e) => setVolunteerForm(prev => ({ ...prev, phone: e.target.value }))}
                        />
                        <Input 
                          placeholder="Location/City"
                          value={volunteerForm.address}
                          onChange={(e) => setVolunteerForm(prev => ({ ...prev, address: e.target.value }))}
                        />
                        
                        <div>
                          <label className="text-sm font-medium mb-2 block">Areas of Interest</label>
                          <div className="space-y-2">
                            {["Field Work", "Administrative", "Event Planning", "Social Media", "Fundraising", "Education"].map(area => (
                              <div key={area} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={area}
                                  checked={volunteerForm.areasOfInterest.includes(area)}
                                  onCheckedChange={(checked) => handleInterestChange(area, checked as boolean)}
                                />
                                <label htmlFor={area} className="text-sm">{area}</label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Availability</label>
                          <Select value={volunteerForm.availability} onValueChange={(value) => setVolunteerForm(prev => ({ ...prev, availability: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your availability" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="weekends">Weekends only</SelectItem>
                              <SelectItem value="weekdays">Weekday evenings</SelectItem>
                              <SelectItem value="flexible">Flexible schedule</SelectItem>
                              <SelectItem value="full-time">Full-time commitment</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Textarea 
                          placeholder="Tell us about your skills, experience, and why you want to volunteer with Charity Z..." 
                          rows={4}
                          value={volunteerForm.skillsExperience}
                          onChange={(e) => setVolunteerForm(prev => ({ ...prev, skillsExperience: e.target.value }))}
                        />

                        <Button type="submit" className="w-full" disabled={volunteerForm.isSubmitting}>
                          <Users className="w-4 h-4 mr-2" />
                          {volunteerForm.isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <img
                      src={volunteersImage}
                      alt="Volunteers in action"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Users className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="text-xl font-bold">Join Our Community</h3>
                        <p>200+ active volunteers worldwide</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {volunteerOpportunities.map((opportunity, index) => (
                      <Card key={index} className="shadow-card">
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">{opportunity.title}</h4>
                          <div className="space-y-1 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {opportunity.location}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {opportunity.commitment}
                            </div>
                          </div>
                          <p className="text-sm mb-3">{opportunity.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {opportunity.skills.map(skill => (
                              <span key={skill} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Membership Tab */}
            <TabsContent value="membership" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Become a Member</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Join our community of changemakers and have a voice in shaping our mission.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="w-5 h-5 mr-2 text-primary" />
                      Membership Application
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleMemberSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input 
                          placeholder="First Name" 
                          value={memberForm.firstName}
                          onChange={(e) => setMemberForm(prev => ({ ...prev, firstName: e.target.value }))}
                          required
                        />
                        <Input 
                          placeholder="Last Name"
                          value={memberForm.lastName}
                          onChange={(e) => setMemberForm(prev => ({ ...prev, lastName: e.target.value }))}
                          required
                        />
                      </div>
                      <Input 
                        placeholder="Email Address" 
                        type="email"
                        value={memberForm.email}
                        onChange={(e) => setMemberForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                      <Input 
                        placeholder="Phone Number" 
                        type="tel"
                        value={memberForm.phone}
                        onChange={(e) => setMemberForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                      <Input 
                        placeholder="Organization (Optional)"
                        value={memberForm.organization}
                        onChange={(e) => setMemberForm(prev => ({ ...prev, organization: e.target.value }))}
                      />
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Membership Type</label>
                        <Select 
                          value={memberForm.membershipType} 
                          onValueChange={(value) => setMemberForm(prev => ({ ...prev, membershipType: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select membership type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Individual Membership - GH₵200/year</SelectItem>
                            <SelectItem value="family">Family Membership - GH₵400/year</SelectItem>
                            <SelectItem value="student">Student Membership - GH₵100/year</SelectItem>
                            <SelectItem value="corporate">Corporate Membership - GH₵2000/year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">How did you hear about us?</label>
                        <Select 
                          value={memberForm.referralSource} 
                          onValueChange={(value) => setMemberForm(prev => ({ ...prev, referralSource: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="social">Social Media</SelectItem>
                            <SelectItem value="friend">Friend/Family</SelectItem>
                            <SelectItem value="event">Event/Workshop</SelectItem>
                            <SelectItem value="website">Website</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Textarea 
                        placeholder="Why do you want to become a member? What are your interests or how would you like to contribute?" 
                        rows={4}
                        value={memberForm.motivations}
                        onChange={(e) => setMemberForm(prev => ({ ...prev, motivations: e.target.value }))}
                      />

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="newsletter"
                            checked={memberForm.newsletter}
                            onCheckedChange={(checked) => setMemberForm(prev => ({ ...prev, newsletter: checked as boolean }))}
                          />
                          <label htmlFor="newsletter" className="text-sm">Subscribe to our newsletter</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="events"
                            checked={memberForm.events}
                            onCheckedChange={(checked) => setMemberForm(prev => ({ ...prev, events: checked as boolean }))}
                          />
                          <label htmlFor="events" className="text-sm">Notify me about upcoming events</label>
                        </div>
                      </div>

                      <Button type="submit" className="w-full" size="lg" disabled={memberForm.isSubmitting}>
                        <Users className="w-4 h-4 mr-2" />
                        {memberForm.isSubmitting ? 'Submitting...' : 'Join as Member'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle>Membership Benefits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {membershipBenefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <ArrowRight className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                            <span className="text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="shadow-card bg-primary text-primary-foreground">
                    <CardContent className="p-6 text-center">
                      <Heart className="w-12 h-12 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Make a Difference</h3>
                      <p className="text-primary-foreground/90">
                        As a member, you're not just supporting our cause—you're actively shaping it. 
                        Your voice matters in our mission to create positive change.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default GetInvolved;