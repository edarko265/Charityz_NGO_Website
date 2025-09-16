import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Bot, User, Heart, Users, Briefcase, Mail } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm Charity Z's assistant. How can I help you today? You can ask me about our projects, how to get involved, or anything else!",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedResponses = {
    donation: {
      keywords: ["donate", "donation", "money", "give", "contribute", "support financially"],
      response: "Thank you for your interest in supporting Charity Z! 💝 You can make a donation through our secure donation portal. Every contribution, no matter the size, makes a real difference in the communities we serve. Would you like me to direct you to our donation page?"
    },
    volunteer: {
      keywords: ["volunteer", "help", "time", "work", "contribute time", "get involved"],
      response: "We'd love to have you volunteer with us! 🙋‍♀️ We have opportunities ranging from field work to administrative support, event planning, and skill-based volunteering. You can sign up through our volunteer portal and we'll match you with opportunities that fit your schedule and interests."
    },
    membership: {
      keywords: ["member", "membership", "join", "become member"],
      response: "Becoming a member of Charity Z means joining our community of changemakers! 🤝 Members receive monthly newsletters, can vote on key initiatives, attend exclusive events, and get special recognition. It's a great way to stay connected with our mission."
    },
    projects: {
      keywords: ["project", "work", "what do you do", "initiatives", "programs"],
      response: "Charity Z focuses on sustainable community development! 🌍 Our current projects include clean water initiatives in Kenya, education programs in Guatemala, and healthcare centers in the Philippines. Each project is designed with community input to ensure lasting impact."
    },
    contact: {
      keywords: ["contact", "email", "phone", "address", "reach", "get in touch"],
      response: "You can reach us at: 📞 Phone: +1 (555) 123-4567 📧 Email: info@charityz.org 📍 Address: 123 Hope Street, City, State 12345. Our team typically responds within 24 hours!"
    },
    about: {
      keywords: ["about", "who are you", "what is charity z", "mission", "vision"],
      response: "Charity Z is dedicated to creating positive change through compassionate action and sustainable community development. 🌟 Our mission is to empower communities by addressing basic needs, education, and economic development. We believe everyone deserves hope, opportunity, and dignity."
    },
    events: {
      keywords: ["event", "events", "activities", "calendar", "upcoming"],
      response: "We regularly host fundraising events, volunteer appreciation gatherings, and community awareness programs! 📅 Check our events page for upcoming activities. We'd love to see you at our next event!"
    },
    default: "I'd be happy to help you with information about Charity Z! You can ask me about donations, volunteering, membership, our projects, contact information, or upcoming events. What would you like to know more about? 😊"
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (key !== 'default' && typeof response === 'object' && response.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return response.response;
      }
    }
    
    return predefinedResponses.default;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputMessage),
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: Heart, text: "How to donate?", message: "How can I make a donation?" },
    { icon: Users, text: "Volunteer with us", message: "I want to volunteer" },
    { icon: Briefcase, text: "Our projects", message: "Tell me about your projects" },
    { icon: Mail, text: "Contact info", message: "How can I contact you?" },
  ];

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-hover z-50 transition-all duration-300 ${
          isOpen ? "scale-0" : "scale-100"
        }`}
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Interface */}
      <div
        className={`fixed bottom-6 right-6 w-80 h-96 z-50 transition-all duration-300 ease-out ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <Card className="h-full shadow-hover border-0 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-hero p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold">Charity Z Assistant</h3>
                  <p className="text-xs text-white/80">Always here to help</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/10 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 h-64">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[85%] ${
                      message.isBot ? "flex-row" : "flex-row-reverse space-x-reverse"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        message.isBot
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {message.isBot ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    </div>
                    <div
                      className={`px-3 py-2 rounded-lg text-sm ${
                        message.isBot
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <div className="bg-muted px-3 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce delay-100" />
                        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs justify-start"
                      onClick={() => {
                        setInputMessage(action.message);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                    >
                      <Icon className="w-3 h-3 mr-1" />
                      {action.text}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                size="sm"
                disabled={!inputMessage.trim() || isTyping}
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Chatbot;