// src/pages/admin/AdminMenuItems.jsx
import React, { useContext, useState } from 'react';
import AdminHeader from '../../components/layout/AdminHeader';
import Footer from '../../components/layout/Footer';
import { CartContext } from '../../contexts/CartContext';
import AdminMenuItemCard from '../../components/admin/AdminMenuItemCard';

const AdminMenuItems = () => {
    const { menuItems, addMenuItem, removeMenuItem, updateMenuItem } = useContext(CartContext);
    const [newItem, setNewItem] = useState({ name: '', price: '', description: '', imagePath: '' });

    const handleAddItem = (e) => {
        e.preventDefault();
        addMenuItem({
            name: newItem.name,
            price: parseFloat(newItem.price),
            description: newItem.description,
            imagePath: newItem.imagePath
        });
        setNewItem({ name: '', price: '', description: '', imagePath: '' }); 
    };
    
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <AdminHeader />
            <div className="container mx-auto px-4 py-8 flex-grow">
                <h1 className="text-4xl font-bold text-center text-yellow-400 mb-8">Manage Menu Items</h1>
                
                {/* Add New Item Form */}
                <form onSubmit={handleAddItem} className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Add New Item</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                            type="text" 
                            placeholder="Item Name" 
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            className="bg-gray-700 p-3 rounded-md border border-gray-600 focus:outline-none focus:border-yellow-400"
                            required 
                        />
                        <input 
                            type="number" 
                            placeholder="Price (LKR)" 
                            value={newItem.price}
                            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                            className="bg-gray-700 p-3 rounded-md border border-gray-600 focus:outline-none focus:border-yellow-400"
                            required 
                        />
                        <input 
                            type="text" 
                            placeholder="Image URL" 
                            value={newItem.imagePath}
                            onChange={(e) => setNewItem({ ...newItem, imagePath: e.target.value })}
                            className="bg-gray-700 p-3 rounded-md border border-gray-600 focus:outline-none focus:border-yellow-400"
                            required 
                        />
                        <input 
                            type="text" 
                            placeholder="Description" 
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            className="bg-gray-700 p-3 rounded-md border border-gray-600 focus:outline-none focus:border-yellow-400"
                            required 
                        />
                    </div>
                    <button type="submit" className="w-full mt-6 bg-yellow-400 text-black font-bold py-3 rounded-md hover:bg-yellow-500 transition-colors">
                        Add Item to Menu
                    </button>
                </form>

                {/* List of Current Menu Items */}
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Current Menu Items</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map(item => (
                        <AdminMenuItemCard 
                            key={item.id} 
                            item={item} 
                            onRemove={removeMenuItem} 
                            onUpdate={updateMenuItem}
                        />
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AdminMenuItems;