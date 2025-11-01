/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Zap, Award, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { mockBurgers } from '../data/mockData';
import { useInView } from 'react-intersection-observer';
import Navbar from "../components/Navbar";

const AnimatedSection = ({ children, className }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}>
      {children}
    </section>
  );
};

const HeroSection = () => (
  <section className="container px-4 py-24 mx-auto text-center md:py-32">
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in ">
      <h1 className="text-5xl font-bold text-white md:text-7xl" style={{ textShadow: '0 2px 15px rgba(0,0,0,0.5)' }}>
        The Best <span className="text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Burgers</span> in Town
      </h1>
      <p className="text-lg text-muted-foreground md:text-xl">
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
);

const features = [
  { icon: Zap, title: 'Fast Delivery', description: 'Hot burgers delivered to your door in under 30 minutes.' },
  { icon: Star, title: 'Premium Quality', description: 'Fresh, locally-sourced ingredients and handcrafted burgers daily.' },
  { icon: Award, title: 'Loyalty Rewards', description: 'Earn points with every order and get free burgers.' },
];

const FeaturesSection = () => (
  <AnimatedSection className="container px-4 py-16 mx-auto">
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {features.map((feature, index) => (
        <Card key={index} className="p-6 text-center transition-all duration-300 border-white/10 glass elegant-shadow hover:scale-105 hover:border-primary/20">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <feature.icon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        </Card>
      ))}
    </div>
  </AnimatedSection>
);

const FeaturedBurgersSection = () => {
  const featuredBurgers = mockBurgers.slice(0, 3);
  return (
    <AnimatedSection className="container px-4 py-16 mx-auto">
      <h2 className="mb-12 text-3xl font-bold text-center md:text-4xl">Our Signature Burgers</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {featuredBurgers.map((burger) => (
          <Card key={burger.id} className="overflow-hidden transition-all duration-300 border-white/10 glass group hover:shadow-primary/20 hover:scale-105 hover:border-primary/20">
            <img
              src={burger.image}
              alt={burger.name}
              className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-110"
            />
            <div className="p-6 space-y-3">
              <h3 className="text-xl font-bold">{burger.name}</h3>
              <p className="text-sm text-muted-foreground">{burger.description}</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-2xl font-bold text-primary">LKR {burger.price.toFixed(2)}</span>
                <Link to="/menu">
                  <Button>Order Now</Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link to="/menu">
          <Button variant="outline" size="lg">View Full Menu</Button>
        </Link>
      </div>
    </AnimatedSection>
  );
};

const Footer = () => (
  <footer className="pt-16 mt-20 border-t border-white/10 bg-black/20 backdrop-blur-sm">
    <div className="container px-4 mx-auto">
      <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-4">
        {/* Brand Info */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-primary">BurgerShop</h3>
          <p className="text-sm text-muted-foreground">The ultimate destination for burger lovers.</p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="transition-colors text-muted-foreground hover:text-primary">Home</Link></li>
            <li><Link to="/menu" className="transition-colors text-muted-foreground hover:text-primary">Menu</Link></li>
            <li><Link to="/about" className="transition-colors text-muted-foreground hover:text-primary">About Us</Link></li>
            <li><Link to="/contact" className="transition-colors text-muted-foreground hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="space-y-4">
          <h4 className="font-semibold">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="transition-colors text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
            <li><Link to="/terms" className="transition-colors text-muted-foreground hover:text-primary">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <h4 className="font-semibold">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="transition-colors text-muted-foreground hover:text-primary"><Facebook size={20} /></a>
            <a href="#" className="transition-colors text-muted-foreground hover:text-primary"><Twitter size={20} /></a>
            <a href="#" className="transition-colors text-muted-foreground hover:text-primary"><Instagram size={20} /></a>
            <a href="#" className="transition-colors text-muted-foreground hover:text-primary"><Youtube size={20} /></a>
          </div>
        </div>
      </div>
      <div className="py-6 mt-8 text-sm text-center border-t border-white/10 text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} BurgerShop. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
);

const Index = () => (
  <div 
    className="relative text-foreground"
    style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=2070&auto=format&fit=crop')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}
  >
    <div className="absolute inset-0 bg-black/60" />
    <div className="relative z-10">
      <Navbar/>
      <main>
        <HeroSection />
        <FeaturesSection />
        <FeaturedBurgersSection />
      </main>
      <Footer />
    </div>
  </div>
);

export default Index;
