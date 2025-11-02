/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Zap, Award, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { mockBurgers } from '../data/mockData';
import Navbar from "../components/Navbar";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const HeroSection = () => (
  <section 
    className="relative h-screen flex items-center justify-center text-white"
    style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=2070&auto=format&fit=crop')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="absolute inset-0 bg-black/60" />
    <div className="container relative z-10 px-4 text-center">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
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
  </div>
  </section>
);

const features = [
  { icon: Zap, title: 'Fast Delivery', description: 'Hot burgers delivered to your door in under 30 minutes.' },
  { icon: Star, title: 'Premium Quality', description: 'Fresh, locally-sourced ingredients and handcrafted burgers daily.' },
  { icon: Award, title: 'Loyalty Rewards', description: 'Earn points with every order and get free burgers.' },
];

const FeaturesSection = () => (
  <section className="relative z-10 py-24 bg-background">
    <motion.div
      className="container grid grid-cols-1 gap-8 px-4 mx-auto md:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {features.map((feature, index) => (
        <motion.div key={index} variants={itemVariants}>
          <Card className="p-6 text-center transition-all duration-300 border-white/10 glass elegant-shadow hover:scale-105 hover:border-primary/20 h-full">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  </section>
);

const FeaturedBurgersSection = () => {
  const featuredBurgers = mockBurgers.slice(0, 3);
  return (
    <section 
      className="relative z-20 py-24"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10">
      <h2 className="mb-12 text-3xl font-bold text-center md:text-4xl">Our Signature Burgers</h2>
      <motion.div 
        className="container grid grid-cols-1 gap-8 px-4 mx-auto md:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {featuredBurgers.map((burger) => (
          <motion.div key={burger.id} variants={itemVariants}>
            <Card className="overflow-hidden transition-all duration-300 border-white/10 glass group hover:shadow-primary/20 hover:scale-105 hover:border-primary/20 h-full flex flex-col">
            <img
              src={burger.image}
              alt={burger.name}
              className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-110"
            />
              <div className="flex flex-col flex-grow p-6 space-y-3">
              <h3 className="text-xl font-bold">{burger.name}</h3>
                <p className="flex-grow text-sm text-muted-foreground">{burger.description}</p>
                <div className="flex items-center justify-between pt-4 mt-auto">
                <span className="text-2xl font-bold text-primary">LKR {burger.price.toFixed(2)}</span>
                <Link to="/menu">
                  <Button>Order Now</Button>
                </Link>
              </div>
            </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      <div className="container px-4 mx-auto mt-12 text-center">
        <Link to="/menu">
          <Button variant="outline" size="lg">View Full Menu</Button>
        </Link>
      </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="relative z-30 pt-24 bg-background">
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
  <div className="text-foreground">
    <Navbar />
    <div className="relative">
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
