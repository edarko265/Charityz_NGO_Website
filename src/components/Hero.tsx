import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users, Briefcase } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Community hands coming together"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
      </div>

      <div className="container relative z-10 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Making a
            <span className="text-primary-foreground block">
              Difference Together
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in delay-300">
            Join Charity Z in creating positive change in communities worldwide. 
            Every contribution, big or small, makes a meaningful impact.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-500">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-hover">
              <Heart className="w-5 h-5 mr-2" />
              Donate Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <Users className="w-5 h-5 mr-2" />
              Get Involved
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-scale-in delay-700">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-white/80">Lives Impacted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-white/80">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">200+</div>
              <div className="text-white/80">Volunteers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-float">
        <Button variant="ghost" className="text-white hover:bg-white/10">
          <Briefcase className="w-4 h-4 mr-2" />
          View Our Impact
        </Button>
      </div>
    </section>
  );
};

export default Hero;