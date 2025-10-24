import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Edit, Image as ImageIcon, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  images: { url: string; isPrimary: boolean }[];
  primary_image_url: string | null;
}

const ProjectsManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    category: '',
    status: 'Planning',
    progress: 0,
    beneficiaries: 0,
    start_date: '',
    budget: '',
    raised: '',
  });

  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects((data || []).map(p => ({
        ...p,
        images: (p.images as any) || []
      })));
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to load projects',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      description: '',
      category: '',
      status: 'Planning',
      progress: 0,
      beneficiaries: 0,
      start_date: '',
      budget: '',
      raised: '',
    });
    setImageUrls(['']);
    setPrimaryImageIndex(0);
    setEditingProject(null);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      location: project.location,
      description: project.description,
      category: project.category,
      status: project.status,
      progress: project.progress,
      beneficiaries: project.beneficiaries,
      start_date: project.start_date,
      budget: project.budget?.toString() || '',
      raised: project.raised?.toString() || '',
    });
    
    const urls = project.images.map(img => img.url);
    setImageUrls(urls.length > 0 ? urls : ['']);
    const primaryIndex = project.images.findIndex(img => img.isPrimary);
    setPrimaryImageIndex(primaryIndex >= 0 ? primaryIndex : 0);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validImageUrls = imageUrls.filter(url => url.trim() !== '');
    const images = validImageUrls.map((url, index) => ({
      url,
      isPrimary: index === primaryImageIndex,
    }));

    const projectData = {
      ...formData,
      budget: formData.budget ? parseFloat(formData.budget) : null,
      raised: formData.raised ? parseFloat(formData.raised) : 0,
      progress: parseInt(formData.progress.toString()),
      beneficiaries: parseInt(formData.beneficiaries.toString()),
      images,
      primary_image_url: validImageUrls[primaryImageIndex] || null,
    };

    try {
      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Project updated successfully' });
      } else {
        const { error } = await supabase.from('projects').insert([projectData]);

        if (error) throw error;
        toast({ title: 'Success', description: 'Project created successfully' });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: 'Error',
        description: 'Failed to save project',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);

      if (error) throw error;
      toast({ title: 'Success', description: 'Project deleted successfully' });
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      });
    }
  };

  const addImageField = () => {
    if (imageUrls.length < 5) {
      setImageUrls([...imageUrls, '']);
    }
  };

  const removeImageField = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls.length > 0 ? newUrls : ['']);
    if (primaryImageIndex >= newUrls.length) {
      setPrimaryImageIndex(Math.max(0, newUrls.length - 1));
    }
  };

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Water & Sanitation"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="progress">Progress (%)</Label>
                  <Input
                    id="progress"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="beneficiaries">Beneficiaries</Label>
                  <Input
                    id="beneficiaries"
                    type="number"
                    min="0"
                    value={formData.beneficiaries}
                    onChange={(e) => setFormData({ ...formData, beneficiaries: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    placeholder="e.g., March 2024"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="raised">Raised</Label>
                  <Input
                    id="raised"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.raised}
                    onChange={(e) => setFormData({ ...formData, raised: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Images (up to 5)</Label>
                  {imageUrls.length < 5 && (
                    <Button type="button" variant="outline" size="sm" onClick={addImageField}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Image
                    </Button>
                  )}
                </div>
                {imageUrls.map((url, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="Image URL"
                      value={url}
                      onChange={(e) => updateImageUrl(index, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant={primaryImageIndex === index ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setPrimaryImageIndex(index)}
                      title="Set as primary image"
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                    {imageUrls.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeImageField(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProject ? 'Update' : 'Create'} Project
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">{project.title}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(project)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(project.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <p className="font-medium">{project.location}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p className="font-medium">{project.status}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Progress:</span>
                  <p className="font-medium">{project.progress}%</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Beneficiaries:</span>
                  <p className="font-medium">{project.beneficiaries.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectsManagement;
