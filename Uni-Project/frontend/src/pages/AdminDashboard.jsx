import React, { useState, useEffect, useMemo } from "react";
import io from "socket.io-client"; // ✅ Socket.IO client
import { Card } from "../components/ui/card";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"; // ✅ Collapsible import
import jsPDF from 'jspdf'; // ✅ jsPDF
import html2canvas from 'html2canvas'; // ✅ html2canvas
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
  Loader2,
  Bell, // ✅ Bell icon
  ChevronDown, // ✅ Icon for collapsible
  Receipt, // ✅ Icon for bill
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../components/ui/dropdown-menu";
import { Badge } from "../components/ui/badge";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog"; // Dialog Component

// Define the base URLs
const BASE_URL = "http://localhost:3000";
const API_URL = `${BASE_URL}/api`;
const LOGO_URL = `${BASE_URL}/logo.png`;

const FIXED_CATEGORIES = [
  "classic",
  "premium",
  "veggie",
  "spicy",
  "side",
  "drink",
  "burgers",
  "dessert",
  "specials",
  "submarines",
];

// ✅ Collapsible components from Radix UI
const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.Trigger;
const CollapsibleContent = CollapsiblePrimitive.Content;

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // ✅ PDF generation state

  const { user } = useAuth();
  const { toast } = useToast();

  // ✅ Notification State
  const [notifications, setNotifications] = useState([]);
  const [showNotificationDot, setShowNotificationDot] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  useEffect(() => {
    if (user && user.token && user.role === "admin") {
      fetchProducts();
      fetchUsers();
      fetchOrders();

      // ✅ Socket.IO Connection
      const socket = io(BASE_URL);

      // Admin බව server එකට දැනුම් දීම
      socket.emit("join_admin_room");

      // 'new_order' event එකට සවන් දීම
      socket.on("new_order", (notification) => {
        console.log("New Order Notification Received:", notification);

        // UI එකේ notification එක පෙන්වීම
        toast({
          title: "🔔 New Order Received!",
          description: `Order #${notification.orderId.slice(
            -6
          )} for LKR ${notification.totalAmount.toFixed(2)}`,
          duration: 5000,
        });

        // Notification list එකට එකතු කිරීම
        setNotifications((prev) => [notification, ...prev]);
        setShowNotificationDot(true);

        // Order list එක refresh කිරීම
        fetchOrders();
      });

      return () => socket.disconnect(); // Component unmount වන විට connection එක විසන්ධි කිරීම
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
        headers: { Authorization: `Bearer ${token}` },
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
          Authorization: `Bearer ${token}`,
        },
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
    if (
      !newProduct.name.trim() ||
      !newProduct.price ||
      !newProduct.category ||
      !selectedFile
    ) {
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
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();

      if (res.ok) {
        toast({
          title: "✅ Success!",
          description: "Product added successfully.",
          duration: 2000,
        });
        setNewProduct({ name: "", price: "", description: "", category: "" });
        setSelectedFile(null);
        setImagePreviewUrl(null);
        fetchProducts();
      } else {
        toast({
          title: "❌ Error",
          description:
            data.message || "Error adding product. Check server logs.",
          variant: "destructive",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Server Error",
        description: "Could not connect to server.",
        variant: "destructive",
        duration: 2000,
      });
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
      return toast({
        title: "Missing fields",
        description: "Please enter valid product details.",
        variant: "destructive",
        duration: 2000,
      });

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
        headers: { Authorization: `Bearer ${user?.token}` }, // Token added
      });
      const data = await res.json();

      if (res.ok) {
        toast({
          title: "✅ Success!",
          description: "Product updated successfully.",
          duration: 2000,
        });
        cancelEdit();
        fetchProducts();
      } else {
        toast({
          title: "❌ Error",
          description: data.message || "Error updating product",
          variant: "destructive",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Server Error",
        description: "Could not connect to server.",
        variant: "destructive",
        duration: 2000,
      });
    }
    setIsSaving(false);
  };

  // ✅ Product Delete Logic (window.confirm removed)
  const deleteProduct = async (id) => {
    // Note: Confirmation is handled by the Dialog component UI.
    const token = user?.token;
    if (!token || user?.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "Not authorized to delete products.",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) {
        toast({
          title: "🗑️ Deleted!",
          description: "Product deleted successfully.",
          duration: 2000,
        });
        fetchProducts();
      } else {
        const data = await res.json();
        toast({
          title: "❌ Error",
          description: data.message || "Failed to delete product",
          variant: "destructive",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setNewProduct({
      name: "",
      price: "",
      image: "",
      description: "",
      category: "",
    });
    setSelectedFile(null);
    setImagePreviewUrl(null);
  };

  // --- Order Status Management and Delete ---

  const updateOrderStatus = async (orderId, newStatus) => {
    const token = user?.token;
    if (!token || user?.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "Not authorized to change status.",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    if (
      !window.confirm(
        `Change status of Order #${orderId.slice(-6)} to ${newStatus}?`
      )
    )
      return;

    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newStatus }),
      });

      if (res.ok) {
        toast({
          title: "✅ Updated",
          description: `Status changed to ${newStatus}`,
          duration: 2000,
        });
        fetchOrders();
      } else {
        const data = await res.json();
        toast({
          title: "❌ Error",
          description: data.message || "Failed to update status",
          variant: "destructive",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast({
        title: "Server Error",
        description: "Error connecting to API.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  // Frontend Delete Order Function
  const deleteOrder = async (orderId) => {
    const token = user?.token;
    if (!token || user?.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "Not authorized to delete orders.",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/orders/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast({
          title: "🗑️ Deleted!",
          description: "Order deleted successfully.",
          duration: 2000,
        });
        fetchOrders();
      } else {
        const data = await res.json();
        toast({
          title: "❌ Error",
          description: data.message || "Failed to delete order",
          variant: "destructive",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Delete order error:", error);
      toast({
        title: "Server Error",
        description: "Error connecting to API.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  // ✅ Bill Generation Logic (from Cart.jsx, adapted for Admin)
  const generateBillForOrder = async (order) => {
    if (!order || !order.userId) {
      toast({ title: '❌ Error', description: 'Order data is incomplete.', variant: 'destructive' });
      return;
    }
    setIsDownloading(true);
    const invoiceElement = document.getElementById('invoice-content');

    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 350.00; // Assuming a fixed fee for now
    const discount = subtotal + deliveryFee - order.totalAmount;

    // Dynamic Data Populate
    document.getElementById('invoice-order-id').textContent = `#${order._id.slice(-6)}`;
    document.getElementById('invoice-customer-name').textContent = order.userId.name;
    document.getElementById('invoice-customer-email').textContent = order.userId.email;
    document.getElementById('invoice-address').textContent = order.address;
    document.getElementById('invoice-date').textContent = new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    
    const itemBody = document.getElementById('invoice-item-body');
    itemBody.innerHTML = '';
    order.items.forEach((item, index) => {
        const row = itemBody.insertRow(index);
        row.style.height = '40px';
        row.style.backgroundColor = index % 2 === 0 ? '#fafafa' : '#ffffff';

        row.insertCell(0).textContent = item.name;
        row.insertCell(1).textContent = item.quantity;
        row.insertCell(2).textContent = `LKR ${item.price.toFixed(2)}`;
        row.insertCell(3).textContent = `LKR ${(item.price * item.quantity).toFixed(2)}`;
    });

    // Summary totals set
    document.getElementById('invoice-subtotal').textContent = `LKR ${subtotal.toFixed(2)}`;
    document.getElementById('invoice-delivery').textContent = `LKR ${deliveryFee.toFixed(2)}`;
    document.getElementById('invoice-discount').textContent = `- LKR ${discount.toFixed(2)}`; 
    document.getElementById('invoice-total').textContent = `LKR ${order.totalAmount.toFixed(2)}`;
    
    document.getElementById('invoice-logo').src = LOGO_URL; 

    try {
        const canvas = await html2canvas(invoiceElement, {
            scale: 1.5, logging: false, useCORS: true, windowWidth: 800, windowHeight: invoiceElement.scrollHeight
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4'); 
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Order_Invoice_${order._id.slice(-6)}.pdf`);
        
        toast({ title: '📥 Download Complete', description: 'Invoice has been downloaded.', duration: 2000 });
    } catch (error) {
        console.error("PDF Generation Error:", error);
        toast({ title: '❌ Download Failed', description: 'Could not generate PDF invoice.', variant: 'destructive', duration: 2000 });
    } finally {
        setIsDownloading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      case "preparing":
        return "bg-primary/10 text-primary border-primary/20";
      case "on-the-way":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "delivered":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const totalRevenue = useMemo(() => {
    return orders
      .filter((order) => order.status === "delivered")
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  }, [orders]);

  const stats = [
    {
      label: "Products",
      value: products.length,
      icon: Package,
      color: "text-blue-500",
    },
    {
      label: "Orders",
      value: orders.length,
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      label: "Users",
      value: users.length,
      icon: Users,
      color: "text-orange-500",
    },
    {
      label: "Revenue",
      value: `LKR ${totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-purple-500",
    },
  ];

  // -----------------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />
      <div className="container px-4 py-8 mx-auto">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            {/* ✅ Notification Bell */}
            <DropdownMenu onOpenChange={() => setShowNotificationDot(false)}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {showNotificationDot && (
                    <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-2 font-bold">
                  Notifications ({notifications.length})
                </div>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((n) => (
                    <DropdownMenuItem
                      key={n.orderId}
                      className="flex flex-col items-start gap-1"
                    >
                      <p className="font-semibold">{n.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(n.timestamp).toLocaleTimeString()}
                      </p>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <p className="p-4 text-sm text-center text-muted-foreground">
                    No new notifications.
                  </p>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" /> Settings
            </Button>
          </div>
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
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                />
                <Select
                  value={newProduct.category}
                  onValueChange={(value) =>
                    setNewProduct({ ...newProduct, category: value })
                  }
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
                    <p className="text-sm font-semibold mb-1">
                      New Image Preview:
                    </p>
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
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={cancelEdit}
                      disabled={isSaving}
                    >
                      <X className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={addProduct} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
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
                  <Card
                    key={p._id}
                    className="p-4 flex justify-between items-center"
                  >
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
                        <p className="text-sm text-muted-foreground">
                          LKR {p.price}
                        </p>
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
              <h3 className="mb-4 text-xl font-bold">
                Recent Orders ({orders.length})
              </h3>
              {orders.length === 0 ? (
                <p className="text-muted-foreground">No orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => ( // 'o' for order
                    <Collapsible key={o._id} asChild>
                      <Card className="p-0 glass">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4">
                          <div className="flex-1">
                            <p className="font-bold text-lg">
                              Order #{o._id.slice(-6)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Total: LKR {o.totalAmount?.toFixed(2)} | Customer:
                              <span className="font-semibold text-foreground block md:inline-block">
                                {o.userId && typeof o.userId === "object"
                                  ? o.userId.name
                                  : "N/A"}
                              </span>
                            </p>
                            <p
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block capitalize ${getStatusColor(
                                o.status
                              )}`}
                            >
                              {o.status.replace("-", " ")}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            <CollapsibleTrigger asChild>
                              <Button variant="outline" size="sm" className="gap-2">
                                View Items <ChevronDown className="w-4 h-4" />
                              </Button>
                            </CollapsibleTrigger>
                            <Select
                              value={o.status}
                              onValueChange={(newStatus) =>
                                updateOrderStatus(o._id, newStatus)
                              }
                            >
                              <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Update Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="preparing">Preparing</SelectItem>
                                <SelectItem value="on-the-way">On The Way</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                              </SelectContent>
                            </Select>
                            <ConfirmDeleteDialog
                              orderId={o._id}
                              orderSlice={o._id.slice(-6)}
                              onConfirm={deleteOrder}
                            />
                          </div>
                        </div>

                        {/* Collapsible Content for Order Items */}
                        <CollapsibleContent className="p-4 pt-0">
                          <div className="p-4 mt-4 border-t border-border/50 bg-background/30 rounded-md">
                            <h4 className="font-semibold mb-3">Order Items</h4>
                            <div className="space-y-2">
                              {o.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    {item.quantity} &times; {item.name}
                                  </span>
                                  <span className="font-medium">
                                    LKR {(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-border/20 flex justify-end">
                               <Button 
                                size="sm" 
                                variant="secondary" 
                                className="gap-2"
                                onClick={() => generateBillForOrder(o)}
                                disabled={isDownloading}
                               >
                                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Receipt className="w-4 h-4" />}
                                {isDownloading ? "Generating..." : "Generate Bill"}
                               </Button>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
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
                  <Card
                    key={u._id}
                    className="p-4 flex justify-between mb-2 items-center"
                  >
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

      {/* 🛑 Hidden Invoice Content for PDF Generation (Copied from Cart.jsx) 🛑 */}
      <div 
        id="invoice-content"
        style={{
            position: 'absolute',
            left: '-9999px',
            top: '0',
            width: '800px', 
            backgroundColor: '#ffffff',
            color: '#333333',
            padding: '40px',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}
      >
        {/* Invoice Header (Logo and Title) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid #f97316', paddingBottom: '15px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img id="invoice-logo" src={LOGO_URL} alt="BurgerShop Logo" style={{ height: '60px', marginRight: '15px', objectFit: 'contain' }} crossOrigin="anonymous" />
                <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#f97316' }}>BURGER SHOP</span>
            </div>
            <h1 style={{ fontSize: '32px', color: '#666', fontWeight: '300' }}>SALES INVOICE</h1>
        </div>
        
        {/* Customer & Order Details */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
            <div style={{ lineHeight: '1.8', fontSize: '14px' }}>
                <p style={{ fontWeight: 'bold', color: '#f97316', marginBottom: '5px' }}>BILL TO:</p>
                <p style={{ fontWeight: 'bold' }}><span id="invoice-customer-name"></span></p>
                <p><span id="invoice-customer-email"></span></p>
                <p>Delivery Address: <span id="invoice-address"></span></p>
            </div>
            <div style={{ lineHeight: '1.8', fontSize: '14px', textAlign: 'right' }}>
                <p style={{ fontSize: '16px' }}><strong>Invoice #:</strong> <span id="invoice-order-id"></span></p>
                <p style={{ fontSize: '16px' }}><strong>Invoice Date:</strong> <span id="invoice-date"></span></p>
                <p style={{ marginTop: '10px', fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>STATUS: PAID</p>
            </div>
        </div>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px', fontSize: '14px' }}>
            <thead>
                <tr style={{ backgroundColor: '#f97316', color: '#ffffff' }}>
                    <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: 'bold', border: 'none' }}>ITEM DESCRIPTION</th>
                    <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: 'bold', border: 'none' }}>QTY</th>
                    <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: 'bold', border: 'none' }}>UNIT PRICE</th>
                    <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: 'bold', border: 'none' }}>AMOUNT</th>
                </tr>
            </thead>
            <tbody id="invoice-item-body" style={{ color: '#333' }}></tbody>
        </table>
        
        {/* Totals Section */}
        <div style={{ float: 'right', width: '50%', fontSize: '16px', lineHeight: '2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}><span>Subtotal:</span><span id="invoice-subtotal" style={{ fontWeight: 'bold' }}></span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}><span>Delivery Fee:</span><span id="invoice-delivery" style={{ fontWeight: 'bold' }}></span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: '#eab308' }}><span>Coupon Discount:</span><span id="invoice-discount" style={{ fontWeight: 'bold' }}></span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderTop: '2px solid #333', marginTop: '15px', fontSize: '22px', fontWeight: 'bolder' }}><span>GRAND TOTAL (LKR):</span><span id="invoice-total" style={{ color: '#f97316' }}></span></div>
        </div>
        
        <div style={{ clear: 'both', paddingTop: '60px', textAlign: 'center', fontSize: '12px', color: '#666', borderTop: '1px solid #eee', marginTop: '40px' }}><p>Payment due upon receipt. Thank you for choosing BurgerShop!</p></div>
      </div>
    </div>
  );
};

export default AdminDashboard;
