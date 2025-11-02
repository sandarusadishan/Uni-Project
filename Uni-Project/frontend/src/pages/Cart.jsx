import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const DELIVERY_FEE = 350.00;

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, total, generateBill } = useCart(); 
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (!address.trim()) {
      toast({ title: 'Please enter delivery address', variant: 'destructive' });
      return;
    }

    // Mock order creation
    const order = {
      id: `ORD${Date.now()}`,
      items,
      total: total + DELIVERY_FEE,
      userId: user.id,
      address,
      status: 'preparing',
      createdAt: new Date().toISOString()
    };

    const orders = JSON.parse(localStorage.getItem('burger_shop_orders') || '[]');
    orders.push(order);
    localStorage.setItem('burger_shop_orders', JSON.stringify(orders));

    // Generate and download the PDF bill
    generateBill(order, user);

    clearCart();
    toast({ title: '🎉 Order placed successfully!' });
    navigate('/orders');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
        <Navbar />
        <div className="container flex flex-col items-center justify-center px-4 py-20 mx-auto text-center">
          <ShoppingBag className="w-24 h-24 mx-auto mb-4 text-muted-foreground" />
          <h2 className="mb-4 text-3xl font-bold">Your cart is empty</h2>
          <p className="mb-8 text-muted-foreground">Looks like you haven't added any burgers yet.</p>
          <Button onClick={() => navigate('/menu')} size="lg" className="gap-2 gold-glow">
            <ArrowLeft className="w-5 h-5" />
            Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />
      <div className="container px-4 py-8 mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">Your Cart</h1>
        </div>
      
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-2">
              {items.map((item) => (
                <Card key={item.id} className="p-4 glass">
                  <div className="flex gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="object-cover w-24 h-24 rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <p className="font-semibold text-primary">LKR {item.price.toFixed(2)}</p>
                      
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 font-semibold text-center">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-bold">LKR {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky p-6 space-y-6 glass top-24">
                <h2 className="text-2xl font-bold">Order Summary</h2>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>LKR {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery</span>
                    <span>LKR {DELIVERY_FEE.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 text-xl font-bold border-t">
                    <span>Total</span>
                    <span className="text-primary">LKR {(total + DELIVERY_FEE).toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, Apt 4B"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={handleCheckout} 
                  className="w-full gold-glow" 
                  size="lg"
                >
                  Checkout
                </Button>
              </Card>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Cart;
