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
  Edit,
  Save,
  X,
  Upload,
  Loader2
} from "lucide-react";
import Navbar from "../components/Navbar";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast"; 
import RewardDashboard from "../components/RewardDashboard"; 
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog"; // Dialog Component


// Define the base URLs
const BASE_URL = "http://localhost:3000";
const API_URL = `${BASE_URL}/api`;

const FIXED_CATEGORIES = [
  "classic",
  "premium",
  "veggie",
  "spicy",
  "side",
  "drink",
];

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]); 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false); 
  
  const { user } = useAuth(); 
  const { toast } = useToast();

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  useEffect(() => {
    if (user && user.token && user.role === 'admin') { 
        fetchProducts();
        fetchUsers();
        fetchOrders(); 
    }
  }, [user]);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setImagePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreviewUrl(null);
    }
  }, [selectedFile]);

  // --- Data Fetching Functions ---
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Products API did not return an array.");
        setProducts([]);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const fetchUsers = async () => {
    const token = user?.token;
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/users`, {
          headers: { 'Authorization': `Bearer ${token}` } 
      }); 
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("Users API did not return an array or failed.");
        setUsers([]);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
    }
  };

  const fetchOrders = async () => {
    const token = user?.token;
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/orders`, {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
      }); 
      const data = await res.json();
      
      if (res.ok && Array.isArray(data)) { 
        setOrders(data);
      } else {
        console.error("Orders API failed or did not return an array:", data);
        setOrders([]); 
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      setOrders([]); 
    }
  };

  // --- Product Management Functions ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };
  
  const addProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.price || !newProduct.category || !selectedFile) {
      return toast({
        title: "Missing fields",
        description: "Please enter all product details and select an image.",
        variant: "destructive",
        duration: 2000,
      });
    }

    setIsSaving(true);
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("category", newProduct.category);
    formData.append("imageFile", selectedFile);
    
    try {
        const res = await fetch(`${API_URL}/products`, { 
            method: "POST", 
            body: formData, 
            headers: { 'Authorization': `Bearer ${user?.token}` } 
        });
        const data = await res.json();

        if (res.ok) {
            toast({title: "✅ Success!", description: "Product added successfully.", duration: 2000});
            setNewProduct({ name: "", price: "", description: "", category: "" });
            setSelectedFile(null);
            setImagePreviewUrl(null);
            fetchProducts();
        } else {
            toast({title: "❌ Error", description: data.message || "Error adding product. Check server logs.", variant: "destructive", duration: 2000});
        }
    } catch (error) {
        console.error("Error:", error);
        toast({title: "Server Error", description: "Could not connect to server.", variant: "destructive", duration: 2000});
    }
    setIsSaving(false);
  };
  
  const startEditing = (product) => {
    setEditingProduct(product._id);
    setNewProduct({
      name: product.name,
      price: product.price,
      image: product.image || "",
      description: product.description,
      category: product.category,
    });
    setSelectedFile(null);
    setImagePreviewUrl(null);
  };
  
  const updateProduct = async () => { 
    if (!newProduct.name.trim() || !newProduct.price || !newProduct.category)
        return toast({title: "Missing fields", description: "Please enter valid product details.", variant: "destructive", duration: 2000});

    setIsSaving(true);
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("category", newProduct.category);

    if (selectedFile) {
      formData.append("imageFile", selectedFile);
    }
    
    try {
        const res = await fetch(`${API_URL}/products/${editingProduct}`, { 
            method: "PUT", 
            body: formData, 
            headers: { 'Authorization': `Bearer ${user?.token}` } // Token added
        });
        const data = await res.json();

        if (res.ok) {
            toast({title: "✅ Success!", description: "Product updated successfully.", duration: 2000});
            cancelEdit();
            fetchProducts();
        } else {
            toast({title: "❌ Error", description: data.message || "Error updating product", variant: "destructive", duration: 2000});
        }
    } catch (error) {
        console.error("Update error:", error);
        toast({title: "Server Error", description: "Could not connect to server.", variant: "destructive", duration: 2000});
    }
    setIsSaving(false);
  };

  // ✅ Product Delete Logic (window.confirm removed)
  const deleteProduct = async (id) => {
    // Note: Confirmation is handled by the Dialog component UI.
    const token = user?.token;
    if (!token || user?.role !== 'admin') {
      toast({title: "Access Denied", description: "Not authorized to delete products.", variant: "destructive", duration: 2000});
      return;
    }

    try {
      const res = await fetch(`${API_URL}/products/${id}`, { 
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${user?.token}` } 
      });
      if (res.ok) {
        toast({title: "🗑️ Deleted!", description: "Product deleted successfully.", duration: 2000});
        fetchProducts();
      } else {
        const data = await res.json();
        toast({title: "❌ Error", description: data.message || "Failed to delete product", variant: "destructive", duration: 2000});
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setNewProduct({ name: "", price: "", image: "", description: "", category: "" });
    setSelectedFile(null);
    setImagePreviewUrl(null);
  };

  // --- Order Status Management and Delete ---

  const updateOrderStatus = async (orderId, newStatus) => {
      const token = user?.token;
      if (!token || user?.role !== 'admin') {
          toast({title: "Access Denied", description: "Not authorized to change status.", variant: "destructive", duration: 2000});
          return;
      }

      if (!window.confirm(`Change status of Order #${orderId.slice(-6)} to ${newStatus}?`)) return;

      try {
          const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
              method: 'PUT',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`, 
              },
              body: JSON.stringify({ newStatus }),
          });

          if (res.ok) {
              toast({title: "✅ Updated", description: `Status changed to ${newStatus}`, duration: 2000});
              fetchOrders(); 
          } else {
              const data = await res.json();
              toast({title: "❌ Error", description: data.message || 'Failed to update status', variant: "destructive", duration: 2000});
          }
      } catch (error) {
          console.error('Status update error:', error);
          toast({title: "Server Error", description: 'Error connecting to API.', variant: "destructive", duration: 2000});
      }
  };
  
  // Frontend Delete Order Function 
  const deleteOrder = async (orderId) => {
      const token = user?.token;
      if (!token || user?.role !== 'admin') {
          toast({title: "Access Denied", description: "Not authorized to delete orders.", variant: "destructive", duration: 2000});
          return;
      }

      try {
          const res = await fetch(`${API_URL}/orders/${orderId}`, { 
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` },
          });

          if (res.ok) {
              toast({title: "🗑️ Deleted!", description: "Order deleted successfully.", duration: 2000});
              fetchOrders(); 
          } else {
              const data = await res.json();
              toast({title: "❌ Error", description: data.message || 'Failed to delete order', variant: "destructive", duration: 2000});
          }
      } catch (error) {
          console.error('Delete order error:', error);
          toast({title: "Server Error", description: 'Error connecting to API.', variant: "destructive", duration: 2000});
      }
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      case 'preparing': return 'bg-primary/10 text-primary border-primary/20';
      case 'on-the-way': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'delivered': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const stats = [
    { label: "Products", value: products.length, icon: Package, color: "text-blue-500" },
    { label: "Orders", value: orders.length, icon: DollarSign, color: "text-green-500" },
    { label: "Users", value: users.length, icon: Users, color: "text-orange-500" },
    { label: "Revenue", value: "LKR 0.00", icon: TrendingUp, color: "text-purple-500" },
  ];

  // -----------------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />
      <div className="container px-4 py-8 mx-auto">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" /> Settings
          </Button>
        </div>

        {/* Stats Section */}
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

        {/* Tabs Section */}
        <Card className="p-6 glass">
          <Tabs defaultValue="products">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="challenges">Rewards</TabsTrigger> 
            </TabsList>

            {/* PRODUCTS TAB */}
            <TabsContent value="products" className="mt-6">
              <h3 className="mb-4 text-xl font-bold">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h3>
              {/* Product Form UI */}
              {/* ... (Form inputs) ... */}
              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <Input
                  placeholder="Price (LKR)"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  <Button size="icon" variant="outline" title="Upload Image">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <Input
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
                <Select
                  value={newProduct.category}
                  onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {FIXED_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Image Preview and Buttons */}
              <div className="mt-4 flex flex-col md:flex-row gap-4 items-start">
                {editingProduct && newProduct.image && !selectedFile && (
                  <div className="p-2 border rounded-md">
                    <p className="text-sm font-semibold mb-1">Current Image:</p>
                    <img
                      src={`${BASE_URL}${newProduct.image}`}
                      alt="Current Product"
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </div>
                )}
                {imagePreviewUrl && (
                  <div className="p-2 border rounded-md">
                    <p className="text-sm font-semibold mb-1">New Image Preview:</p>
                    <img
                      src={imagePreviewUrl}
                      alt="New Image Preview"
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                {editingProduct ? (
                  <>
                    <Button onClick={updateProduct} disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button variant="secondary" onClick={cancelEdit} disabled={isSaving}>
                      <X className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={addProduct} disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                    {isSaving ? "Adding..." : "Add Product"}
                  </Button>
                )}
              </div>

              {/* Product List */}
              <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
                {products.length === 0 && (
                  <p className="text-muted-foreground">No products yet.</p>
                )}
                {products.map((p) => (
                  <Card key={p._id} className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      {p.image && (
                        <img
                          src={`${BASE_URL}${p.image}`}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      )}
                      <div>
                        <p className="font-bold">{p.name}</p>
                        <p className="text-sm text-muted-foreground">LKR {p.price}</p>
                        {p.category && (
                          <p className="text-xs text-gray-500">{p.category}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => startEditing(p)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      {/* 🎯 Products Delete Button (Modern Dialog භාවිතයෙන්) */}
                      <ConfirmDeleteDialog 
                            orderId={p._id} // ID eka yawanawa
                            orderSlice={p.name} // Order ID වෙනුවට Product Name පෙන්වන්න
                            onConfirm={deleteProduct} 
                            // Note: We use the same component but pass the product name/ID
                        />
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* ORDERS TAB */}
            <TabsContent value="orders" className="mt-6">
              <h3 className="mb-4 text-xl font-bold">Recent Orders ({orders.length})</h3>
              {orders.length === 0 ? (
                <p className="text-muted-foreground">No orders yet.</p>
              ) : (
                <div className="space-y-4">
                {orders.map((o) => (
                  <Card key={o._id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <p className="font-bold text-lg">Order #{o._id.slice(-6)}</p>
                      <p className="text-sm text-muted-foreground">
                        Total: LKR {o.totalAmount?.toFixed(2)} | Customer:
                        <span className="font-semibold text-foreground block md:inline-block">
                            {o.userId && typeof o.userId === 'object' 
                                ? o.userId.name 
                                : 'N/A'
                            }
                        </span>
                      </p>
                      <p className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block capitalize ${getStatusColor(o.status)}`}>
                        {o.status.replace('-', ' ')}
                      </p>
                    </div>

                    {/* Status Update Dropdown/Buttons */}
                    <div className="flex items-center gap-2">
                        <Select
                            value={o.status}
                            onValueChange={(newStatus) => updateOrderStatus(o._id, newStatus)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="preparing">Preparing</SelectItem>
                                <SelectItem value="on-the-way">On The Way</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                        </Select>
                        {/* Order Delete Button (Modern Dialog භාවිතයෙන්) */}
                        <ConfirmDeleteDialog 
                            orderId={o._id}
                            orderSlice={o._id.slice(-6)}
                            onConfirm={deleteOrder} 
                        />
                    </div>
                  </Card>
                ))}
                </div>
              )}
            </TabsContent>

            {/* CHALLENGES/REWARDS TAB */}
            <TabsContent value="challenges" className="mt-6">
              {/* ✅ Rewards Dashboard Component */}
              <RewardDashboard />
            </TabsContent>

            {/* USERS TAB (unchanged) */}
            <TabsContent value="users" className="mt-6">
              <h3 className="mb-4 text-xl font-bold">User Management</h3>
              {users.length === 0 ? (
                <p className="text-muted-foreground">No users found.</p>
              ) : (
                users.map((u) => (
                  <Card key={u._id} className="p-4 flex justify-between mb-2 items-center">
                    <div>
                      <p className="font-bold">{u.name}</p>
                      <p className="text-sm text-muted-foreground">{u.email}</p>
                      {u.role && (
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
                            u.role === "admin"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </span>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;