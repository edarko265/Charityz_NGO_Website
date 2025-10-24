import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit, Save } from 'lucide-react';

interface AboutContent {
  id: string;
  section: string;
  title: string;
  content: string;
  image_url: string | null;
}

const AboutManagement = () => {
  const [aboutSections, setAboutSections] = useState<AboutContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
  });

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .order('section');

      if (error) throw error;
      setAboutSections(data || []);
    } catch (error) {
      console.error('Error fetching about content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load about content',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section: AboutContent) => {
    setEditingSection(section.id);
    setFormData({
      title: section.title,
      content: section.content,
      image_url: section.image_url || '',
    });
  };

  const handleSave = async (sectionId: string, sectionName: string) => {
    try {
      const updateData = {
        title: formData.title,
        content: formData.content,
        image_url: formData.image_url || null,
      };

      const { error } = await supabase
        .from('about_content')
        .upsert({
          id: sectionId,
          section: sectionName,
          ...updateData,
        });

      if (error) throw error;

      toast({ title: 'Success', description: 'About section updated successfully' });
      setEditingSection(null);
      fetchAboutContent();
    } catch (error) {
      console.error('Error saving about content:', error);
      toast({
        title: 'Error',
        description: 'Failed to save about content',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setFormData({ title: '', content: '', image_url: '' });
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
        <h2 className="text-2xl font-bold">About Content Management</h2>
      </div>

      <div className="grid gap-6">
        {aboutSections.map((section) => (
          <Card key={section.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold capitalize">
                {section.section.replace('_', ' ')}
              </CardTitle>
              {editingSection !== section.id && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(section)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {editingSection === section.id ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button onClick={() => handleSave(section.id, section.section)}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold mb-1">{section.title}</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {section.content}
                    </p>
                  </div>
                  {section.image_url && (
                    <div>
                      <span className="text-sm text-muted-foreground">Image: </span>
                      <span className="text-sm">{section.image_url}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AboutManagement;
