import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Alert, AlertDescription } from './ui/alert';
import { User, Screen } from '../App';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface RequestElectionFormProps {
  user: User;
  onNavigate: (screen: Screen) => void;
}

interface FormErrors {
  [key: string]: string;
}

export function RequestElectionForm({ user, onNavigate }: RequestElectionFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    university: user.university,
    department: user.department,
    reason: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const departments = [
    'All Departments',
    'Computer Science',
    'Engineering',
    'Business Administration',
    'Liberal Arts',
    'Medicine',
    'Law',
    'Sciences'
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Election name is required';
    } else if (formData.name.length < 5) {
      newErrors.name = 'Election name must be at least 5 characters';
    }

    if (!formData.department) {
      newErrors.department = 'Please select a department';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason for election is required';
    } else if (formData.reason.length < 20) {
      newErrors.reason = 'Please provide a more detailed reason (minimum 20 characters)';
    }

    if (formData.startDate >= formData.endDate) {
      newErrors.dates = 'End date must be after start date';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (formData.startDate < today) {
      newErrors.startDate = 'Start date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    
    // Mock API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleDateChange = (field: 'startDate' | 'endDate', date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, [field]: date });
      // Clear date-related errors
      if (errors[field] || errors.dates) {
        setErrors({ ...errors, [field]: '', dates: '' });
      }
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Request Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your election request has been submitted successfully. You'll receive a notification once it's reviewed by the admin team.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-medium mb-2">Request Details:</h3>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Election:</strong> {formData.name}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Department:</strong> {formData.department}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Period:</strong> {formatDate(formData.startDate)} - {formatDate(formData.endDate)}
              </p>
            </div>
            <Button 
              onClick={() => onNavigate(user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard')}
              className="w-full bg-[var(--university-gold)] hover:bg-[var(--university-gold-hover)] text-white"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold">Request New Election</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-[var(--university-gold)]" />
              Election Request Form
            </CardTitle>
            <p className="text-gray-600">
              Submit a request to create a new election. All requests are reviewed by administrators.
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Election Name */}
              <div className="space-y-2">
                <Label htmlFor="election-name">Election Name *</Label>
                <Input
                  id="election-name"
                  placeholder="e.g., Student Representative Election 2024"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={errors.name ? 'border-red-300' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Date Range */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        type="button"
                        variant="outline" 
                        className={`w-full justify-start text-left ${errors.startDate ? 'border-red-300' : ''}`}
                      >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {formatDate(formData.startDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => handleDateChange('startDate', date)}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.startDate && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.startDate}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        type="button"
                        variant="outline" 
                        className={`w-full justify-start text-left ${errors.dates ? 'border-red-300' : ''}`}
                      >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {formatDate(formData.endDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => handleDateChange('endDate', date)}
                        disabled={(date) => date < formData.startDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {errors.dates && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <AlertDescription className="text-red-600">
                    {errors.dates}
                  </AlertDescription>
                </Alert>
              )}

              {/* University & Department */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="university">University</Label>
                  <Input
                    id="university"
                    value={formData.university}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">Based on your profile</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select 
                    value={formData.department} 
                    onValueChange={(value) => handleInputChange('department', value)}
                  >
                    <SelectTrigger className={errors.department ? 'border-red-300' : ''}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.department}
                    </p>
                  )}
                </div>
              </div>

              {/* Reason/Description */}
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Election Request *</Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide a detailed explanation for why this election is needed. Include background information, the role's responsibilities, and why it's important for the student body."
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  className={`min-h-[120px] ${errors.reason ? 'border-red-300' : ''}`}
                />
                <div className="flex justify-between items-center">
                  {errors.reason ? (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.reason}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Minimum 20 characters required
                    </p>
                  )}
                  <span className="text-xs text-gray-400">
                    {formData.reason.length}/500
                  </span>
                </div>
              </div>

              {/* Information Alert */}
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  Your request will be reviewed by the administrative team. You'll receive a notification 
                  once your request has been approved or if additional information is needed.
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-[var(--university-gold)] hover:bg-[var(--university-gold-hover)] text-white"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Election Request
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}