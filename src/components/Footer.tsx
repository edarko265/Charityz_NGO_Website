import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import charityLogo from "@/assets/charity-z-logo.jpg";

const Footer = () => {
  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Our Projects", href: "/projects" },
    { name: "Events", href: "/events" },
    { name: "News", href: "/news" },
  ];

  const getInvolved = [
    { name: "Donate", href: "/donate" },
    { name: "Volunteer", href: "/volunteer" },
    { name: "Become a Member", href: "/membership" },
    { name: "Corporate Partnership", href: "/partnerships" },
  ];

  const legal = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Annual Reports", href: "/reports" },
    { name: "Transparency", href: "/transparency" },
  ];

  return (
    <footer className="bg-charity-brown text-white">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img 
                src={charityLogo} 
                alt="Charity Z Logo" 
                className="h-10 w-10 object-contain bg-white rounded-full p-1"
              />
              <span className="font-bold text-xl">Charity Z</span>
            </Link>
            <p className="text-white/80 mb-6">
              Making a difference together through compassionate action and 
              sustainable community development worldwide.
            </p>
            <div className="flex space-x-4">
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 p-2">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 p-2">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 p-2">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 p-2">
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="font-semibold mb-4">Get Involved</h4>
            <ul className="space-y-3">
              {getInvolved.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-sm text-white/80">
                <Mail className="w-4 h-4" />
                <span>info@charityz.org</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-white/80">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-white/80">
                <MapPin className="w-4 h-4" />
                <span>123 Hope Street, City, State 12345</span>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium mb-3">Stay Updated</h5>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Your email" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-6">
              {legal.map((link) => (
                <Link 
                  key={link.name}
                  to={link.href} 
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-white/60">
              <span>© 2024 Charity Z. All rights reserved.</span>
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-primary" />
                <span>for communities worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;