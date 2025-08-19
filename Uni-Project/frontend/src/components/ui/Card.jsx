import React from 'react';

const Card = ({ item }) => {
    return (
        <div className="bg-gray-800/60 backdrop-blur-md rounded-xl shadow-lg overflow-hidden group border border-gray-700 hover:border-yellow-400/50 transition-all duration-300">
            <div className="overflow-hidden relative">
                <img 
                    src={item.imagePath} 
                    alt={item.name} 
                    className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.onerror = null; e.target.src = ''; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <span className="absolute bottom-4 right-4 text-2xl font-bold text-yellow-400 text-shadow-dark">LKR {item.price.toFixed(2)}</span>
            </div>
            <div className="p-6 text-left">
                <h3 className="text-2xl font-bold text-white mb-2">{item.name}</h3>
                <p className="text-gray-400 mb-4 h-16">{item.description}</p>
                <button className="w-full bg-gradient-to-r from-yellow-400 to-amber-300 text-gray-900 font-bold py-3 px-5 rounded-full hover:from-amber-300 hover:to-yellow-400 transition-all duration-300 transform group-hover:scale-105">
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default Card;