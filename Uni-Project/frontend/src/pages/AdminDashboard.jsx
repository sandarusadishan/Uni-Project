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
} from "lucide-react";
import Navbar from "../components/Navbar";
import { Input } from "../components/ui/input";
// ✅ NEW: Import Select components for the dropdown
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

// Define the base URLs
const BASE_URL = "http://localhost:3000"; // ✅ Base URL for static files (images)
const API_URL = `${BASE_URL}/api`; // API endpoint

// 🎯 Defining Fixed Categories for Admin Input
const FIXED_CATEGORIES = [
  'classic',
  'premium',
  'veggie',
  'spicy',
  'side',
  'drink',
];

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "",
  });
  
  const [selectedFile, setSelectedFile] = useState(null); 
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null); 

  // ✅ Fetch data
  useEffect(() => {
    fetchProducts();
    fetchUsers();
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setImagePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreviewUrl(null);
    }
  }, [selectedFile]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(data); 
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  // ✅ Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  // ✅ Add Product
  const addProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.price)
      return alert("Please enter valid product details");
    
    if (!newProduct.category)
      return alert("Please select a product category");
    
    if (!selectedFile)
      return alert("Please select an image file to upload");

    setLoading(true);
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
      });
      const data = await res.json();

      if (res.ok) {
        alert("✅ Product added successfully!");
        setNewProduct({
          name: "", price: "", image: "", description: "", category: "",
        });
        setSelectedFile(null); 
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

  // ✅ Edit Product
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

  // ✅ Update Product
  const updateProduct = async () => {
    setLoading(true);
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
      });
      const data = await res.json();

      if (res.ok) {
        alert("✅ Product updated!");
        setEditingProduct(null);
        setNewProduct({
          name: "", price: "", image: "", description: "", category: "",
        });
        setSelectedFile(null); 
        setImagePreviewUrl(null); 
        fetchProducts();
      } else {
        alert("❌ " + (data.message || "Error updating product"));
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Server error");
    }
    setLoading(false);
  };

  // ✅ Delete Product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("🗑️ Product deleted!");
        fetchProducts();
      } else {
        alert("❌ Failed to delete product");
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
              <h3 className="mb-4 text-xl font-bold">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h3>

              {/* Product Form */}
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
                {/* 🎯 Category Dropdown */}
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

              {/* Image Preview */}
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

              {/* Buttons */}
              <div className="flex gap-2 mt-4">
                {editingProduct ? (
                  <>
                    <Button onClick={updateProduct} disabled={loading}>
                      <Save className="w-4 h-4 mr-2" /> 
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button variant="secondary" onClick={cancelEdit}>
                      <X className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={addProduct} disabled={loading}>
                    <Plus className="w-4 h-4 mr-2" />
                    {loading ? "Adding..." : "Add Product"}
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
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => deleteProduct(p._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* ORDERS TAB */}
            <TabsContent value="orders" className="mt-6">
              <h3 className="mb-4 text-xl font-bold">Recent Orders</h3>
              {/* ... orders table ... */}
            </TabsContent>

            {/* USERS TAB */}
            <TabsContent value="users" className="mt-6">
              <h3 className="mb-4 text-xl font-bold">User Management</h3>
              {/* ... user list ... */}
            </TabsContent>

            {/* CHALLENGES TAB */}
            <TabsContent value="challenges" className="mt-6">
              <h3 className="mb-4 text-xl font-bold">Manage Challenges</h3>
              {/* ... challenges management ... */}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
