import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const DELIVERY_FEE = 350.0;
const BASE_URL = 'http://localhost:3000';
const API_URL = `${BASE_URL}/api`;

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, total, generateBill } =
    useCart();
  // user object එකේ token සහ _id තිබිය යුතුයි
  const { user, isAuthenticated } = useAuth(); 
  const { toast } = useToast();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    if (!isAuthenticated) {
      toast({ title: 'Please log in to place an order.', variant: 'destructive' });
      navigate('/auth');
      setIsCheckingOut(false);
      return;
    }

    if (!address.trim()) {
      toast({ title: 'Please enter delivery address', variant: 'destructive' });
      setIsCheckingOut(false);
      return;
    }

    // 1. Backend API එකට යැවීමට අවශ්‍ය Order Data සකස් කිරීම
    const orderData = {
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image, // Product image path
      })),
      total: total + DELIVERY_FEE,
      userId: user._id, 
      address,
    };

    try {
      // 2. Order API call කිරීම
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Auth Token එක header එක හරහා යවනු ලැබේ
          Authorization: `Bearer ${user.token}`, 
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to place order.');
      }

      // Generate and download the bill (if needed)
      // generateBill(orderData, user); 

      clearCart();
      toast({ title: '🎉 Order placed successfully!', description: `Order ID: ${data.orderId.slice(-6)}` });
      
      navigate('/orders');
    } catch (error) {
      console.error('Checkout error:', error);
      toast({ title: '❌ Checkout Failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsCheckingOut(false);
    }
  };


  // 🛒 Empty cart UI
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
        <Navbar />
        <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-10 mx-auto text-center animate-fadeInBlur">
          <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-muted-foreground md:w-24 md:h-24" />
          <h2 className="mb-3 text-2xl font-bold md:text-3xl">
            Your cart is empty
          </h2>
          <p className="max-w-sm mb-8 text-muted-foreground">
            Looks like you haven't added any burgers yet. Let's find something
            delicious.
          </p>
          <Button
            onClick={() => navigate('/menu')}
            size="lg"
            className="gap-2 transition-transform duration-200 gold-glow hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  // 🧾 Cart UI
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />
      <div className="container px-4 py-8 mx-auto animate-fadeInBlur">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">Your Cart</h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 🧍 Cart Items */}
          <div className="space-y-4 lg:col-span-2">
            {items.map((item, index) => (
              <Card
                key={item.id}
                className="p-4 transition-all duration-300 glass hover:border-primary/50 hover:shadow-lg animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <img
                    src={`${BASE_URL}${item.image}`}
                    alt={item.name}
                    className="object-cover w-full h-32 rounded-md sm:w-24 sm:h-24"
                  />
                  <div className="flex-1 sm:text-left">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-bold leading-tight">
                        {item.name}
                      </h3>
                      <p className="hidden text-lg font-bold sm:block whitespace-nowrap">
                        LKR {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-primary sm:text-left">
                      LKR {item.price.toFixed(2)} each
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="transition-transform duration-200 hover:scale-110"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 font-semibold text-center">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="transition-transform duration-200 hover:scale-110"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => removeItem(item.id)}
                        className="transition-transform duration-200 hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="mt-2 text-right sm:hidden">
                      <p className="text-lg font-bold">
                        LKR {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* 💳 Order Summary */}
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
                  <span className="text-primary">
                    LKR {(total + DELIVERY_FEE).toFixed(2)}
                  </span>
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
                className="w-full gap-2 transition-transform duration-200 gold-glow hover:scale-105"
                size="lg"
                disabled={isCheckingOut || items.length === 0}
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                  </>
                ) : (
                  'Checkout'
                )}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;