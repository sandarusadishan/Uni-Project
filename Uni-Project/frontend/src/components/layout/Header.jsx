import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinkClasses = ({ isActive }) =>
        `relative text-gray-200 hover:text-white transition-colors nav-link-underline ${isActive ? 'active font-semibold text-white' : ''}`;

    return (
        <>
            {/* --- Desktop Navbar --- */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        <Link to="/" className="text-2xl font-bold text-white">
                            🍔 <span className="text-yellow-400">Grill</span>Melt
                        </Link>
                        <div className="hidden md:flex items-center space-x-8">
                            <NavLink to="/" className={navLinkClasses}>Home</NavLink>
                            <NavLink to="/menu" className={navLinkClasses}>Menu</NavLink>
                            <NavLink to="/challenges" className={navLinkClasses}>Challenges</NavLink>
                            <NavLink to="/rewards" className={navLinkClasses}>Rewards</NavLink>
                        </div>
                        <div className="flex items-center space-x-6">
                            <NavLink to="/login" className="hidden md:inline-block text-gray-900 font-bold py-2 px-6 rounded-full bg-gradient-to-r from-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105">
                                Login
                            </NavLink>
                            {/* Desktop: Changed from a button to NavLink */}
                            <NavLink to="/cart" className="relative text-2xl text-gray-200 hover:text-white transition-colors">
                                <FiShoppingCart />
                            </NavLink>
                            <button className="md:hidden text-2xl text-gray-200" onClick={() => setMobileMenuOpen(true)}>
                                <FiMenu />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- Mobile Menu --- */}
            <div className={`fixed top-0 right-0 h-full w-full bg-black/50 z-50 transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)}>
                <div className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-gray-900 shadow-2xl z-60 transition-transform duration-300 transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center p-6 border-b border-gray-700">
                        <Link to="/" className="text-xl font-bold text-white">
                            🍔 <span className="text-yellow-400">Grill</span>Melt
                        </Link>
                        <button onClick={() => setMobileMenuOpen(false)} className="text-2xl">
                            <FiX />
                        </button>
                    </div>
                    <div className="flex flex-col p-6 space-y-6 text-lg">
                        <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
                        <NavLink to="/menu" onClick={() => setMobileMenuOpen(false)}>Menu</NavLink>
                        <NavLink to="/challenges" onClick={() => setMobileMenuOpen(false)}>Challenges</NavLink>
                        <NavLink to="/rewards" onClick={() => setMobileMenuOpen(false)}>Rewards</NavLink>
                        
                        {/* Mobile: Added a new NavLink for the cart */}
                        <NavLink to="/cart" onClick={() => setMobileMenuOpen(false)}>Cart</NavLink>

                        <div className="border-t border-gray-700 pt-6">
                            <NavLink to="/login" className="bg-yellow-400 text-black text-center font-bold w-full block py-3 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Login / Sign Up</NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;