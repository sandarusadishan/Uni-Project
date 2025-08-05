import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import Header  from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// This background component can be shared or defined in a common place
const AuthBackground = () => (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
        <div 
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=2072&auto=format&fit=crop')" }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 backdrop-blur-sm"></div>
    </div>
);


const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
        <Header/>
            <AuthBackground />
            <div className="min-h-screen flex flex-col items-center justify-center px-4 animate-[fadeIn_1s_ease-in-out]">
                <Link to="/" className="text-3xl font-bold text-white mb-8">
                    🍔 <span className="text-yellow-400">Grill</span>Melt
                </Link>
                
                <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-yellow-400/20 shadow-2xl shadow-yellow-500/10">
                    <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back!</h2>
                    <p className="text-center text-gray-400 mb-8">Login to continue your flavor journey.</p>
                    
                    <form className="space-y-6">
                        <div className="relative">
                            <FiMail className="absolute top-1/2 left-4 -translate-y-1/2 text-yellow-400" />
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>
                        <div className="relative">
                            <FiLock className="absolute top-1/2 left-4 -translate-y-1/2 text-yellow-400" />
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-yellow-400">
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                        <button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-amber-300 text-gray-900 font-bold py-3 rounded-lg hover:from-amber-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105">
                            Log In
                        </button>
                    </form>

                    <p className="text-center text-gray-400 mt-8">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-semibold text-yellow-400 hover:text-yellow-300">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
            <Footer />
        </>
        
    );
};

export default LoginPage;