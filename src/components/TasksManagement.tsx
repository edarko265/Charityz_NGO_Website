import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Calendar, User, ClipboardList } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to: string | null;
  assigned_to_name: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

interface Assignee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  type: 'volunteer' | 'member';
}

const TasksManagement = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: null as string | null,
    status: 'pending' as 'pending' | 'in_progress' | 'completed' | 'cancelled',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    due_date: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
    fetchAssignees();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          assigned_to,
          status,
          priority,
          due_date,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Format the tasks with assignee names
      const tasksWithNames = await Promise.all(
        (data || []).map(async (task) => {
          let assigned_to_name = null;
          
          if (task.assigned_to) {
            // Try to find in volunteers first
            const volunteer = assignees.find(a => a.id === task.assigned_to && a.type === 'volunteer');
            if (volunteer) {
              assigned_to_name = `${volunteer.first_name} ${volunteer.last_name}`;
            } else {
              // Try to find in members
              const member = assignees.find(a => a.id === task.assigned_to && a.type === 'member');
              if (member) {
                assigned_to_name = `${member.first_name} ${member.last_name}`;
              }
            }
          }
          
          return {
            ...task,
            assigned_to_name,
            status: task.status as 'pending' | 'in_progress' | 'completed' | 'cancelled',
            priority: task.priority as 'low' | 'medium' | 'high' | 'urgent'
          };
        })
      );

      setTasks(tasksWithNames);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks',
        variant: 'destructive',
      });
    }
  };

  const fetchAssignees = async () => {
    try {
      // Fetch volunteers
      const { data: volunteersData, error: volunteersError } = await supabase
        .from('volunteers')
        .select('id, first_name, last_name, email')
        .eq('status', 'approved');

      if (volunteersError) throw volunteersError;

      // Fetch members
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('id, first_name, last_name, email')
        .eq('status', 'active');

      if (membersError) throw membersError;

      // Combine volunteers and members with type indicator
      const combinedAssignees: Assignee[] = [
        ...(volunteersData || []).map(v => ({ ...v, type: 'volunteer' as const })),
        ...(membersData || []).map(m => ({ ...m, type: 'member' as const }))
      ];

      setAssignees(combinedAssignees);
    } catch (error) {
      console.error('Error fetching assignees:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch volunteers and members',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTask) {
        // Update existing task
        const { error } = await supabase
          .from('tasks')
          .update({
            title: formData.title,
            description: formData.description,
            assigned_to: formData.assigned_to || null,
            status: formData.status,
            priority: formData.priority,
            due_date: formData.due_date || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingTask.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Task updated successfully',
        });
      } else {
        // Create new task
        const { error } = await supabase
          .from('tasks')
          .insert({
            title: formData.title,
            description: formData.description,
            assigned_to: formData.assigned_to || null,
            assigned_by: (await supabase.auth.getUser()).data.user?.id,
            status: formData.status,
            priority: formData.priority,
            due_date: formData.due_date || null,
          });

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Task created successfully',
        });
      }
      
      setIsDialogOpen(false);
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        assigned_to: null,
        status: 'pending',
        priority: 'medium',
        due_date: '',
      });
      
      // Refresh tasks list
      await fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      toast({
        title: 'Error',
        description: 'Failed to save task',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assigned_to: task.assigned_to,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });
      await fetchTasks(); // Refresh the tasks list
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      });
    }
  };

  const openCreateDialog = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      assigned_to: null,
      status: 'pending',
      priority: 'medium',
      due_date: '',
    });
    setIsDialogOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'default';
      case 'pending': return 'secondary';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <div className="text-center">Loading tasks...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Tasks Management</h2>
          <p className="text-muted-foreground">
            Assign and manage tasks for your volunteers.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Assign Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTask ? 'Edit Task' : 'Assign New Task'}
              </DialogTitle>
              <DialogDescription>
                Fill in the details for the {editingTask ? 'updated' : 'new'} task assignment.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assigned_to">Assign to</Label>
                  <Select
                    value={formData.assigned_to || ''}
                    onValueChange={(value) => setFormData({ ...formData, assigned_to: value || null })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select volunteer or member" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignees.map((assignee) => (
                        <SelectItem key={assignee.id} value={assignee.id}>
                          {assignee.first_name} {assignee.last_name} ({assignee.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTask ? 'Update Task' : 'Assign Task'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="flex items-center space-x-2">
                    <ClipboardList className="h-5 w-5" />
                    <span>{task.title}</span>
                  </CardTitle>
                  <CardDescription>{task.description}</CardDescription>
                  <div className="flex space-x-2">
                    <Badge variant={getStatusColor(task.status)}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
                    </Badge>
                    <Badge variant={getPriorityColor(task.priority)}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </Badge>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(task)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(task.id)}
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>Assigned to: {task.assigned_to_name || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {tasks.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                No tasks assigned yet. Create your first task assignment!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TasksManagement;