import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, HelpCircle, Heart, Users, Briefcase, DollarSign, Shield, FileText, Mail, Phone } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const faqCategories = {
    donations: {
      title: "Donations & Giving",
      icon: Heart,
      questions: [
        {
          question: "How do I make a donation?",
          answer: "You can donate online through our secure donation portal, by phone at +1 (555) 123-4567, by mail to our headquarters, or through bank transfer. We accept all major credit cards, PayPal, and bank transfers. All donations are processed securely and you'll receive an immediate confirmation."
        },
        {
          question: "Are my donations tax-deductible?",
          answer: "Yes! Charity Z is a registered 501(c)(3) non-profit organization (Tax ID: 12-3456789). All donations are tax-deductible to the full extent allowed by law. You'll receive a tax receipt immediately after your donation, and we'll send an annual summary for your records."
        },
        {
          question: "How much of my donation goes directly to programs?",
          answer: "85% of every donation goes directly to our programs and projects. The remaining 15% covers essential administrative costs and fundraising expenses. We're proud of our low overhead and publish detailed financial reports annually for complete transparency."
        },
        {
          question: "Can I designate my donation for a specific project?",
          answer: "Absolutely! When making a donation, you can choose to direct your gift to specific areas like clean water projects, education programs, healthcare initiatives, or emergency relief. You can also choose 'where needed most' to give us flexibility to address urgent needs."
        },
        {
          question: "Do you accept recurring donations?",
          answer: "Yes, we offer monthly, quarterly, and annual recurring donation options. Recurring donors are vital to our sustainability and receive special updates about long-term project progress. You can modify or cancel your recurring donation at any time."
        },
        {
          question: "How do I track the impact of my donation?",
          answer: "We provide quarterly impact reports to all donors showing exactly how contributions are being used. You'll receive project updates, photos from the field, and measurable outcomes. Major donors (GH₵4,000+) receive personalized impact reports and invitations to visit project sites."
        }
      ]
    },
    volunteering: {
      title: "Volunteering",
      icon: Users,
      questions: [
        {
          question: "What volunteer opportunities are available?",
          answer: "We offer both local and international volunteer opportunities including field work, administrative support, event planning, social media management, fundraising assistance, and professional skills-based volunteering. Opportunities range from one-time events to long-term commitments."
        },
        {
          question: "Do I need special qualifications to volunteer?",
          answer: "Most volunteer positions don't require special qualifications - just enthusiasm and commitment! For specialized roles (medical, engineering, education), we do require relevant qualifications and certifications. We provide training and orientation for all volunteers."
        },
        {
          question: "Can I volunteer remotely?",
          answer: "Yes! We have many remote volunteer opportunities including social media management, grant writing, graphic design, virtual fundraising, data entry, and online tutoring. Remote volunteers are essential to our operations and receive the same support and recognition as field volunteers."
        },
        {
          question: "What is the time commitment for volunteering?",
          answer: "Time commitments vary widely. We have opportunities ranging from 2-3 hours for one-time events to full-time positions for international field work. Most ongoing volunteer roles require 5-10 hours per week, but we're flexible and work with your schedule."
        },
        {
          question: "Do you provide travel and accommodation for international volunteers?",
          answer: "For international field positions longer than 3 months, we provide accommodation and a modest living stipend. Volunteers are responsible for their own flights, but we assist with visa applications and provide comprehensive pre-departure training and orientation."
        },
        {
          question: "How do I apply to volunteer?",
          answer: "Complete our online volunteer application form, including your interests, skills, and availability. We'll review your application and contact you within a week to discuss opportunities that match your profile. Background checks are required for certain positions."
        }
      ]
    },
    projects: {
      title: "Projects & Impact",
      icon: Briefcase,
      questions: [
        {
          question: "How do you choose which projects to support?",
          answer: "Projects are selected based on community needs assessments, sustainability potential, and alignment with our mission. We partner with local organizations and communities to identify priorities. Every project must have community buy-in and a plan for long-term sustainability."
        },
        {
          question: "How do you ensure projects are sustainable?",
          answer: "Sustainability is built into every project from day one. We work with local communities to ensure they have the knowledge, skills, and resources to maintain projects independently. We provide training, establish local management committees, and maintain follow-up support for 2-3 years post-completion."
        },
        {
          question: "Can I visit your project sites?",
          answer: "Yes! We organize donor and volunteer trips to project sites 2-3 times per year. These trips provide firsthand insight into our work and impact. We also welcome individual visits by appointment - contact us at least 8 weeks in advance to arrange a site visit."
        },
        {
          question: "How do you measure project success?",
          answer: "We use specific, measurable indicators for each project type: clean water projects track coverage and health outcomes, education projects monitor enrollment and literacy rates, healthcare projects measure treatment statistics and health improvements. We conduct baseline and follow-up assessments for all projects."
        },
        {
          question: "What happens if a project doesn't meet its goals?",
          answer: "We regularly monitor all projects and adjust strategies as needed. If a project faces challenges, we work with communities to identify solutions or modify approaches. In rare cases where projects aren't viable, we reallocate resources responsibly and inform all stakeholders transparently."
        },
        {
          question: "Do you work with local governments?",
          answer: "Yes, we collaborate with local and national governments when appropriate while maintaining our independence. Government partnerships help ensure projects align with national development priorities and can access additional resources. We always maintain transparency about any government relationships."
        }
      ]
    },
    membership: {
      title: "Membership",
      icon: Shield,
      questions: [
        {
          question: "What are the benefits of membership?",
          answer: "Members receive monthly newsletters, voting rights on key decisions, access to exclusive events, priority registration for volunteer opportunities, annual member appreciation dinners, and special recognition in our publications. It's the best way to stay deeply connected with our mission."
        },
        {
          question: "How much does membership cost?",
          answer: "Individual membership is GH₵200/year, family membership is GH₵400/year, student membership is GH₵100/year, and corporate membership is GH₵2000/year. Membership fees are tax-deductible and help support our core operations and member benefits."
        },
        {
          question: "What voting rights do members have?",
          answer: "Members vote on major policy decisions, board elections, and strategic direction. We hold an annual member meeting where key decisions are presented for voting. Members also provide input on project priorities and organizational policies through surveys and focus groups."
        },
        {
          question: "Can I cancel my membership?",
          answer: "Yes, you can cancel your membership at any time with 30 days notice. There are no cancellation fees. If you cancel mid-year, we don't provide prorated refunds, but you'll continue to receive member benefits through the end of your membership period."
        },
        {
          question: "Do members get special recognition?",
          answer: "Yes! Members are recognized in our annual report, receive special member badges for events, get priority seating at our annual gala, and receive personalized thank you notes from beneficiaries. Long-term members (5+ years) receive special lifetime achievement recognition."
        }
      ]
    },
    operations: {
      title: "Operations & Transparency",
      icon: FileText,
      questions: [
        {
          question: "How is Charity Z governed?",
          answer: "We're governed by a volunteer Board of Directors elected by our members. The board provides strategic oversight while our professional staff manages day-to-day operations. We follow all legal requirements for non-profit governance and maintain transparent decision-making processes."
        },
        {
          question: "Where can I see your financial reports?",
          answer: "Our annual financial reports, IRS Form 990, and independent audit results are available on our website and through charity evaluation sites like GuideStar and Charity Navigator. We believe in complete financial transparency and welcome questions about our finances."
        },
        {
          question: "Are you rated by charity watchdog organizations?",
          answer: "Yes, we maintain 4-star ratings from Charity Navigator and are accredited by the Better Business Bureau Wise Giving Alliance. These independent evaluations assess our financial health, accountability, and transparency. We're proud of our high ratings and work continuously to maintain them."
        },
        {
          question: "How do you ensure accountability in your programs?",
          answer: "We have rigorous monitoring and evaluation systems for all programs. Independent evaluators assess our projects, we conduct regular audits, maintain detailed financial records, and publish annual impact reports. We also have a whistleblower policy and ethics committee."
        },
        {
          question: "What is your policy on executive compensation?",
          answer: "Executive compensation is set by our board based on industry standards and organizational performance. All compensation information is disclosed in our annual IRS Form 990. We believe in fair compensation that attracts talented leadership while maintaining fiscal responsibility."
        },
        {
          question: "How do you handle complaints or concerns?",
          answer: "We take all concerns seriously. You can submit complaints through our website, email, phone, or mail. We investigate all complaints thoroughly and respond within 10 business days. We also have an anonymous reporting system for sensitive issues."
        }
      ]
    }
  };

  const allQuestions = Object.values(faqCategories).flatMap(category => 
    category.questions.map(q => ({ ...q, category: category.title }))
  );

  const filteredQuestions = searchTerm 
    ? allQuestions.filter(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Frequently Asked Questions
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto animate-fade-in delay-300">
            Find quick answers to common questions about our work, programs, and how you can get involved.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-gradient-warm">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search frequently asked questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            {searchTerm && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                {filteredQuestions.length > 0 
                  ? `Found ${filteredQuestions.length} matching questions`
                  : "No questions found. Try different keywords or browse categories below."
                }
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="container">
          {searchTerm ? (
            /* Search Results */
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-8">Search Results</h2>
              {filteredQuestions.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-4">
                  {filteredQuestions.map((item, index) => (
                    <AccordionItem key={index} value={`search-${index}`} className="border rounded-lg px-6">
                      <AccordionTrigger className="text-left hover:no-underline">
                        <div>
                          <div className="font-medium">{item.question}</div>
                          <div className="text-sm text-muted-foreground mt-1">Category: {item.category}</div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-6">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <HelpCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No results found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try different keywords or browse our categories below.
                    </p>
                    <Button onClick={() => setSearchTerm("")}>
                      Browse All Categories
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            /* Category Tabs */
            <Tabs defaultValue="donations" className="max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-12">
                {Object.entries(faqCategories).map(([key, category]) => {
                  const Icon = category.icon;
                  return (
                    <TabsTrigger key={key} value={key} className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{category.title}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {Object.entries(faqCategories).map(([key, category]) => (
                <TabsContent key={key} value={key}>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-4">{category.title}</h2>
                    <p className="text-xl text-muted-foreground">
                      Common questions about {category.title.toLowerCase()}
                    </p>
                  </div>

                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((item, index) => (
                      <AccordionItem key={index} value={`${key}-${index}`} className="border rounded-lg px-6">
                        <AccordionTrigger className="text-left font-medium hover:no-underline">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-6">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-20 bg-gradient-warm">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">By the Numbers</h2>
            <p className="text-xl text-muted-foreground">
              Transparency in action - key facts about our organization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center shadow-card">
              <CardContent className="p-6">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-primary" />
                <div className="text-3xl font-bold mb-2">85%</div>
                <div className="text-sm text-muted-foreground">Goes directly to programs</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-card">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
                <div className="text-3xl font-bold mb-2">4 Stars</div>
                <div className="text-sm text-muted-foreground">Charity Navigator rating</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-card">
              <CardContent className="p-6">
                <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                <div className="text-3xl font-bold mb-2">25,000+</div>
                <div className="text-sm text-muted-foreground">Lives impacted</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-card">
              <CardContent className="p-6">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-primary" />
                <div className="text-3xl font-bold mb-2">15</div>
                <div className="text-sm text-muted-foreground">Countries served</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20">
        <div className="container">
          <Card className="max-w-3xl mx-auto shadow-card">
            <CardContent className="p-8 text-center">
              <HelpCircle className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Our team is here to help with any questions 
                about our work, programs, or how you can get involved.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Us
                </Button>
                <Button size="lg" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Us
                </Button>
              </div>
              <div className="mt-6 text-sm text-muted-foreground">
                We typically respond within 24 hours during business days
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default FAQ;