import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Notification, Screen } from '../App';
import { 
  ArrowLeft, 
  Bell, 
  Vote, 
  Trophy, 
  Info,
  Filter,
  CheckCircle
} from 'lucide-react';

interface NotificationsScreenProps {
  notifications: Notification[];
  onNavigate: (screen: Screen) => void;
}

export function NotificationsScreen({ notifications, onNavigate }: NotificationsScreenProps) {
  const [filter, setFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'election':
        return <Vote className="w-5 h-5 text-[var(--university-light-blue)]" />;
      case 'result':
        return <Trophy className="w-5 h-5 text-[var(--university-gold)]" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleMarkAsRead = () => {
    console.log('Marking as read:', selectedNotifications);
    setSelectedNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('student-dashboard')}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[var(--university-navy)]" />
                <h1 className="text-lg font-semibold">Notifications</h1>
                {unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {unreadCount}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="election">Elections</SelectItem>
                  <SelectItem value="result">Results</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
              
              {selectedNotifications.length > 0 && (
                <Button
                  size="sm"
                  onClick={handleMarkAsRead}
                  className="bg-[var(--university-gold)] hover:bg-[var(--university-gold-hover)] text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Read ({selectedNotifications.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredNotifications.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {filter === 'all' ? 'No Notifications' : `No ${filter} notifications`}
              </h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? "You're all caught up! New notifications will appear here."
                  : `No ${filter} notifications found. Try changing the filter.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.read ? 'border-l-4 border-l-[var(--university-gold)] bg-blue-50/50' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedNotifications.includes(notification.id)}
                      onCheckedChange={() => handleSelectNotification(notification.id)}
                      className="mt-1"
                    />
                    
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm leading-relaxed ${
                          !notification.read ? 'font-medium' : 'text-gray-700'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-[var(--university-gold)] rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            notification.type === 'election' ? 'border-blue-200 text-blue-700' :
                            notification.type === 'result' ? 'border-yellow-200 text-yellow-700' :
                            'border-gray-200 text-gray-700'
                          }`}
                        >
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Footer */}
        {notifications.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Showing {filteredNotifications.length} of {notifications.length} notifications
              {unreadCount > 0 && ` • ${unreadCount} unread`}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}