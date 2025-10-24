import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MapPin, Users, Calendar, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectImage {
  url: string;
  isPrimary: boolean;
}

interface Project {
  id: string;
  title: string;
  location: string;
  description: string;
  category: string;
  status: string;
  progress: number;
  beneficiaries: number;
  start_date: string;
  budget: number | null;
  raised: number;
  images: ProjectImage[];
  primary_image_url: string | null;
}

interface ProjectDetailModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProjectDetailModal = ({ project, open, onOpenChange }: ProjectDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!project) return null;

  const images = project.images.length > 0 ? project.images : [{ url: project.primary_image_url || '', isPrimary: true }];
  const validImages = images.filter(img => img.url);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-primary text-primary-foreground';
      case 'Completed':
        return 'bg-green-500 text-white';
      case 'Planning':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) setCurrentImageIndex(0);
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 animate-scale-in">
        <div className="relative">
          {validImages.length > 0 && (
            <div className="relative h-[400px] overflow-hidden">
              <img
                src={validImages[currentImageIndex]?.url}
                alt={project.title}
                className="w-full h-full object-cover animate-fade-in"
                key={currentImageIndex}
              />
              {validImages.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {validImages.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
              <div className="absolute top-4 left-4">
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
            </div>
          )}

          <div className="p-6 space-y-6">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <DialogTitle className="text-3xl font-bold animate-fade-in">
                    {project.title}
                  </DialogTitle>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {project.location}
                  </div>
                </div>
                <Badge variant="outline" className="text-sm">
                  {project.category}
                </Badge>
              </div>
            </DialogHeader>

            <p className="text-foreground leading-relaxed animate-fade-in" style={{ animationDelay: '100ms' }}>
              {project.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-2" />
                  Beneficiaries
                </div>
                <p className="text-2xl font-bold">{project.beneficiaries.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">people impacted</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  Timeline
                </div>
                <p className="text-2xl font-bold">{project.start_date}</p>
                <p className="text-sm text-muted-foreground">project started</p>
              </div>

              {project.budget && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Funding
                  </div>
                  <p className="text-2xl font-bold">
                    ${project.raised.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    of ${project.budget.toLocaleString()} goal
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Project Progress</span>
                <span className="font-bold">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-3" />
            </div>

            <div className="flex gap-3 pt-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <Button asChild className="flex-1">
                <Link to="/get-involved">Support This Project</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link to="/contact">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailModal;
