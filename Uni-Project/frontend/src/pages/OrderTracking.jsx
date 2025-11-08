import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Package, Truck, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar'; 
import { useAuth } from '../contexts/AuthContext';

const BASE_URL = 'http://localhost:3000';
const API_URL = `${BASE_URL}/api`;

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const { user, isAuthenticated } = useAuth(); // AuthContext eken user and token laba ganna

  useEffect(() => {
    const fetchOrders = async () => {
      // User logged in and has ID, otherwise cannot fetch orders
      if (!isAuthenticated || !user || !user._id) {
        setOrders([]);
        return; 
      }

      try {
        const res = await fetch(`${API_URL}/orders/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`, // Auth token eka yawanna
          },
        });

        const data = await res.json();

        if (res.ok) {
          setOrders(data); // Backend eken sort wela enawa
        } else {
          console.error('Failed to fetch orders:', data.message);
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-500" aria-label="Pending" />;
      case 'preparing':
        return <Clock className="w-5 h-5 text-yellow-500" aria-label="Preparing" />;
      case 'on-the-way':
        return <Truck className="w-5 h-5 text-blue-500" aria-label="On The Way" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" aria-label="Delivered" />;
      default:
        return <Package className="w-5 h-5 text-gray-400" aria-label="Unknown Status" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      case 'preparing':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'on-the-way':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'delivered':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary text-foreground">
      <Navbar />
      <main className="container max-w-4xl px-4 py-12 mx-auto animate-fadeInBlur">
        <h1 className="mb-10 text-4xl font-bold text-center md:text-5xl">My Orders</h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <Package className="w-20 h-20 mx-auto mb-6 text-muted-foreground" aria-hidden="true" />
            <h2 className="mb-2 text-3xl font-semibold">No orders yet</h2>
            <p className="max-w-sm mb-8 text-muted-foreground">Your order history will appear here once you place an order.</p>
            <Link to="/menu">
              <Button size="lg" className="gap-2 transition-transform duration-200 gold-glow hover:scale-105">
                <ArrowLeft className="w-5 h-5" />
                Back to Menu
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order, index) => (
              <Card
                key={order._id} // Backend ID eka use kirima
                className="p-6 transition-all duration-300 sm:p-8 glass hover:border-primary/50 hover:shadow-lg animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
                role="region"
                aria-labelledby={`order-${order._id}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div>
                    <h3 id={`order-${order._id}`} className="text-2xl font-bold">
                      Order #<span className="text-primary">{order._id.slice(-6)}</span>
                    </h3>
                    <time
                      dateTime={new Date(order.createdAt).toISOString()}
                      className="text-sm text-muted-foreground"
                    >
                      {new Date(order.createdAt).toLocaleString()}
                    </time>
                  </div>
                  <Badge
                    className={`mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(
                      order.status
                    )}`}
                    aria-label={`Order status: ${order.status.replace('-', ' ')}`}
                  >
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status.replace('-', ' ')}</span>
                  </Badge>
                </div>

                <div className="pt-6 border-t border-border/50">
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-base"
                      >
                        <span className="text-muted-foreground">
                          {item.quantity} &times; {item.name}
                        </span>
                        <span className="font-medium">LKR {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 mt-6 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      Delivery Address:
                      <br />
                      <span className="font-semibold text-foreground">{order.address}</span>
                    </p>
                    {/* 🎯 totalAmount use kirima (Backend Model එකට අනුව) */}
                    <p className="mt-4 sm:mt-0 text-2xl font-extrabold text-primary">LKR {order.totalAmount.toFixed(2)}</p> 
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderTracking;