/* eslint-disable no-unused-vars */
// src/Cart.jsx
import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

function Cart() {
    // A more realistic way to handle cart state: start with an empty array.
    // In a real app, this state would likely be managed in a global context.
    const [cart, setCart] = useState([]);

    // Dummy list of available items to simulate a real menu.
    const availableItems = [
        { id: 'burger_1', item: 'Classic Cheeseburger', price: 900 },
        { id: 'burger_2', item: 'BBQ Bacon Burger', price: 950 },
        { id: 'burger_3', item: 'Veggie Burger', price: 850 },
        { id: 'sub_1', item: 'Chicken Submarine', price: 850 },
        { id: 'sub_2', item: 'Tuna Submarine', price: 850 },
        { id: 'sub_3', item: 'Veggie Submarine', price: 750 },
        { id: 'fries_1', item: 'Classic Fries', price: 400 },
        { id: 'fries_2', item: 'Cheese Fries', price: 450 },
        { id: 'fries_3', item: 'Spicy Fries', price: 500 },
        { id: 'drink_1', item: 'Cola', price: 300 },
        { id: 'drink_2', item: 'Sprite', price: 350 },
        { id: 'drink_3', item: 'Fanta', price: 320 }
    ];

    // Dummy function to simulate adding an item to the cart from a menu page.
    // You would call this function from your menu component.
    const addToCart = (itemToAdd) => {
        // Check if the item already exists in the cart
        const existingItem = cart.find(cartItem => cartItem.id === itemToAdd.id);
        if (existingItem) {
            // If it exists, update the quantity
            const newCart = cart.map(cartItem => 
                cartItem.id === itemToAdd.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            );
            setCart(newCart);
        } else {
            // If it's a new item, add it to the cart with a quantity of 1
            setCart([...cart, { ...itemToAdd, quantity: 1, discountPercentage: 0 }]);
        }
    };
    
    // Handler to update item quantity
    const updateQuantity = (id, quantity) => {
        const newCart = cart.map(cartItem =>
            cartItem.id === id ? { ...cartItem, quantity: parseInt(quantity) || 0 } : cartItem
        );
        // Filter out items with a quantity of 0
        setCart(newCart.filter(item => item.quantity > 0));
    };

    // Handler to update item discount
    const updateDiscount = (id, discountPercentage) => {
        const newCart = cart.map(cartItem =>
            cartItem.id === id ? { ...cartItem, discountPercentage: parseInt(discountPercentage) || 0 } : cartItem
        );
        setCart(newCart);
    };

    // Handler to remove an item from the cart
    const removeItem = (id) => {
        const newCart = cart.filter(cartItem => cartItem.id !== id);
        setCart(newCart);
    };

    // Function to calculate the total cart amount
    const calculateTotal = () => {
        return cart.reduce((acc, cartItem) => {
            const discountAmount = (cartItem.price * cartItem.discountPercentage) / 100;
            return acc + (cartItem.price - discountAmount) * cartItem.quantity;
        }, 0);
    };

    // Function to generate PDF bill
    const generatePDF = () => {
        const doc = new jsPDF();
        let y = 15; // Starting y position

        doc.setFontSize(22);
        doc.setTextColor(245, 158, 11); // A custom yellow color
        doc.text('GrillMelt - Your Order', 10, y);
        y += 10;

        doc.setLineWidth(0.5);
        doc.line(10, y, 200, y); // Draw a line
        y += 10;

        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255); // White text on dark background
        
        // This loop now only iterates over items in the actual cart
        cart.forEach(cartItem => {
            const discountAmount = (cartItem.price * cartItem.discountPercentage) / 100;
            const itemTotal = (cartItem.price - discountAmount) * cartItem.quantity;
            
            doc.text(`${cartItem.item} x ${cartItem.quantity}`, 10, y);
            doc.text(`LKR ${cartItem.price.toFixed(2)}`, 60, y);
            doc.text(`Discount: ${cartItem.discountPercentage}%`, 90, y);
            doc.text(`Subtotal: LKR ${itemTotal.toFixed(2)}`, 140, y);
            y += 10;
        });
        
        y += 10;
        doc.setLineWidth(0.5);
        doc.line(10, y, 200, y);
        y += 10;
        
        doc.setFontSize(16);
        doc.setTextColor(245, 158, 11);
        doc.text(`Total: LKR ${calculateTotal().toFixed(2)}`, 10, y);

        doc.save('grillmelt_bill.pdf');
    };

    // This component now includes a button to add dummy items for demonstration.
    // In a real application, you would pass this functionality down from a parent component.
    const addRandomItem = () => {
        const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
        addToCart(randomItem);
    };

    return (
        <div className="min-h-screen bg-black text-white font-poppins flex flex-col">
            <Header/>
            <div className="container mx-auto px-4 py-8 mt-20 flex-grow">
                <h1 className="text-3xl font-bold text-center text-yellow-400 mb-6">Your Cart</h1>
                {/* A button to add dummy items for testing */}
                <div className="text-center mb-6">
                    <button 
                        onClick={addRandomItem} 
                        className="bg-yellow-500 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-600 transition-colors"
                    >
                        Add Random Item to Cart
                    </button>
                </div>

                {cart.length > 0 ? (
                    <div className="overflow-x-auto shadow-lg rounded-lg">
                        <table className="min-w-full bg-gray-900 text-white rounded-lg overflow-hidden">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 text-left border-b-2 border-yellow-400">Item</th>
                                    <th className="py-3 px-4 text-left border-b-2 border-yellow-400">Price (LKR)</th>
                                    <th className="py-3 px-4 text-left border-b-2 border-yellow-400">Quantity</th>
                                    <th className="py-3 px-4 text-left border-b-2 border-yellow-400">Discount (%)</th>
                                    <th className="py-3 px-4 text-left border-b-2 border-yellow-400">Subtotal (LKR)</th>
                                    <th className="py-3 px-4 text-left border-b-2 border-yellow-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((cartItem) => {
                                    const discountAmount = (cartItem.price * cartItem.discountPercentage) / 100;
                                    const itemTotal = (cartItem.price - discountAmount) * cartItem.quantity;
                                    return (
                                        <tr key={cartItem.id} className="border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200">
                                            <td className="py-3 px-4">{cartItem.item}</td>
                                            <td className="py-3 px-4">{cartItem.price}</td>
                                            <td className="py-3 px-4">
                                                <input
                                                    type="number"
                                                    value={cartItem.quantity}
                                                    min="1" // Updated min to 1
                                                    className="w-20 p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-yellow-400"
                                                    onChange={(e) => updateQuantity(cartItem.id, e.target.value)}
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <input
                                                    type="number"
                                                    value={cartItem.discountPercentage}
                                                    min="0"
                                                    max="100"
                                                    className="w-20 p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-yellow-400"
                                                    onChange={(e) => updateDiscount(cartItem.id, e.target.value)}
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="font-semibold">{itemTotal.toFixed(2)}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <button
                                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm transition-all duration-300 hover:bg-red-700"
                                                    onClick={() => removeItem(cartItem.id)}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-400">
                        <p className="text-xl">Your cart is empty. Start adding some delicious items!</p>
                    </div>
                )}
                
                {cart.length > 0 && (
                    <div className="text-right mt-8">
                        <h4 className="text-3xl font-bold">Total: LKR {calculateTotal().toFixed(2)}</h4>
                        <button
                            className="bg-yellow-400 text-black px-6 py-3 rounded-full mt-6 font-semibold transition-all duration-300 hover:bg-yellow-500 hover:-translate-y-1"
                            onClick={generatePDF}
                        >
                            <span className="flex items-center gap-2">
                                <span className="text-xl">📄</span> Bill Receipt
                            </span>
                        </button>
                    </div>
                )}
            </div>
            <Footer/>
        </div>
    );
}

export default Cart;