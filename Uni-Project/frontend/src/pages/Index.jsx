import React from "react"; // Optional if using React 17+ with new JSX transform
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Zap, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import Navbar from '../components/Navbar';
import { mockBurgers } from '../data/mockData';

const Index = () => {
  const featuredBurgers = mockBurgers.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container px-4 py-20 mx-auto text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <h1 className="text-5xl font-bold md:text-7xl">
            The Best <span className="text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Burgers</span> in Town
          </h1>
          <p className="text-xl text-muted-foreground">
            Crafted with passion, served with love. Experience burger perfection.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/menu">
              <Button size="lg" className="text-lg gold-glow">
                Order Now <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/challenges">
              <Button size="lg" variant="outline" className="text-lg">
                View Challenges
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container px-4 py-16 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="p-6 transition-transform glass elegant-shadow hover:scale-105">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Hot burgers delivered to your door in under 30 minutes
              </p>
            </div>
          </Card>

          <Card className="p-6 transition-transform glass elegant-shadow hover:scale-105">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Premium Quality</h3>
              <p className="text-muted-foreground">
                Fresh ingredients and handcrafted burgers daily
              </p>
            </div>
          </Card>

          <Card className="p-6 transition-transform glass elegant-shadow hover:scale-105">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Loyalty Rewards</h3>
              <p className="text-muted-foreground">
                Earn points with every order and get free burgers
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Featured Burgers */}
      <section className="container px-4 py-16 mx-auto">
        <h2 className="mb-12 text-4xl font-bold text-center">Featured Burgers</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {featuredBurgers.map((burger) => (
            <Card key={burger.id} className="overflow-hidden transition-transform glass hover:scale-105">
              <img 
                src={burger.image} 
                alt={burger.name}
                className="object-cover w-full h-48"
              />
              <div className="p-6 space-y-3">
                <h3 className="text-2xl font-bold">{burger.name}</h3>
                <p className="text-muted-foreground">{burger.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">${burger.price}</span>
                  <Link to="/menu">
                    <Button>Order Now</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/menu">
            <Button variant="outline" size="lg">View Full Menu</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t">
        <div className="container px-4 py-8 mx-auto text-center text-muted-foreground">
          <p>© 2025 BurgerShop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
