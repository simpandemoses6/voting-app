import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { User, Election, Screen } from '../App';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Vote,
  Users,
  Calendar
} from 'lucide-react';

interface VotingScreenProps {
  election: Election;
  user: User;
  onNavigate: (screen: Screen) => void;
}

export function VotingScreen({ election, user, onNavigate }: VotingScreenProps) {
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endDate = new Date(election.endDate);
      const diff = endDate.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m`);
        } else {
          setTimeLeft(`${minutes}m`);
        }
      } else {
        setTimeLeft('Voting ended');
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [election.endDate]);

  const handleSubmitVote = async () => {
    if (!selectedCandidate) return;

    setSubmitting(true);
    
    // Mock API call
    setTimeout(() => {
      setSubmitting(false);
      setShowSuccessModal(true);
    }, 2000);
  };

  const handleViewResults = () => {
    setShowSuccessModal(false);
    onNavigate(user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
  };

  const getVotePercentage = (candidateVotes: number) => {
    return ((candidateVotes / election.totalVotes) * 100).toFixed(1);
  };

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
                onClick={() => onNavigate(user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard')}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold">{election.name}</h1>
                <p className="text-sm text-gray-500">{election.university}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-[var(--university-gold)]" />
              <span className="font-medium text-[var(--university-navy)]">{timeLeft}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Election Info */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="font-medium">
                    {new Date(election.endDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Total Votes</p>
                  <p className="font-medium">{election.totalVotes.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Vote className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{election.department}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voting Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Vote className="w-5 h-5" />
              Cast Your Vote
            </CardTitle>
            <p className="text-gray-600">Select your preferred candidate below</p>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate}>
              <div className="space-y-4">
                {election.candidates.map((candidate) => (
                  <div key={candidate.id} className="relative">
                    <Label
                      htmlFor={candidate.id}
                      className="flex items-start gap-4 p-4 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <RadioGroupItem
                        value={candidate.id}
                        id={candidate.id}
                        className="mt-1"
                      />
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarImage src={candidate.avatar} alt={candidate.name} />
                        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{candidate.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {getVotePercentage(candidate.votes)}% ({candidate.votes})
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {candidate.manifesto}
                        </p>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </main>

      {/* Sticky Submit Button */}
      <div className="sticky bottom-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            className="w-full h-12 bg-[var(--university-light-blue)] hover:bg-blue-600 text-white disabled:opacity-50"
            onClick={handleSubmitVote}
            disabled={!selectedCandidate || submitting || timeLeft === 'Voting ended'}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Submitting Vote...
              </>
            ) : timeLeft === 'Voting ended' ? (
              'Voting Has Ended'
            ) : (
              'Submit Vote'
            )}
          </Button>
          {selectedCandidate && (
            <p className="text-center text-sm text-gray-500 mt-2">
              You selected {election.candidates.find(c => c.id === selectedCandidate)?.name}
            </p>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <DialogTitle className="text-xl">Vote Submitted Successfully!</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Your vote for <strong>{election.candidates.find(c => c.id === selectedCandidate)?.name}</strong> 
              {' '}has been recorded for the {election.name} election.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Election:</strong> {election.name}<br />
                <strong>Time:</strong> {new Date().toLocaleString()}<br />
                <strong>Status:</strong> <span className="text-green-600">Confirmed</span>
              </p>
            </div>
            <Button
              className="w-full bg-[var(--university-gold)] hover:bg-[var(--university-gold-hover)] text-white"
              onClick={handleViewResults}
            >
              View Results
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}