// src/Cart.jsx
import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf'; // Import jsPDF
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';

function Cart() {
    // State to manage the cart items
    const [cart, setCart] = useState([
        { item: 'Classic Cheeseburger', price: 900, quantity: 0, discountPercentage: 0 },
        { item: 'BBQ Bacon Burger', price: 950, quantity: 0, discountPercentage: 0 },
        { item: 'Veggie Burger', price: 850, quantity: 0, discountPercentage: 0 },
        { item: 'Chicken Submarine', price: 850, quantity: 0, discountPercentage: 0 },
        { item: 'Tuna Submarine', price: 850, quantity: 0, discountPercentage: 0 },
        { item: 'Veggie Submarine', price: 750, quantity: 0, discountPercentage: 0 },
        { item: 'Classic Fries', price: 400, quantity: 0, discountPercentage: 0 },
        { item: 'Cheese Fries', price: 450, quantity: 0, discountPercentage: 0 },
        { item: 'Spicy Fries', price: 500, quantity: 0, discountPercentage: 0 },
        { item: 'Cola', price: 300, quantity: 0, discountPercentage: 0 },
        { item: 'Sprite', price: 350, quantity: 0, discountPercentage: 0 },
        { item: 'Fanta', price: 320, quantity: 0, discountPercentage: 0 }
    ]);

    // Function to calculate the total cart amount
    const calculateTotal = () => {
        return cart.reduce((acc, cartItem) => {
            const discountAmount = (cartItem.price * cartItem.discountPercentage) / 100;
            return acc + (cartItem.price - discountAmount) * cartItem.quantity;
        }, 0);
    };

    // Handler to update item quantity
    const updateQuantity = (index, quantity) => {
        const newCart = [...cart];
        newCart[index].quantity = parseInt(quantity);
        setCart(newCart); // Update state to trigger re-render
    };

    // Handler to update item discount
    const updateDiscount = (index, discountPercentage) => {
        const newCart = [...cart];
        newCart[index].discountPercentage = parseInt(discountPercentage);
        setCart(newCart); // Update state to trigger re-render
    };

    // Handler to remove an item from the cart
    const removeItem = (index) => {
        const newCart = cart.filter((_, i) => i !== index);
        setCart(newCart); // Update state to trigger re-render
    };

    // Function to generate PDF bill
    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.setTextColor(40, 40, 40);
        doc.text('GrillMelt - Your Order', 10, 10);
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        let y = 20;

        cart.filter(cartItem => cartItem.quantity > 0).forEach(cartItem => {
            const discountAmount = (cartItem.price * cartItem.discountPercentage) / 100;
            doc.text(`${cartItem.item} - LKR ${cartItem.price} x ${cartItem.quantity} - Discount: LKR ${discountAmount.toFixed(2)} = LKR ${((cartItem.price - discountAmount) * cartItem.quantity).toFixed(2)}`, 10, y);
            y += 10;
        });

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`Total: LKR ${calculateTotal().toFixed(2)}`, 10, y + 10);
        doc.save('bill.pdf');
        
    };

    // useEffect can be used here for initial data loading or other side effects if needed.
    useEffect(() => {
        // console.log("Cart component mounted or updated");
    }, []); // Empty dependency array means this runs once after initial render

    return (
        // Wrap everything in a single parent element (e.g., a div or React Fragment)
        <div className="min-h-screen bg-black text-white font-poppins flex flex-col">
            <Header/> {/* Your Header component */}

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 flex-grow"> {/* flex-grow to push footer to bottom */}
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <div className="overflow-x-auto shadow-lg rounded-lg">
                    <table className="min-w-full bg-gray-900 text-white rounded-lg overflow-hidden">
                        <thead>
                            <tr>
                                <th className="py-3 px-4 text-left border-b-2 border-grillmelt-yellow">Item</th>
                                <th className="py-3 px-4 text-left border-b-2 border-grillmelt-yellow">Price (LKR)</th>
                                <th className="py-3 px-4 text-left border-b-2 border-grillmelt-yellow">Quantity</th>
                                <th className="py-3 px-4 text-left border-b-2 border-grillmelt-yellow">Discount (%)</th>
                                <th className="py-3 px-4 text-left border-b-2 border-grillmelt-yellow">Discount (LKR)</th>
                                <th className="py-3 px-4 text-left border-b-2 border-grillmelt-yellow">Total (LKR)</th>
                                <th className="py-3 px-4 text-left border-b-2 border-grillmelt-yellow">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((cartItem, index) => {
                                const discountAmount = (cartItem.price * cartItem.discountPercentage) / 100;
                                const itemTotal = (cartItem.price - discountAmount) * cartItem.quantity;
                                return (
                                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200">
                                        <td className="py-3 px-4">{cartItem.item}</td>
                                        <td className="py-3 px-4">{cartItem.price}</td>
                                        <td className="py-3 px-4">
                                            <input
                                                type="number"
                                                value={cartItem.quantity}
                                                min="0"
                                                className="w-20 p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-grillmelt-yellow"
                                                onChange={(e) => updateQuantity(index, e.target.value)}
                                            />
                                        </td>
                                        <td className="py-3 px-4">
                                            <input
                                                type="number"
                                                value={cartItem.discountPercentage}
                                                min="0"
                                                max="100"
                                                className="w-20 p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-grillmelt-yellow"
                                                onChange={(e) => updateDiscount(index, e.target.value)}
                                            />
                                        </td>
                                        <td className="py-3 px-4">{discountAmount.toFixed(2)}</td>
                                        <td className="py-3 px-4">{itemTotal.toFixed(2)}</td>
                                        <td className="py-3 px-4">
                                            <button
                                                className="bg-grillmelt-yellow text-blue px-3 py-1 rounded text-sm transition-all duration-300 hover:bg-grillmelt-dark-hover hover:text-white hover:-translate-y-1"
                                                onClick={() => removeItem(index)}
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
                <div className="text-right mt-8">
                    <h4 className="text-2xl font-semibold">Total: LKR <span id="cart-total">{calculateTotal().toFixed(2)}</span></h4>
                    <button
                        className="bg-grillmelt-yellow text-yellow-400 px-6 py-3 rounded mt-6 font-semibold transition-all duration-300 hover:bg-grillmelt-dark-yellow hover:-translate-y-1"
                        onClick={generatePDF}
                    >
                        Bill Receipt
                    </button>
                </div>
            </div>

            <Footer/> {/* Your Footer component */}
        </div>
    );
}

export default Cart;