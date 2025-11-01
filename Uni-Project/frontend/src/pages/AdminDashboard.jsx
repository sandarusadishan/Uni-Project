import React from "react"; // Optional if using React 17+ with new JSX transform
import { Card } from "../components/ui/card";
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Package, Users, DollarSign, TrendingUp, Settings } from 'lucide-react';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Orders', value: '248', icon: Package, color: 'text-blue-500' },
    { label: 'Total Revenue', value: '$5,240', icon: DollarSign, color: 'text-green-500' },
    { label: 'Total Users', value: '156', icon: Users, color: 'text-purple-500' },
    { label: 'Growth', value: '+12%', icon: TrendingUp, color: 'text-primary' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />
      
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 glass">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <p className="mb-2 text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Management Tabs */}
        <Card className="p-6 glass">
          <Tabs defaultValue="products">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Manage Products</h3>
                <Button className="gold-glow">Add New Burger</Button>
              </div>
              <p className="text-muted-foreground">Product management interface would go here</p>
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <h3 className="mb-4 text-xl font-bold">Recent Orders</h3>
              <p className="text-muted-foreground">Order management interface would go here</p>
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <h3 className="mb-4 text-xl font-bold">User Management</h3>
              <p className="text-muted-foreground">User management interface would go here</p>
            </TabsContent>

            <TabsContent value="challenges" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Manage Challenges</h3>
                <Button className="gold-glow">Create Challenge</Button>
              </div>
              <p className="text-muted-foreground">Challenge management interface would go here</p>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
