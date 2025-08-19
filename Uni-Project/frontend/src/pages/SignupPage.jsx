import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import api from '../api/axios'; //

const AuthBackground = () => (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
        <div 
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1998&auto=format&fit=crop')" }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 backdrop-blur-sm"></div>
    </div>
);

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

  
    const handleSubmit = async (e) => {
        e.preventDefault();

       
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            // Axios භාවිතයෙන් බැක්එන්ඩ් එකට POST request එකක් යවමු
            const response = await api.post('/users/signup', {
                username,
                email,
                password
            });

            // සාර්ථක ප්‍රතිචාරය handle කරන්න
            console.log(response.data);
            alert('Account created successfully! Please log in.');
            navigate('/login'); // Signup සාර්ථක වූ පසු login පිටුවට යොමු කරයි
        } catch (error) {
            // දෝෂ handle කරන්න
            console.error('Signup error:', error.response ? error.response.data : error.message);
            alert(error.response?.data?.message || 'Signup failed. Please try again.');
        }
    };

    return (
        <>
            <Header/>
            <AuthBackground />
            <div className="min-h-screen flex flex-col items-center justify-center px-4 animate-[fadeIn_1s_ease-in-out]">
                <Link to="/" className="text-3xl font-bold text-white mb-8">
                    🍔 <span className="text-yellow-400">Grill</span>Melt
                </Link>
                
                <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-yellow-400/20 shadow-2xl shadow-yellow-500/10">
                    <h2 className="text-3xl font-bold text-center text-white mb-2">Create Account</h2>
                    <p className="text-center text-gray-400 mb-8">Join the GrillMelt family today!</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <FiUser className="absolute top-1/2 left-4 -translate-y-1/2 text-yellow-400" />
                            <input 
                                type="text" 
                                placeholder="Username" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                required
                            />
                        </div>
                        <div className="relative">
                            <FiMail className="absolute top-1/2 left-4 -translate-y-1/2 text-yellow-400" />
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                required
                            />
                        </div>
                        <div className="relative">
                            <FiLock className="absolute top-1/2 left-4 -translate-y-1/2 text-yellow-400" />
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-yellow-400">
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                        <div className="relative">
                            <FiLock className="absolute top-1/2 left-4 -translate-y-1/2 text-yellow-400" />
                            <input 
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                required
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-yellow-400">
                                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                        <button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-amber-300 text-gray-900 font-bold py-3 rounded-lg hover:from-amber-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105">
                            Create Account
                        </button>
                    </form>

                    <p className="text-center text-gray-400 mt-8">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-yellow-400 hover:text-yellow-300">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SignupPage;