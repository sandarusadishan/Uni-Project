/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import { menuItems } from '../data/mockMenu';
import { FaHamburger, FaShippingFast, FaStar, FaChevronDown, FaQuoteLeft } from 'react-icons/fa';

// --- Reusable Hook for Scroll Animations ---
const useScrollAnimation = () => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return [ref, isVisible];
};


// --- Background Slideshow Component with Ken Burns Effect ---
const backgroundImages = [
    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=2072&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1998&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?q=80&w=1974&auto=format&fit=crop"
];

const BackgroundSlideshow = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % backgroundImages.length);
        }, 5000); // Slower transition
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-full -z-20 overflow-hidden">
            {backgroundImages.map((img, index) => (
                <div
                    key={img}
                    className={`absolute w-full h-full transition-opacity duration-[2000ms] ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div
                        className="w-full h-full bg-cover bg-center"
                        // The animation is applied only to the active slide
                        style={{
                            backgroundImage: `url(${img})`,
                            animation: index === currentSlide ? `kenburns 7s ease-out forwards` : 'none'
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

// --- Main HomePage Component ---
const HomePage = () => {
    const menuRef = useRef(null);
    const featuredItems = menuItems.slice(0, 3);
    const [menuRefAnimate, menuIsVisible] = useScrollAnimation();
    const [aboutRefAnimate, aboutIsVisible] = useScrollAnimation();
    const [testimonialRefAnimate, testimonialIsVisible] = useScrollAnimation();

    const scrollToMenu = () => {
        menuRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <BackgroundSlideshow />
            <div className="fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
            <Header />
            
            <main>
                {/* --- Hero Section --- */}
                <header className="min-h-screen flex flex-col items-center justify-center text-center relative px-4">
                    <div className="animate-[fadeInUp_1.2s_cubic-bezier(.77,0,.18,1)_0.6s_both]">
                        <h1 className="text-5xl md:text-7xl font-black tracking-wider text-shadow-dark animate-[fadeInDown_1.2s_cubic-bezier(.77,0,.18,1)_0.2s_both]">
                           The Art of the <span className="text-gradient">Perfect Burger</span>
                        </h1>
                        <p className="text-lg md:text-xl mt-4 mb-8 text-gray-200 text-shadow-md max-w-3xl mx-auto">
                            We don't just make burgers. We craft masterpieces between two buns. Welcome to GrillMelt.
                        </p>
                        <Link to="/menu" className="inline-block text-gray-900 font-bold text-lg py-4 px-10 rounded-full bg-gradient-to-r from-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-110 shadow-lg shadow-yellow-500/20">
                            Discover Our Menu
                        </Link>
                    </div>
                    <div onClick={scrollToMenu} className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer animate-[fadeIn_1.5s_2s_both] group">
                        <div className="w-10 h-10 border-2 border-yellow-400 rounded-full flex items-center justify-center animate-[bounce_1.5s_infinite_alternate] group-hover:bg-yellow-400/20 transition-colors">
                           <FaChevronDown className="text-yellow-400" />
                        </div>
                    </div>
                </header>

                {/* --- Menu Section --- */}
                <section ref={menuRef} id="menu" className="py-24 bg-black/50 backdrop-blur-xl">
                    <div ref={menuRefAnimate} className={`container mx-auto text-center px-4 transition-all duration-1000 ${menuIsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Our Signature Creations</h2>
                        <p className="text-lg text-yellow-400 mb-16">Handpicked by our chefs, loved by our customers.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {featuredItems.map((item, index) => (
                                <div key={item.id} style={{ transitionDelay: `${index * 150}ms` }} className={`transition-all duration-700 ${menuIsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                                    <Card item={item} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- Testimonial Section --- */}
                <section className="py-24 bg-gray-900/90">
                    <div ref={testimonialRefAnimate} className={`container mx-auto px-4 text-center transition-all duration-1000 ${testimonialIsVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <FaQuoteLeft className="text-yellow-400 text-5xl mx-auto mb-6"/>
                        <p className="text-2xl md:text-3xl italic text-white max-w-3xl mx-auto mb-6">
                            "Absolutely the best burger I've had in Sri Lanka. The 'Baconzilla' is a life-changing experience. I'll be back every week!"
                        </p>
                        <p className="font-bold text-xl text-yellow-400">- Kusal Perera</p>
                    </div>
                </section>

                {/* --- About Section --- */}
                <section className="py-24 bg-black/50">
                    <div ref={aboutRefAnimate} className={`container mx-auto text-center px-4 transition-all duration-1000 ${aboutIsVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-12">The <span className="text-gradient">GrillMelt</span> Promise</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            <div className="bg-gray-800/50 p-8 rounded-xl border border-yellow-400/20 transform hover:scale-105 hover:border-yellow-400 transition-all duration-300">
                                <FaHamburger className="text-6xl text-yellow-400 mx-auto mb-5" />
                                <h5 className="font-bold text-2xl mb-3">Peak Freshness</h5>
                                <p className="text-gray-300">Locally sourced prime beef and the freshest produce, delivered daily.</p>
                            </div>
                            <div className="bg-gray-800/50 p-8 rounded-xl border border-yellow-400/20 transform hover:scale-105 hover:border-yellow-400 transition-all duration-300">
                                <FaStar className="text-6xl text-yellow-400 mx-auto mb-5" />
                                <h5 className="font-bold text-2xl mb-3">Crafted with Passion</h5>
                                <p className="text-gray-300">Every burger is a work of art, grilled to perfection by our master chefs.</p>
                            </div>
                            <div className="bg-gray-800/50 p-8 rounded-xl border border-yellow-400/20 transform hover:scale-105 hover:border-yellow-400 transition-all duration-300">
                                <FaShippingFast className="text-6xl text-yellow-400 mx-auto mb-5" />
                                <h5 className="font-bold text-2xl mb-3">Delivered with Care</h5>
                                <p className="text-gray-300">An elite delivery experience ensuring your meal arrives hot and perfect.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default HomePage;