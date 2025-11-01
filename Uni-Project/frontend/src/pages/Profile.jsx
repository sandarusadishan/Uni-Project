import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, Mail, Award, Package } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from '../components/ui/badge';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  const stats = [
    { label: 'Loyalty Points', value: user.loyaltyPoints, icon: Award, color: 'text-primary' },
    { label: 'Total Orders', value: '12', icon: Package, color: 'text-blue-500' },
    { label: 'Member Since', value: 'Oct 2025', icon: User, color: 'text-green-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />
      
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-4xl font-bold">My Profile</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Profile Info */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="p-8 glass">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/20">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h2 className="mb-1 text-2xl font-bold">{user.name}</h2>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg">
                  {user.role}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="p-4 text-center rounded-lg bg-secondary">
                    <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                    <p className="mb-1 text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-8 glass">
              <h3 className="mb-4 text-xl font-bold">Account Settings</h3>
              <div className="space-y-4">
                <Button variant="outline" className="justify-start w-full">
                  Edit Profile
                </Button>
                <Button variant="outline" className="justify-start w-full">
                  Change Password
                </Button>
                <Button variant="outline" className="justify-start w-full">
                  Notification Preferences
                </Button>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <Card className="sticky p-6 glass top-24">
              <h3 className="mb-4 text-xl font-bold">Recent Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="mb-1 font-semibold">Order Completed</p>
                  <p className="text-muted-foreground">2 hours ago</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="mb-1 font-semibold">Challenge Completed</p>
                  <p className="text-muted-foreground">1 day ago</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="mb-1 font-semibold">Badge Unlocked</p>
                  <p className="text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
