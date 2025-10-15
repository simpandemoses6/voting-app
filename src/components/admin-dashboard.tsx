import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { User, Election, Notification, Screen } from '../App';
import { 
  Users, 
  Vote, 
  Plus, 
  Settings, 
  Bell, 
  LogOut,
  CheckCircle,
  XCircle,
  Calendar as CalendarIcon,
  Edit,
  Trash2,
  BarChart3,
  Clock
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  elections: Election[];
  notifications: Notification[];
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function AdminDashboard({ 
  user, 
  elections, 
  notifications, 
  onNavigate, 
  onLogout 
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('pending');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: '',
    description: '',
    university: user.university,
    department: '',
    startDate: new Date(),
    endDate: new Date(),
    candidates: [{ name: '', manifesto: '', avatar: '' }]
  });

  const pendingRequests = [
    {
      id: '1',
      name: 'Engineering Society President 2024',
      requester: 'John Smith',
      department: 'Engineering',
      reason: 'Annual election for engineering society leadership',
      submittedDate: '2024-03-10'
    },
    {
      id: '2',
      name: 'Student Representative - Arts',
      requester: 'Emily Davis',
      department: 'Liberal Arts',
      reason: 'Representative needed for upcoming semester planning',
      submittedDate: '2024-03-09'
    }
  ];

  const activeElections = elections.filter(e => e.status === 'active');
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const addCandidate = () => {
    setCreateFormData({
      ...createFormData,
      candidates: [...createFormData.candidates, { name: '', manifesto: '', avatar: '' }]
    });
  };

  const removeCandidate = (index: number) => {
    const newCandidates = createFormData.candidates.filter((_, i) => i !== index);
    setCreateFormData({ ...createFormData, candidates: newCandidates });
  };

  const updateCandidate = (index: number, field: string, value: string) => {
    const newCandidates = [...createFormData.candidates];
    newCandidates[index] = { ...newCandidates[index], [field]: value };
    setCreateFormData({ ...createFormData, candidates: newCandidates });
  };

  const handleCreateElection = () => {
    // Mock creation
    console.log('Creating election:', createFormData);
    setShowCreateForm(false);
    setCreateFormData({
      name: '',
      description: '',
      university: user.university,
      department: '',
      startDate: new Date(),
      endDate: new Date(),
      candidates: [{ name: '', manifesto: '', avatar: '' }]
    });
  };

  const handleApproveRequest = (requestId: string) => {
    console.log('Approving request:', requestId);
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Rejecting request:', requestId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-medium">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">{user.username} • {user.department}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('notifications')}
                className="relative"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 max-w-2xl">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Pending Requests */}
          <TabsContent value="pending" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Pending Election Requests</h2>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                {pendingRequests.length} Pending
              </Badge>
            </div>
            
            <div className="grid gap-4">
              {pendingRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium mb-2">{request.name}</h3>
                        <div className="grid gap-2 text-sm text-gray-600 mb-4">
                          <p><strong>Requested by:</strong> {request.requester}</p>
                          <p><strong>Department:</strong> {request.department}</p>
                          <p><strong>Submitted:</strong> {new Date(request.submittedDate).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
                          <p className="text-sm text-gray-600">{request.reason}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleApproveRequest(request.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleRejectRequest(request.id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Active Elections */}
          <TabsContent value="active" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Active Elections</h2>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {activeElections.length} Active
              </Badge>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {activeElections.map((election) => (
                <Card key={election.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{election.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{election.department}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        <Clock className="w-3 h-3 mr-1" />
                        Live
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Total Votes</p>
                        <p className="font-medium text-lg">{election.totalVotes}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Candidates</p>
                        <p className="font-medium text-lg">{election.candidates.length}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Leading Candidate:</p>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={election.candidates[0]?.avatar} />
                          <AvatarFallback>{election.candidates[0]?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{election.candidates[0]?.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {election.candidates[0]?.votes} votes
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Analytics
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Create Election */}
          <TabsContent value="create" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Create New Election</h2>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Election Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="election-name">Election Name</Label>
                    <Input
                      id="election-name"
                      placeholder="e.g., Student Council President 2024"
                      value={createFormData.name}
                      onChange={(e) => setCreateFormData({...createFormData, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={createFormData.department} onValueChange={(value) => setCreateFormData({...createFormData, department: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Departments">All Departments</SelectItem>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Business">Business Administration</SelectItem>
                        <SelectItem value="Arts">Liberal Arts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the election"
                    value={createFormData.description}
                    onChange={(e) => setCreateFormData({...createFormData, description: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button type="button" variant="outline" className="w-full justify-start text-left">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {formatDate(createFormData.startDate)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={createFormData.startDate}
                          onSelect={(date) => date && setCreateFormData({...createFormData, startDate: date})}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button type="button" variant="outline" className="w-full justify-start text-left">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {formatDate(createFormData.endDate)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={createFormData.endDate}
                          onSelect={(date) => date && setCreateFormData({...createFormData, endDate: date})}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Candidates</Label>
                    <Button type="button" onClick={addCandidate} size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Candidate
                    </Button>
                  </div>
                  
                  {createFormData.candidates.map((candidate, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Candidate {index + 1}</h4>
                          {createFormData.candidates.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCandidate(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Name</Label>
                            <Input
                              placeholder="Candidate name"
                              value={candidate.name}
                              onChange={(e) => updateCandidate(index, 'name', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Avatar URL</Label>
                            <Input
                              placeholder="Profile image URL"
                              value={candidate.avatar}
                              onChange={(e) => updateCandidate(index, 'avatar', e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Manifesto</Label>
                          <Textarea
                            placeholder="Brief manifesto or platform"
                            value={candidate.manifesto}
                            onChange={(e) => updateCandidate(index, 'manifesto', e.target.value)}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <Button
                  type="button"
                  onClick={handleCreateElection}
                  className="w-full bg-[var(--university-gold)] hover:bg-[var(--university-gold-hover)] text-white"
                >
                  Create Election
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Candidates Management */}
          <TabsContent value="candidates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Candidate Management</h2>
            </div>
            
            <Card className="text-center py-12">
              <CardContent>
                <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Candidate Management</h3>
                <p className="text-gray-500">
                  Manage candidates across all elections from this central location
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Election Analytics</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Elections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--university-navy)]">{elections.length}</div>
                  <p className="text-sm text-gray-500 mt-1">All time</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Elections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{activeElections.length}</div>
                  <p className="text-sm text-gray-500 mt-1">Currently running</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Votes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--university-gold)]">
                    {elections.reduce((total, election) => total + election.totalVotes, 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">All elections</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}