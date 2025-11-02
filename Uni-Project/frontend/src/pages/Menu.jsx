/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { ShoppingCart, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import { mockBurgers } from '../data/mockData';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

const BurgerCard = ({ burger, onAddToCart }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.05, boxShadow: '0px 6px 20px rgba(255, 209, 102, 0.3)' }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <Card className="overflow-hidden transition-all duration-300 border-transparent glass group hover:shadow-primary/20 hover:border-primary/30">
      <div className="relative">
        <img 
          src={burger.image} 
          alt={burger.name}
          className="object-cover w-full h-56 transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-xs select-none">{burger.category}</Badge>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <h3 className="text-xl font-bold truncate">{burger.name}</h3>
        <p className="text-sm text-muted-foreground h-10">{burger.description}</p>
        <div className="flex items-end justify-between pt-2">
          <span className="text-2xl font-bold text-primary">LKR {burger.price.toFixed(2)}</span>
          <Button 
            onClick={() => onAddToCart(burger)} 
            className="gap-2 flex items-center justify-center bg-gradient-to-tr from-yellow-400 to-yellow-300 hover:from-yellow-300 hover:to-yellow-400 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>
    </Card>
  </motion.div>
);

const Menu = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const { addItem } = useCart();
  const { toast } = useToast();

  const filteredBurgers = mockBurgers.filter(burger => {
    const matchesSearch =
      burger.name.toLowerCase().includes(search.toLowerCase()) ||
      burger.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || burger.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (burger) => {
    addItem({
      id: burger.id,
      name: burger.name,
      price: burger.price,
      image: burger.image,
    });
    toast({ title: `${burger.name} added to cart!` });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary selection:bg-yellow-300 selection:text-black">
      <Navbar />
      <main className="container px-4 py-8 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold md:text-5xl tracking-tight">
              Explore Our <span className="text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">Menu</span>
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">Find your next favorite burger.</p>
          </div>

          {/* Filters */}
          <div className="sticky top-[60px] z-10 py-4 mb-8 bg-background/80 backdrop-blur-sm rounded-md shadow-md">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-4 top-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search burgers by name or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12"
                  aria-label="Search burgers"
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full md:w-[220px]" aria-label="Filter by Category">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="veggie">Veggie</SelectItem>
                  <SelectItem value="spicy">Spicy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Burgers Grid */}
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible" 
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredBurgers.map((burger) => (
            <BurgerCard key={burger.id} burger={burger} onAddToCart={handleAddToCart} />
          ))}
        </motion.div>

        {filteredBurgers.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-2xl text-muted-foreground">No burgers found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Menu;
