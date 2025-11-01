import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Trophy, Target, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import { mockChallenges, mockLeaderboard } from '../data/mockData';

const Challenges = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />
      
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-4xl font-bold">Challenges & Leaderboard</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Challenges */}
          <div className="space-y-4 lg:col-span-2">
            <h2 className="mb-4 text-2xl font-bold">Active Challenges</h2>
            {mockChallenges.map((challenge) => (
              <Card key={challenge.id} className="p-6 glass">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-6 h-6 text-primary" />
                      <h3 className="text-xl font-bold">{challenge.name}</h3>
                    </div>
                    <p className="mb-3 text-muted-foreground">{challenge.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Expires: {challenge.expiresAt}</span>
                    </div>
                  </div>
                  <Badge className="bg-primary/20 text-primary">
                    +{challenge.reward} pts
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="text-muted-foreground">
                      {challenge.progress}/{challenge.total}
                    </span>
                  </div>
                  <Progress 
                    value={(challenge.progress / challenge.total) * 100} 
                    className="h-2"
                  />
                </div>
              </Card>
            ))}
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <Card className="sticky p-6 glass top-24">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Leaderboard</h2>
              </div>
              
              <div className="space-y-3">
                {mockLeaderboard.map((entry) => (
                  <div 
                    key={entry.rank}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      entry.rank <= 3 ? 'bg-primary/10 border border-primary/20' : 'bg-secondary'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                      entry.rank === 1 ? 'bg-yellow-500 text-black' :
                      entry.rank === 2 ? 'bg-gray-400 text-black' :
                      entry.rank === 3 ? 'bg-amber-600 text-black' :
                      'bg-muted'
                    }`}>
                      {entry.rank}
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-semibold">{entry.name}</p>
                      <p className="text-sm text-muted-foreground">{entry.points} points</p>
                    </div>
                    
                    <div className="flex gap-1">
                      {entry.badges.map((badge, idx) => (
                        <span key={idx} className="text-lg">{badge}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
