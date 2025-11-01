import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Award, Gift, Star, Crown } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

const Rewards = () => {
  const { user } = useAuth();
  const points = user && user.loyaltyPoints ? user.loyaltyPoints : 0;
  const nextReward = 500;
  const progress = (points / nextReward) * 100;

  const badges = [
    { id: 1, name: 'First Order', icon: '🎉', unlocked: points >= 10 },
    { id: 2, name: 'Burger Lover', icon: '🍔', unlocked: points >= 50 },
    { id: 3, name: 'Regular Customer', icon: '⭐', unlocked: points >= 100 },
    { id: 4, name: 'Gold Member', icon: '👑', unlocked: points >= 500 },
    { id: 5, name: 'Legendary', icon: '🏆', unlocked: points >= 1000 },
  ];

  const rewards = [
    { points: 100, reward: 'Free Drink', icon: '🥤' },
    { points: 250, reward: 'Free Fries', icon: '🍟' },
    { points: 500, reward: 'Free Burger', icon: '🍔' },
    { points: 1000, reward: 'Free Meal Combo', icon: '🎁' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />
      
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-4xl font-bold">Loyalty Rewards</h1>

        {/* Points Card */}
        <Card className="p-8 mb-8 glass elegant-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="mb-2 text-3xl font-bold">Your Points</h2>
              <p className="text-5xl font-bold text-primary">{points}</p>
            </div>
            <Crown className="w-24 h-24 text-primary" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress to next reward</span>
              <span>{points}/{nextReward} points</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </Card>

        {/* Available Rewards */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Available Rewards</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {rewards.map((item) => (
              <Card 
                key={item.points} 
                className={`glass p-6 text-center ${
                  points >= item.points ? 'gold-glow border-primary' : 'opacity-60'
                }`}
              >
                <div className="mb-3 text-4xl">{item.icon}</div>
                <h3 className="mb-2 font-bold">{item.reward}</h3>
                <Badge variant={points >= item.points ? 'default' : 'secondary'}>
                  {item.points} points
                </Badge>
              </Card>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div>
          <h2 className="mb-4 text-2xl font-bold">Your Badges</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {badges.map((badge) => (
              <Card 
                key={badge.id} 
                className={`glass p-6 text-center ${
                  badge.unlocked ? '' : 'opacity-40 grayscale'
                }`}
              >
                <div className="mb-3 text-5xl">{badge.icon}</div>
                <h3 className="text-sm font-semibold">{badge.name}</h3>
                {badge.unlocked && (
                  <Badge className="mt-2" variant="default">Unlocked</Badge>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
