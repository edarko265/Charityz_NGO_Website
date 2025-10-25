import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Send, Plus, X, Link as LinkIcon, Image, FileText, Mail, Calendar, Users, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Newsletter {
  id: string;
  title: string;
  subject: string;
  body: string;
  image_url: string | null;
  links: Array<{ text: string; url: string }>;
  attachment_url: string | null;
  attachment_name: string | null;
  recipient_count: number;
  sent_at: string;
}

interface LinkItem {
  text: string;
  url: string;
}

const NewsletterManagement = () => {
  const { toast } = useToast();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  useEffect(() => {
    fetchNewsletters();
    fetchSubscriberCount();
  }, []);

  const [subscriberCount, setSubscriberCount] = useState(0);

  const fetchSubscriberCount = async () => {
    try {
      const { count, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (error) throw error;
      setSubscriberCount(count || 0);
    } catch (error) {
      console.error('Error fetching subscriber count:', error);
    }
  };

  const fetchNewsletters = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('newsletters')
        .select('*')
        .order('sent_at', { ascending: false });

      if (error) throw error;
      
      // Map the data to properly handle the Json type for links
      const mappedData = (data || []).map(item => ({
        ...item,
        links: Array.isArray(item.links) ? item.links as Array<{ text: string; url: string }> : []
      })) as Newsletter[];
      
      setNewsletters(mappedData);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      toast({
        title: 'Error',
        description: 'Failed to load newsletters',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSubject('');
    setBody('');
    setImageUrl('');
    setLinks([]);
    setAttachmentUrl('');
    setAttachmentName('');
  };

  const addLink = () => {
    setLinks([...links, { text: '', url: '' }]);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: 'text' | 'url', value: string) => {
    const updatedLinks = [...links];
    updatedLinks[index][field] = value;
    setLinks(updatedLinks);
  };

  const handleSendNewsletter = async () => {
    if (!title.trim() || !subject.trim() || !body.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in title, subject, and body',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: {
          title: title.trim(),
          subject: subject.trim(),
          body: body.trim(),
          image_url: imageUrl.trim() || null,
          links: links.filter(link => link.text && link.url),
          attachment_url: attachmentUrl.trim() || null,
          attachment_name: attachmentName.trim() || null,
        }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Newsletter sent to ${data.sent_count} subscribers!`,
      });

      resetForm();
      setIsDialogOpen(false);
      fetchNewsletters();
      fetchSubscriberCount();
    } catch (error: any) {
      console.error('Error sending newsletter:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send newsletter',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Newsletter Management
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Send newsletters and announcements to {subscriberCount} active subscribers
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send Newsletter
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Compose Newsletter</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Newsletter Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Monthly Impact Report"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Email Subject</Label>
                    <Input
                      id="subject"
                      placeholder="What subscribers will see in their inbox"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="body">Body Content</Label>
                    <Textarea
                      id="body"
                      placeholder="Write your newsletter content here..."
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">
                      <Image className="h-4 w-4 inline mr-2" />
                      Featured Image URL (Optional)
                    </Label>
                    <Input
                      id="image"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>
                        <LinkIcon className="h-4 w-4 inline mr-2" />
                        Links (Optional)
                      </Label>
                      <Button type="button" variant="outline" size="sm" onClick={addLink}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Link
                      </Button>
                    </div>
                    {links.map((link, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Link text"
                          value={link.text}
                          onChange={(e) => updateLink(index, 'text', e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          placeholder="URL"
                          value={link.url}
                          onChange={(e) => updateLink(index, 'url', e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLink(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      <FileText className="h-4 w-4 inline mr-2" />
                      Attachment (Optional)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Document/PDF URL"
                        value={attachmentUrl}
                        onChange={(e) => setAttachmentUrl(e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Filename"
                        value={attachmentName}
                        onChange={(e) => setAttachmentName(e.target.value)}
                        className="w-40"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSendNewsletter} disabled={isSending}>
                      {isSending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send to {subscriberCount} Subscribers
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">Loading newsletters...</div>
            </div>
          ) : newsletters.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No newsletters sent yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Click &quot;Send Newsletter&quot; to compose and send your first newsletter.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>
                    <Users className="h-4 w-4 inline mr-1" />
                    Recipients
                  </TableHead>
                  <TableHead>
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Sent Date
                  </TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsletters.map((newsletter) => (
                  <TableRow key={newsletter.id}>
                    <TableCell className="font-medium">{newsletter.title}</TableCell>
                    <TableCell>{newsletter.subject}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{newsletter.recipient_count}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(newsletter.sent_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {newsletter.image_url && (
                          <Badge variant="outline" className="text-xs">
                            <Image className="h-3 w-3 mr-1" />
                            Image
                          </Badge>
                        )}
                        {newsletter.links && newsletter.links.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <LinkIcon className="h-3 w-3 mr-1" />
                            {newsletter.links.length} Links
                          </Badge>
                        )}
                        {newsletter.attachment_url && (
                          <Badge variant="outline" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            Attachment
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterManagement;
