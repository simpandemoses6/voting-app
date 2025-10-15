import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { User, Election, Notification, Screen } from '../App';
import { 
  Vote, 
  Trophy, 
  Plus, 
  Bell, 
  LogOut, 
  Calendar,
  Users,
  CheckCircle
} from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  elections: Election[];
  notifications: Notification[];
  onNavigate: (screen: Screen, election?: Election) => void;
  onLogout: () => void;
}

export function StudentDashboard({ 
  user, 
  elections, 
  notifications, 
  onNavigate, 
  onLogout 
}: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState('active');
  
  const activeElections = elections.filter(e => e.status === 'active');
  const pastElections = elections.filter(e => e.status === 'completed');
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateProgress = (election: Election) => {
    const totalVotes = election.totalVotes;
    const targetVotes = 2000; // Mock target
    return Math.min((totalVotes / targetVotes) * 100, 100);
  };

  const getWinner = (election: Election) => {
    return election.candidates.reduce((prev, current) => 
      prev.votes > current.votes ? prev : current
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top App Bar */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-medium">Hi, {user.username} 👋</h1>
                <p className="text-sm text-gray-500">{user.department}</p>
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
          <TabsList className="grid w-full grid-cols-4 mb-6 max-w-md">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Active Elections */}
          <TabsContent value="active" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Active Elections</h2>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {activeElections.length} Active
              </Badge>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeElections.map((election) => (
                <Card key={election.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{election.name}</CardTitle>
                    <p className="text-sm text-gray-600">{election.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Ends {formatDate(election.endDate)}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Live Participation</span>
                        <span>{election.totalVotes} votes</span>
                      </div>
                      <Progress value={calculateProgress(election)} className="h-2" />
                    </div>
                    
                    <Button 
                      className="w-full bg-[var(--university-gold)] hover:bg-[var(--university-gold-hover)] text-white"
                      onClick={() => onNavigate('voting', election)}
                    >
                      <Vote className="w-4 h-4 mr-2" />
                      Vote Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {activeElections.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Vote className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Active Elections</h3>
                  <p className="text-gray-500">Check back later for new voting opportunities</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Past Elections */}
          <TabsContent value="past" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Past Elections</h2>
              <Badge variant="secondary">
                {pastElections.length} Completed
              </Badge>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastElections.map((election) => {
                const winner = getWinner(election);
                return (
                  <Card key={election.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{election.name}</CardTitle>
                      <Badge className="w-fit bg-gray-100 text-gray-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={winner.avatar} alt={winner.name} />
                          <AvatarFallback>{winner.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-[var(--university-gold)]" />
                            <span className="font-medium">{winner.name}</span>
                          </div>
                          <p className="text-sm text-gray-600">{winner.votes} votes</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{election.totalVotes} total votes</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Requests */}
          <TabsContent value="requests" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Requests</h2>
              <Badge variant="secondary">0 Pending</Badge>
            </div>
            
            <Card className="text-center py-12">
              <CardContent>
                <Plus className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Election Requests</h3>
                <p className="text-gray-500 mb-4">
                  You haven't submitted any election requests yet
                </p>
                <Button 
                  onClick={() => onNavigate('request-election')}
                  className="bg-[var(--university-gold)] hover:bg-[var(--university-gold-hover)] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Request New Election
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-6 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback className="text-xl">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-medium">{user.username}</h3>
                    <p className="text-gray-600">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">University</label>
                    <p className="mt-1">{user.university}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Department</label>
                    <p className="mt-1">{user.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Role</label>
                    <p className="mt-1 capitalize">{user.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Member Since</label>
                    <p className="mt-1">January 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-[var(--university-gold)] hover:bg-[var(--university-gold-hover)] text-white"
        onClick={() => onNavigate('request-election')}
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
}