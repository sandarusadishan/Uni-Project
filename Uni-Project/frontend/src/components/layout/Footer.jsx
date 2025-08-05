import React from 'react';
import { FaTiktok, FaFacebook, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-black/90 border-t-2 border-yellow-400/20 pt-8 pb-4 mt-4">
            <div className="container mx-auto px-4">
                <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h4 className="font-bold text-lg text-yellow-400 mb-3">Contact Us</h4>
                        <p className="flex items-center justify-center md:justify-start mb-2"><FaPhoneAlt className="mr-2 text-yellow-400"/> +94 75 423 3902</p>
                        <p className="flex items-center justify-center md:justify-start"><FaEnvelope className="mr-2 text-yellow-400"/> grillmelt@.com</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-yellow-400 mb-3">Location</h4>
                        <p>GrillMelt</p>
                        <p>Makola, Kiribathgoda Road, Sri Lanka</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-yellow-400 mb-3">Opening Hours</h4>
                        <p>Mon-Fri: 9 AM - 9 PM</p>
                        <p>Sat-Sun: 10 AM - 11 PM</p>
                    </div>
                </div>
                <div className="text-center mt-8">
                    <div className="flex justify-center space-x-6 mb-4">
                        <a href="#" className="text-yellow-400 hover:text-white text-3xl transition-transform transform hover:scale-125"><FaTiktok /></a>
                        <a href="#" className="text-yellow-400 hover:text-white text-3xl transition-transform transform hover:scale-125"><FaFacebook /></a>
                        <a href="#" className="text-yellow-400 hover:text-white text-3xl transition-transform transform hover:scale-125"><FaYoutube /></a>
                        <a href="#" className="text-yellow-400 hover:text-white text-3xl transition-transform transform hover:scale-125"><FaWhatsapp /></a>
                    </div>
                    <p className="text-gray-400">&copy; 2024 GrillMelt. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
