// src/components/admin/AdminMenuItemCard.jsx
import React, { useState } from 'react';

const AdminMenuItemCard = ({ item, onRemove, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedItem, setUpdatedItem] = useState(item);

    const handleSave = () => {
        onUpdate(updatedItem);
        setIsEditing(false);
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col">
            <img 
                src={item.imagePath} 
                alt={item.name} 
                className="w-full h-40 object-cover rounded-md mb-4" 
            />
            {isEditing ? (
                <>
                    <input 
                        type="text" 
                        value={updatedItem.name}
                        onChange={(e) => setUpdatedItem({ ...updatedItem, name: e.target.value })}
                        className="bg-gray-700 p-2 rounded mb-2 text-white"
                    />
                    <input 
                        type="number" 
                        value={updatedItem.price}
                        onChange={(e) => setUpdatedItem({ ...updatedItem, price: parseFloat(e.target.value) })}
                        className="bg-gray-700 p-2 rounded mb-2 text-white"
                    />
                    <textarea 
                        value={updatedItem.description}
                        onChange={(e) => setUpdatedItem({ ...updatedItem, description: e.target.value })}
                        className="bg-gray-700 p-2 rounded mb-4 text-white"
                    />
                </>
            ) : (
                <>
                    <h3 className="text-xl font-bold text-yellow-400">{item.name}</h3>
                    <p className="text-gray-400 mb-2">{item.description}</p>
                    <p className="text-white font-semibold mb-4">LKR {item.price.toFixed(2)}</p>
                </>
            )}
            
            <div className="flex justify-end gap-2 mt-auto">
                {isEditing ? (
                    <button 
                        onClick={handleSave}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Save
                    </button>
                ) : (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Edit
                    </button>
                )}
                <button 
                    onClick={() => onRemove(item.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

export default AdminMenuItemCard;