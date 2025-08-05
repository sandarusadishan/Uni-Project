import React from 'react';
import Card from '../components/ui/Card';
import { menuItems } from '../data/mockMenu';

const MenuPage = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Our Menu</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menuItems.map(item => (
                    <Card key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default MenuPage;