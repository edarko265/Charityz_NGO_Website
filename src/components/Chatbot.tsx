import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Bot, User, Heart, Users, Briefcase, Mail, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Chatbot = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm Charity Z's AI assistant. I can help you navigate our website, answer questions about our projects, donations, volunteering, and more. What would you like to know?",
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

  const getCurrentPageContext = () => {
    const path = location.pathname;
    const pageContexts: { [key: string]: string } = {
      '/': 'home page with hero section, about, projects, and get involved sections',
      '/about': 'about page with detailed information about Charity Z\'s mission, vision, and team',
      '/projects': 'projects page showing current initiatives and their progress',
      '/get-involved': 'get involved page with donation form, volunteer signup, and membership options',
      '/events': 'events page listing upcoming fundraising and awareness events',
      '/contact': 'contact page with contact information, form, and office locations',
      '/dashboard': 'user dashboard for donors, volunteers, and members',
      '/auth': 'authentication page for login and registration',
      '/faq': 'frequently asked questions page',
      '/partnerships': 'partnerships page showing organizational collaborations'
    };
    
    return pageContexts[path] || `page at ${path}`;
  };

  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const currentPage = getCurrentPageContext();
      const enhancedMessage = `User is currently on the ${currentPage}. User message: ${userMessage}`;
      
      const { data, error } = await supabase.functions.invoke('ai-chatbot', {
        body: { message: enhancedMessage }
      });
      
      if (error) throw error;
      return data.reply;
    } catch (error) {
      console.error('Error getting AI response:', error);
      throw error;
    }
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
    const currentMessage = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await getAIResponse(currentMessage);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble processing your message right now. Please try again in a moment, or feel free to contact our team directly.",
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorResponse]);
      toast({
        title: "Connection Error",
        description: "Unable to connect to our AI assistant. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: Heart, text: "How to donate?", message: "How can I make a donation to support Charity Z?" },
    { icon: Users, text: "Volunteer with us", message: "I want to volunteer. What opportunities are available?" },
    { icon: Briefcase, text: "Our projects", message: "Tell me about your current projects and initiatives" },
    { icon: Mail, text: "Contact info", message: "How can I contact Charity Z?" },
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
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
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