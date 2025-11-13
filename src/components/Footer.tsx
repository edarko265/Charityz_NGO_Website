import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import { Icon } from "lucide-react";
import { MessageCircle } from "lucide-react";
import charityLogo from "@/assets/charity-z-logo.jpg";
import NewsletterSignup from "@/components/NewsletterSignup";

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
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/10 p-2"
                asChild
              >
                <a href="https://www.facebook.com/charityzgh" target="_blank" rel="noopener noreferrer">
                  <Facebook className="w-4 h-4" />
                </a>
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/10 p-2"
                asChild
              >
                <a href="https://www.instagram.com/charityzgh" target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-4 h-4" />
                </a>
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/10 p-2"
                asChild
              >
                <a href="https://www.tiktok.com/@charityz_25" target="_blank" rel="noopener noreferrer">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/10 p-2"
                asChild
              >
                <a href="https://whatsapp.com/channel/0029VbAenDRBlHpUGlGk1G39" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4" />
                </a>
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/10 p-2"
                asChild
              >
                <a href="https://www.linkedin.com/company/109674189" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4" />
                </a>
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
            
            <NewsletterSignup variant="footer" />
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
              <span>© 2025 Charity Z. All rights reserved.</span>
              <div className="flex items-center space-x-1">
                <span>Made by</span>
                <a 
                  href="https://ericdarko.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Eric Darko
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;