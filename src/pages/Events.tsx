import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Clock, Users, DollarSign, Heart, Camera, Award, Music } from "lucide-react";
import volunteersImage from "@/assets/volunteers-helping.jpg";
import projectsImage from "@/assets/projects-impact.jpg";

const Events = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Annual Charity Gala",
      date: "2024-04-15",
      time: "7:00 PM - 11:00 PM",
      location: "Grand Ballroom, City Center Hotel",
      description: "Join us for an elegant evening of fundraising, entertainment, and community celebration.",
      image: volunteersImage,
      type: "fundraising",
      price: 150,
      capacity: 200,
      registered: 145,
      highlights: [
        "Keynote speaker: Dr. Maria Santos",
        "Silent auction with amazing prizes",
        "Live music and entertainment",
        "Three-course gourmet dinner"
      ]
    },
    {
      id: 2,
      title: "Community Volunteer Day",
      date: "2024-04-20",
      time: "9:00 AM - 4:00 PM",
      location: "Various locations citywide",
      description: "Make a difference in your local community through hands-on volunteer activities.",
      image: projectsImage,
      type: "volunteer",
      price: 0,
      capacity: 100,
      registered: 67,
      highlights: [
        "Park cleanup and beautification",
        "Food packaging for families in need",
        "Reading to children at local library",
        "Lunch and volunteer appreciation"
      ]
    },
    {
      id: 3,
      title: "Educational Workshop: Water Crisis",
      date: "2024-04-25",
      time: "2:00 PM - 5:00 PM",
      location: "Community Center, Main Street",
      description: "Learn about global water challenges and how you can make a difference.",
      image: volunteersImage,
      type: "educational",
      price: 25,
      capacity: 50,
      registered: 32,
      highlights: [
        "Expert presentations on water scarcity",
        "Interactive demonstrations",
        "Q&A with field coordinators",
        "Light refreshments included"
      ]
    },
    {
      id: 4,
      title: "5K Run for Clean Water",
      date: "2024-05-10",
      time: "8:00 AM - 12:00 PM",
      location: "City Park Running Trail",
      description: "Run for a cause! All proceeds go directly to our clean water initiatives.",
      image: projectsImage,
      type: "fundraising",
      price: 35,
      capacity: 300,
      registered: 156,
      highlights: [
        "5K and 1K fun run options",
        "Medals for all finishers",
        "Post-race celebration",
        "Family-friendly activities"
      ]
    }
  ];

  const pastEvents = [
    {
      id: 5,
      title: "Holiday Charity Concert",
      date: "2023-12-15",
      location: "City Auditorium",
      description: "A magical evening of music that raised $25,000 for our education programs.",
      image: volunteersImage,
      type: "fundraising",
      raised: 25000,
      attendance: 400
    },
    {
      id: 6,
      title: "Thanksgiving Food Drive",
      date: "2023-11-20",
      location: "Multiple locations",
      description: "Community-wide food collection that provided meals for 500 families.",
      image: projectsImage,
      type: "volunteer",
      raised: 0,
      attendance: 150
    },
    {
      id: 7,
      title: "Annual Golf Tournament",
      date: "2023-09-08",
      location: "Greenview Golf Club",
      description: "Perfect weather and generous sponsors helped us raise $40,000.",
      image: volunteersImage,
      type: "fundraising",
      raised: 40000,
      attendance: 120
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "fundraising": return "bg-primary text-primary-foreground";
      case "volunteer": return "bg-green-500 text-white";
      case "educational": return "bg-blue-500 text-white";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "fundraising": return DollarSign;
      case "volunteer": return Users;
      case "educational": return Award;
      default: return Calendar;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Events & Activities
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto animate-fade-in delay-300">
            Join our community events, fundraisers, and volunteer activities to make a difference together
          </p>
        </div>
      </section>

      {/* Events Tabs */}
      <section className="py-20">
        <div className="container">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Join Us Soon!</h2>
                <p className="text-xl text-muted-foreground">
                  Don't miss these upcoming opportunities to get involved
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {upcomingEvents.map((event, index) => {
                  const Icon = getEventIcon(event.type);
                  return (
                    <Card key={event.id} className="overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 150}ms`}}>
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className={getEventTypeColor(event.type)}>
                            <Icon className="w-3 h-3 mr-1" />
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </Badge>
                        </div>
                        {event.price === 0 && (
                          <div className="absolute top-4 right-4">
                            <Badge variant="outline" className="bg-green-500 text-white border-green-500">
                              FREE
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <CardHeader>
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(event.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {event.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.location}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{event.description}</p>
                        
                        <div className="space-y-3 mb-4">
                          <h4 className="font-semibold">Event Highlights:</h4>
                          <ul className="space-y-1">
                            {event.highlights.map((highlight, idx) => (
                              <li key={idx} className="flex items-center text-sm">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex justify-between items-center mb-4 text-sm">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{event.registered}/{event.capacity} registered</span>
                          </div>
                          {event.price > 0 && (
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              <span>${event.price}</span>
                            </div>
                          )}
                        </div>
                        
                        <Button className="w-full">
                          <Heart className="w-4 h-4 mr-2" />
                          Register Now
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="past" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Our Impact Together</h2>
                <p className="text-xl text-muted-foreground">
                  Look back at the amazing events we've shared
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.map((event, index) => {
                  const Icon = getEventIcon(event.type);
                  return (
                    <Card key={event.id} className="overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 150}ms`}}>
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className={getEventTypeColor(event.type)}>
                            <Icon className="w-3 h-3 mr-1" />
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </Badge>
                        </div>
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <Camera className="w-5 h-5" />
                        </div>
                      </div>
                      
                      <CardHeader>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(event.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{event.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              Attendance
                            </span>
                            <span className="font-medium">{event.attendance} people</span>
                          </div>
                          {event.raised > 0 && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                Funds Raised
                              </span>
                              <span className="font-medium text-green-600">${event.raised.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-warm">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Subscribe to our newsletter to be the first to know about upcoming events and volunteer opportunities
          </p>
          <div className="max-w-md mx-auto flex space-x-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button>
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default Events;