import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  useAuth();

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem('burger_shop_orders') || '[]');
    setOrders(allOrders);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'preparing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'on-the-way':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'on-the-way':
        return 'bg-blue-500/20 text-blue-500';
      case 'delivered':
        return 'bg-green-500/20 text-green-500';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />
      
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-4xl font-bold">Order Tracking</h1>

        {orders.length === 0 ? (
          <Card className="p-12 text-center glass">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="mb-2 text-2xl font-bold">No orders yet</h2>
            <p className="text-muted-foreground">Your order history will appear here</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="p-6 glass">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="mb-1 text-xl font-bold">Order #{order.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    <span className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      {order.status.replace('-', ' ')}
                    </span>
                  </Badge>
                </div>

                <div className="pt-4 border-t">
                  <div className="mb-4 space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="text-muted-foreground">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-muted-foreground">
                      Delivery: {order.address}
                    </span>
                    <span className="text-xl font-bold text-primary">
                      Total: ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
