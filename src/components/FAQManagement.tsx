import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit, Trash2, Plus } from 'lucide-react';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
}

const categories = [
  'donations',
  'volunteering',
  'programs',
  'transparency',
  'partnership',
  'general'
];

const FAQManagement = () => {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    category: 'general',
    question: '',
    answer: '',
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchFAQItems();
  }, []);

  const fetchFAQItems = async () => {
    try {
      const { data, error } = await supabase
        .from('faq_items')
        .select('*')
        .order('category')
        .order('display_order');

      if (error) throw error;
      setFaqItems(data || []);
    } catch (error) {
      console.error('Error fetching FAQ items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load FAQ items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      category: 'general',
      question: '',
      answer: '',
      display_order: 0,
      is_active: true,
    });
    setEditingItem(null);
  };

  const handleEdit = (item: FAQItem) => {
    setEditingItem(item);
    setFormData({
      category: item.category,
      question: item.question,
      answer: item.answer,
      display_order: item.display_order,
      is_active: item.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('faq_items')
          .update(formData)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'FAQ item updated successfully' });
      } else {
        const { error } = await supabase
          .from('faq_items')
          .insert([formData]);

        if (error) throw error;
        toast({ title: 'Success', description: 'FAQ item created successfully' });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchFAQItems();
    } catch (error) {
      console.error('Error saving FAQ item:', error);
      toast({
        title: 'Error',
        description: 'Failed to save FAQ item',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ item?')) return;

    try {
      const { error } = await supabase
        .from('faq_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Success', description: 'FAQ item deleted successfully' });
      fetchFAQItems();
    } catch (error) {
      console.error('Error deleting FAQ item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete FAQ item',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const groupedFAQs = faqItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">FAQ Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add FAQ Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit FAQ Item' : 'Add New FAQ Item'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Enter the FAQ question"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  rows={6}
                  placeholder="Enter the FAQ answer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmit}>
                  {editingItem ? 'Update' : 'Create'} FAQ Item
                </Button>
                <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedFAQs).map(([category, items]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="capitalize">{category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{item.question}</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Order: {item.display_order} | Status: {item.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
        {Object.keys(groupedFAQs).length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No FAQ items yet. Click "Add FAQ Item" to create one.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FAQManagement;
