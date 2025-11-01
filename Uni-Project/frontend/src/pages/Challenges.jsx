import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Trophy, Target, Calendar, Ticket, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { mockChallenges, mockLeaderboard } from '../data/mockData';

const wheelData = [
  { option: '10% OFF' },
  { option: 'LKR 150 OFF' },
  { option: 'TRY AGAIN' },
  { option: 'FREE FRIES' },
  { option: '20% OFF' },
  { option: 'TRY AGAIN' },
  { option: 'LKR 200 OFF' },
  { option: 'FREE DRINK' },
];

const discountCodes = {
  '10% OFF': 'SPIN10',
  'LKR 150 OFF': 'SPIN150',
  'FREE FRIES': 'FREEFRIES',
  '20% OFF': 'SPIN20',
  'LKR 200 OFF': 'SPIN200',
  'FREE DRINK': 'FREEDRINK',
};

const LAST_SPIN_DATE_KEY = 'burger_shop_last_spin_date';

const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
};

const WheelComponent = ({ segments, onSpinning, rotation }) => {
  const segmentDegrees = 360 / segments.length;

  const segmentStyle = useMemo(() => {
    const colors = ['#fde047', '#f87171', '#60a5fa', '#4ade80'];
    return segments.map((_, index) => ({
      transform: `rotate(${index * segmentDegrees}deg)`,
      backgroundColor: colors[index % colors.length],
    }));
  }, [segments, segmentDegrees]);

  return (
    <div className="relative w-80 h-80 md:w-96 md:h-96">
      <div 
        className="wheel-container"
        style={{ transform: `rotate(${rotation}deg)` }}
        onTransitionEnd={onSpinning}
      >
        <div className="wheel-center" />
        {segments.map((segment, index) => (
          <div
            key={index}
            className="wheel-segment"
            style={{ '--segment-degrees': `${segmentDegrees}deg`, ...segmentStyle[index] }}
          >
            <span className="wheel-segment-text">{segment.option}</span>
          </div>
        ))}
      </div>
      <div className="wheel-pointer" />
    </div>
  );
};

const SpinWheelGame = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [hasSpunToday, setHasSpunToday] = useState(true);
  const [rotation, setRotation] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const lastSpinDate = localStorage.getItem(LAST_SPIN_DATE_KEY);
    if (lastSpinDate !== getTodayDateString()) {
      setHasSpunToday(false);
    }
  }, []);

  const handleSpinClick = () => {
    if (hasSpunToday) {
      toast({ title: "You can only spin once a day!", variant: 'destructive' });
      return;
    }
    setMustSpin(true);
    const newPrizeNumber = Math.floor(Math.random() * wheelData.length);
    setPrizeNumber(newPrizeNumber);

    const segmentDegrees = 360 / wheelData.length;
    const randomOffset = (Math.random() - 0.5) * segmentDegrees * 0.8;
    const prizeAngle = 360 - (newPrizeNumber * segmentDegrees) + randomOffset;
    const extraRotations = 5 * 360;

    setRotation(rotation + extraRotations + prizeAngle);
  };

  const onStopSpinning = () => {
    if (!mustSpin) return;
    setMustSpin(false);
    setHasSpunToday(true);
    localStorage.setItem(LAST_SPIN_DATE_KEY, getTodayDateString());
    const prize = wheelData[prizeNumber].option;

    if (prize !== 'TRY AGAIN') {
      toast({
        title: `🎉 Congratulations! You won ${prize}!`,
        description: `Use code: ${discountCodes[prize]} at checkout.`,
      });
    } else {
      toast({
        title: 'Better luck next time!',
        description: 'You can spin again tomorrow.',
      });
    }
  };

  return (
    <Card className="p-6 md:p-8 text-center glass elegant-shadow overflow-hidden">
      <h2 className="mb-4 text-3xl font-bold flex items-center justify-center gap-2"><Ticket className="w-8 h-8 text-primary" /> Spin to Win!</h2>
      <p className="mb-8 text-muted-foreground">Spin the wheel daily to win exclusive discounts and free items.</p>
      <div className="flex items-center justify-center my-4">
        <WheelComponent
          segments={wheelData}
          onSpinning={onStopSpinning}
          rotation={rotation}
        />
      </div>
      <Button onClick={handleSpinClick} size="lg" className="mt-8 gold-glow" disabled={hasSpunToday}>
        {hasSpunToday ? 'Come Back Tomorrow!' : 'Spin the Wheel'}
      </Button>
    </Card>
  );
};

const Challenges = () => {
  const navigate = useNavigate();

  return (
    <div className="container px-4 py-8 mx-auto relative">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="absolute top-8 left-4 md:left-8 flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">
          <span className="text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Challenges & Rewards</span>
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">Play games, earn points, and get rewarded!</p>
      </div>

      <div className="mb-12">
        <SpinWheelGame />
      </div>

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
  );
};

export default Challenges;
