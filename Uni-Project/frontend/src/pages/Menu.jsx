import { useState } from 'react';
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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />
      
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-4xl font-bold">Our Menu</h1>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-8 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
            <Input
              placeholder="Search burgers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Category" />
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

        {/* Burgers Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBurgers.map((burger) => (
            <Card key={burger.id} className="overflow-hidden transition-transform glass hover:scale-105">
              <img 
                src={burger.image} 
                alt={burger.name}
                className="object-cover w-full h-56"
              />
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold">{burger.name}</h3>
                  <Badge variant="secondary">{burger.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{burger.description}</p>
                
                {burger.dietary.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {burger.dietary.map((diet) => (
                      <Badge key={diet} variant="outline" className="text-xs">
                        {diet}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-2xl font-bold text-primary">${burger.price}</span>
                  <Button onClick={() => handleAddToCart(burger)} className="gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredBurgers.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-2xl text-muted-foreground">No burgers found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
