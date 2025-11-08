import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Package,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  Trash2,
  Plus,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { Input } from "../components/ui/input";

const API_URL = "http://localhost:3000/api/products"; // ✅ Your backend endpoint

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // form states
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "",
  });

  const [newChallenge, setNewChallenge] = useState({ title: "", reward: "" });

  // ✅ Load products from backend
  useEffect(() => {
    fetchProducts();

    // mock data for other tabs
    const storedOrders =
      JSON.parse(localStorage.getItem("burger_shop_orders")) || [];
    const mockUsers = [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" },
      { id: 3, name: "Alex Carter", email: "alex@example.com" },
    ];

    setOrders(storedOrders);
    setUsers(mockUsers);
  }, []);

  // ✅ Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  // ✅ Add new product to database
  const addProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.price)
      return alert("Please enter valid product details");

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProduct.name,
          price: newProduct.price,
          description: newProduct.description,
          image: newProduct.image,
          category: newProduct.category,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Product added successfully!");
        setNewProduct({
          name: "",
          price: "",
          image: "",
          description: "",
          category: "",
        });
        fetchProducts();
      } else {
        alert("❌ " + (data.message || "Error adding product"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    }
    setLoading(false);
  };

  // ✅ Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        alert("🗑️ Product deleted");
        fetchProducts();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // stats
  const stats = [
    { label: "Total Orders", value: orders.length, icon: Package, color: "text-blue-500" },
    {
      label: "Total Revenue",
      value:
        "LKR " +
        orders.reduce((acc, o) => acc + (o.total || 0), 0).toLocaleString(),
      icon: DollarSign,
      color: "text-green-500",
    },
    { label: "Total Users", value: users.length, icon: Users, color: "text-purple-500" },
    { label: "Growth", value: "+12%", icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" /> Settings
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 glass">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <p className="mb-2 text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Card className="p-6 glass">
          <Tabs defaultValue="products">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
            </TabsList>

            {/* PRODUCTS TAB */}
            <TabsContent value="products" className="mt-6">
              <h3 className="mb-4 text-xl font-bold">Manage Products</h3>

              {/* Add form */}
              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Price (LKR)"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />
                <Input
                  placeholder="Image URL"
                  value={newProduct.image}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <Input
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, description: e.target.value })
                  }
                />
                <Input
                  placeholder="Category"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                />
              </div>

              <Button onClick={addProduct} className="mt-4" disabled={loading}>
                <Plus className="w-4 h-4 mr-2" />
                {loading ? "Adding..." : "Add Product"}
              </Button>

              {/* Product List */}
              <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
                {products.length === 0 && (
                  <p className="text-muted-foreground">No products yet.</p>
                )}
                {products.map((p) => (
                  <Card
                    key={p._id}
                    className="p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold">{p.name}</p>
                      <p className="text-sm text-muted-foreground">
                        LKR {p.price}
                      </p>
                      {p.category && (
                        <p className="text-xs text-gray-500">{p.category}</p>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => deleteProduct(p._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* ORDERS */}
            <TabsContent value="orders" className="mt-6">
              <h3 className="mb-4 text-xl font-bold">Recent Orders</h3>
              {orders.length === 0 ? (
                <p className="text-muted-foreground">No orders yet.</p>
              ) : (
                orders.map((o) => (
                  <Card key={o.id} className="p-4">
                    <div className="flex justify-between">
                      <p className="font-bold">{o.id}</p>
                      <p className="text-primary font-semibold">{o.status}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total: LKR {o.total.toFixed(2)}
                    </p>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* USERS */}
            <TabsContent value="users" className="mt-6">
              <h3 className="mb-4 text-xl font-bold">User Management</h3>
              {users.map((u) => (
                <Card key={u.id} className="p-4 flex justify-between">
                  <div>
                    <p className="font-bold">{u.name}</p>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                  </div>
                </Card>
              ))}
            </TabsContent>

            {/* CHALLENGES */}
            <TabsContent value="challenges" className="mt-6">
              <h3 className="mb-4 text-xl font-bold">Manage Challenges</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder="Challenge Title"
                  value={newChallenge.title}
                  onChange={(e) =>
                    setNewChallenge({ ...newChallenge, title: e.target.value })
                  }
                />
                <Input
                  placeholder="Reward Points"
                  type="number"
                  value={newChallenge.reward}
                  onChange={(e) =>
                    setNewChallenge({ ...newChallenge, reward: e.target.value })
                  }
                />
              </div>
              <Button
                onClick={() => {
                  alert("Challenge feature is local-only demo 😊");
                }}
                className="mt-4"
              >
                <Plus className="w-4 h-4 mr-2" /> Create Challenge
              </Button>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
