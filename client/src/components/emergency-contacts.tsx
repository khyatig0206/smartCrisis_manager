import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertEmergencyContactSchema, type EmergencyContact } from '@shared/schema';
import { z } from 'zod';
import { 
  Plus, 
  Phone, 
  Mail, 
  Star, 
  Edit, 
  Trash2, 
  Users,
  Heart,
  UserCheck
} from 'lucide-react';

const contactFormSchema = insertEmergencyContactSchema.extend({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  relationship: z.string().optional(),
}).omit({ userId: true });

type ContactFormData = z.infer<typeof contactFormSchema>;

export function EmergencyContactsSection() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading } = useQuery<EmergencyContact[]>({
    queryKey: ['/api/emergency-contacts'],
  });

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      relationship: '',
      isPrimary: false,
    },
  });

  const createContactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest('POST', '/api/emergency-contacts', data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Emergency contact added successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/emergency-contacts'] });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ 
        title: 'Failed to add contact', 
        description: 'Please check the information and try again',
        variant: 'destructive' 
      });
    },
  });

  const updateContactMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ContactFormData> }) => {
      const response = await apiRequest('PUT', `/api/emergency-contacts/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Contact updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/emergency-contacts'] });
      setEditingContact(null);
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/emergency-contacts/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Contact deleted successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/emergency-contacts'] });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    if (editingContact) {
      updateContactMutation.mutate({ id: editingContact.id, data });
    } else {
      createContactMutation.mutate(data);
    }
  };

  const handleEdit = (contact: EmergencyContact) => {
    setEditingContact(contact);
    form.reset({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || '',
      relationship: contact.relationship || '',
      isPrimary: Boolean(contact.isPrimary),
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this emergency contact?')) {
      deleteContactMutation.mutate(id);
    }
  };

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship?.toLowerCase()) {
      case 'family':
      case 'parent':
      case 'child':
      case 'spouse':
        return <Heart className="w-4 h-4 text-red-400" />;
      case 'friend':
        return <Users className="w-4 h-4 text-blue-400" />;
      case 'doctor':
      case 'medical':
        return <UserCheck className="w-4 h-4 text-green-400" />;
      default:
        return <Users className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-white">Emergency Contacts</h2>
        <p className="text-slate-400">Manage your emergency contact list for crisis situations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{contacts.length}</p>
                <p className="text-sm text-slate-400">Total Contacts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {contacts.filter((c: any) => c.isPrimary).length}
                </p>
                <p className="text-sm text-slate-400">Primary Contacts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Phone className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {contacts.filter((c: any) => c.phone).length}
                </p>
                <p className="text-sm text-slate-400">With Phone</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Contact Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Contact List</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[hsl(74,100%,40%)] hover:bg-[hsl(74,100%,35%)] text-black">
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingContact ? 'Edit Contact' : 'Add Emergency Contact'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Full Name</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter full name"
                />
                {form.formState.errors.name && (
                  <p className="text-red-400 text-sm mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                <Input
                  id="phone"
                  {...form.register('phone')}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="+1 (555) 000-0000"
                />
                {form.formState.errors.phone && (
                  <p className="text-red-400 text-sm mt-1">{form.formState.errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-white">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="email@example.com"
                />
                {form.formState.errors.email && (
                  <p className="text-red-400 text-sm mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="relationship" className="text-white">Relationship</Label>
                <Select onValueChange={(value) => form.setValue('relationship', value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="spouse">Spouse/Partner</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="neighbor">Neighbor</SelectItem>
                    <SelectItem value="colleague">Colleague</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPrimary"
                  checked={Boolean(form.watch('isPrimary'))}
                  onCheckedChange={(checked) => form.setValue('isPrimary', Boolean(checked))}
                />
                <Label htmlFor="isPrimary" className="text-white">
                  Primary Contact (will be notified first)
                </Label>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={createContactMutation.isPending || updateContactMutation.isPending}
                  className="bg-[hsl(74,100%,40%)] hover:bg-[hsl(74,100%,35%)] text-black flex-1"
                >
                  {editingContact ? 'Update Contact' : 'Add Contact'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingContact(null);
                    form.reset();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Contacts List */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(74,100%,40%)] mx-auto"></div>
              <p className="text-slate-400 mt-2">Loading contacts...</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Emergency Contacts</h3>
              <p className="text-slate-400 mb-4">Add your first emergency contact to get started</p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-[hsl(74,100%,40%)] hover:bg-[hsl(74,100%,35%)] text-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Contact
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {contacts.map((contact: any) => (
                <div
                  key={contact.id}
                  className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-[hsl(74,100%,40%)]/50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-slate-600 rounded-lg">
                        {getRelationshipIcon(contact.relationship)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-white">{contact.name}</h4>
                          {contact.isPrimary && (
                            <Badge className="bg-yellow-600 text-white border-yellow-500">
                              <Star className="w-3 h-3 mr-1" />
                              Primary
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1 text-sm text-slate-300">
                            <Phone className="w-3 h-3" />
                            <span>{contact.phone}</span>
                          </div>
                          {contact.email && (
                            <div className="flex items-center space-x-1 text-sm text-slate-300">
                              <Mail className="w-3 h-3" />
                              <span>{contact.email}</span>
                            </div>
                          )}
                          {contact.relationship && (
                            <Badge variant="outline" className="text-xs">
                              {contact.relationship}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(contact)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(contact.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}