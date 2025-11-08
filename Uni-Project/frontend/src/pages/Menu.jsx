/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { ShoppingCart, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

// 🎯 Backend Constants
const BASE_URL = "http://localhost:3000";
const API_URL = `${BASE_URL}/api`;

const containerVariants = { /* ... unchanged ... */ };
const itemVariants = { /* ... unchanged ... */ };

// 🍔 BurgerCard Component (unchanged)
const BurgerCard = ({ product, onAddToCart }) => ( /* ... uses product.category ... */
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.05, boxShadow: '0px 6px 20px rgba(255, 209, 102, 0.3)' }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <Card className="overflow-hidden transition-all duration-300 border-transparent glass group hover:shadow-primary/20 hover:border-primary/30">
      <div className="relative">
        <img
          src={`${BASE_URL}${product.image}`}
          alt={product.name}
          className="object-cover w-full h-56 transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-xs select-none">
            {product.category}
          </Badge>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <h3 className="text-xl font-bold truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground h-10">{product.description}</p>
        <div className="flex items-end justify-between pt-2">
          <span className="text-2xl font-bold text-primary">
            LKR {Number(product.price).toFixed(2)}
          </span>
          <Button
            onClick={() => onAddToCart(product)}
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

// 🍔 Main Menu Page
const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  
  // ✅ Category state for dynamic filtering
  const [availableCategories, setAvailableCategories] = useState([]); 

  const { addItem } = useCart();
  const { toast } = useToast();

  // 🎯 Fetch Data from Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) {
          throw new Error("Failed to fetch menu items from server.");
        }
        const data = await res.json();
        setProducts(data);
        
        // 🎯 FIX: Extract unique categories from fetched data
        // Filter out empty/null categories
        const categories = [...new Set(data.map(p => p.category).filter(c => c && c.trim()))];
        setAvailableCategories(categories);

      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load menu. Please check the backend server.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 🎯 Filtering Logic (unchanged)
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  // 🎯 Add to Cart (unchanged)
  const handleAddToCart = (product) => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast({ title: `${product.name} added to cart!` });
  };

  // 🎯 Loading/Error UI (unchanged)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary">
        <p className="text-xl font-semibold">Loading delicious burgers...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary">
        <p className="text-xl font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  // 🎯 Render UI
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
              Explore Our{' '}
              <span className="text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">
                Menu
              </span>
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Find your next favorite burger.
            </p>
          </div>

          {/* 🔍 Filters */}
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
                  {/* ✅ Dynamically generate SelectItems */}
                  {availableCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {/* Display category name with capitalized first letter */}
                      {cat.charAt(0).toUpperCase() + cat.slice(1)} 
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* 🍔 Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredProducts.map((product) => (
            <BurgerCard key={product._id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </motion.div>

        {/* 🪶 Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-2xl text-muted-foreground">No menu items found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Menu;