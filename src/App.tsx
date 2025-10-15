import React, { useState, useEffect } from 'react';
import { AuthScreen } from './components/auth-screen';
import { StudentDashboard } from './components/student-dashboard';
import { AdminDashboard } from './components/admin-dashboard';
import { VotingScreen } from './components/voting-screen';
import { NotificationsScreen } from './components/notifications-screen';
import { RequestElectionForm } from './components/request-election-form';

export type UserRole = 'student' | 'admin';
export type Screen = 'auth' | 'student-dashboard' | 'admin-dashboard' | 'voting' | 'notifications' | 'request-election';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  university: string;
  department: string;
  avatar?: string;
}

export interface Election {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  university: string;
  department: string;
  status: 'pending' | 'active' | 'completed';
  totalVotes: number;
  candidates: Candidate[];
}

export interface Candidate {
  id: string;
  name: string;
  manifesto: string;
  votes: number;
  avatar?: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'election' | 'result' | 'general';
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [user, setUser] = useState<User | null>(null);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);

  // Mock data
  const [elections] = useState<Election[]>([
    {
      id: '1',
      name: 'Student Council President 2024',
      description: 'Annual election for Student Council President',
      startDate: '2024-03-01',
      endDate: '2024-03-07',
      university: 'University of California',
      department: 'All Departments',
      status: 'active',
      totalVotes: 1250,
      candidates: [
        {
          id: '1',
          name: 'Sarah Johnson',
          manifesto: 'Improving campus facilities and student services',
          votes: 650,
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c9b1e8?w=100&h=100&fit=crop&crop=face'
        },
        {
          id: '2',
          name: 'Mike Chen',
          manifesto: 'Enhanced mental health support and academic resources',
          votes: 600,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        }
      ]
    },
    {
      id: '2',
      name: 'CS Department Representative',
      description: 'Computer Science Department representative election',
      startDate: '2024-02-15',
      endDate: '2024-02-22',
      university: 'University of California',
      department: 'Computer Science',
      status: 'completed',
      totalVotes: 450,
      candidates: [
        {
          id: '3',
          name: 'Alex Rivera',
          manifesto: 'Better lab equipment and industry partnerships',
          votes: 280,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        },
        {
          id: '4',
          name: 'Emma Thompson',
          manifesto: 'Improved curriculum and student internship programs',
          votes: 170,
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
        }
      ]
    }
  ]);

  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      message: 'Student Council President 2024 results are now available',
      timestamp: '2024-03-08T10:00:00Z',
      read: false,
      type: 'result'
    },
    {
      id: '2',
      message: 'New election request submitted for approval',
      timestamp: '2024-03-07T15:30:00Z',
      read: true,
      type: 'election'
    },
    {
      id: '3',
      message: 'Voting for CS Department Representative has ended',
      timestamp: '2024-02-22T23:59:00Z',
      read: true,
      type: 'election'
    }
  ]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentScreen(userData.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('auth');
    setSelectedElection(null);
  };

  const handleNavigate = (screen: Screen, election?: Election) => {
    setCurrentScreen(screen);
    if (election) {
      setSelectedElection(election);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'auth':
        return <AuthScreen onLogin={handleLogin} />;
      case 'student-dashboard':
        return (
          <StudentDashboard
            user={user!}
            elections={elections}
            notifications={notifications}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case 'admin-dashboard':
        return (
          <AdminDashboard
            user={user!}
            elections={elections}
            notifications={notifications}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case 'voting':
        return (
          <VotingScreen
            election={selectedElection!}
            user={user!}
            onNavigate={handleNavigate}
          />
        );
      case 'notifications':
        return (
          <NotificationsScreen
            notifications={notifications}
            onNavigate={handleNavigate}
          />
        );
      case 'request-election':
        return (
          <RequestElectionForm
            user={user!}
            onNavigate={handleNavigate}
          />
        );
      default:
        return <AuthScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderScreen()}
    </div>
  );
}

export default App;