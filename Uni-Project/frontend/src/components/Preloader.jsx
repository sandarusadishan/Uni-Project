import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing...");
  
  const loadingPhrases = [
    "Firing up the grill...",
    "Slicing fresh tomatoes...",
    "Melting the cheddar...",
    "Toasting the buns...",
    "Seasoning with love...",
    "Assembling perfection..."
  ];

  useEffect(() => {
    // Progress Timer
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500); // Wait a bit before finishing
          return 100;
        }
        return prev + 2; 
      });
    }, 30);

    // Text Rotation Timer
    const textTimer = setInterval(() => {
        setLoadingText(loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)]);
    }, 800);

    return () => {
        clearInterval(timer);
        clearInterval(textTimer);
    };
  }, [onComplete]);

  const letterContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const letterItem = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center font-sans overflow-hidden"
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 0.8 } }}
    >
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse-slow" />
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFB800]/10 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/2 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[150px] pointer-events-none translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: "1s" }} />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center">
            
          {/* Logo container with complex animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.5 }}
            className="relative mb-6"
          >
            <div className="w-20 h-20 md:w-28 md:h-28 bg-[#09090b] rounded-[1.5rem] border border-[#FFB800]/20 flex items-center justify-center relative overflow-hidden shadow-[0_0_60px_rgba(255,184,0,0.15)] group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800]/10 via-transparent to-transparent opacity-50" />
                
                {/* Spinning border */}
                <div className="absolute inset-0 border-2 border-[#FFB800]/30 rounded-[1.5rem] border-dashed animate-[spin_10s_linear_infinite]" />
                
                <motion.img 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    src="/logo.png" 
                    alt="BurgerShop" 
                    className="w-10 h-10 md:w-14 md:h-14 object-contain relative z-10 drop-shadow-2xl" 
                />
            </div>
            
            {/* Outer Glow Ring */}
            <div className="absolute -inset-4 rounded-[2.5rem] border border-[#FFB800]/10 animate-ping opacity-20" />
          </motion.div>

          {/* Staggered Text Branding */}
          <motion.div 
            variants={letterContainer}
            initial="hidden"
            animate="show"
            className="text-center mb-8"
          >
              <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter flex items-center justify-center gap-2">
                <span className="flex">
                    {Array.from("BURGER").map((char, i) => (
                        <motion.span key={i} variants={letterItem}>{char}</motion.span>
                    ))}
                </span>
                <span className="text-[#FFB800] flex">
                    {Array.from("SHOP").map((char, i) => (
                        <motion.span key={i} variants={letterItem}>{char}</motion.span>
                    ))}
                </span>
              </h1>
          </motion.div>

          {/* Progress Bar Container */}
          <div className="w-80 relative">
            <div className="h-1.5 bg-[#121214] rounded-full overflow-hidden mb-4 border border-white/5">
                <motion.div 
                    className="h-full bg-gradient-to-r from-[#FFB800] to-yellow-500 rounded-full shadow-[0_0_20px_#FFB800]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "tween", ease: "linear" }}
                />
            </div>
            
            {/* Loading Stats */}
            <div className="flex justify-between items-center text-xs font-bold font-mono uppercase tracking-wider">
                 <motion.span 
                    key={loadingText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-gray-500"
                 >
                    {loadingText}
                 </motion.span>
                 <span className="text-[#FFB800]">{progress}%</span>
            </div>
          </div>
      </div>
    </motion.div>
  );
};

export default Preloader;
