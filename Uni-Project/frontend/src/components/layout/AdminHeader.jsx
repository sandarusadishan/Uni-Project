// src/components/layout/AdminHeader.jsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const AdminHeader = () => {
  return (
    <header className="bg-gray-800 text-white py-4 shadow-lg fixed top-0 w-full z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/admin" className="text-2xl font-bold text-yellow-400">
          Admin Panel
        </Link>
        <nav>
          <NavLink to="/admin" className="mr-6 hover:text-yellow-400 transition-colors">Dashboard</NavLink>
          <NavLink to="/admin/menu-items" className="mr-6 hover:text-yellow-400 transition-colors">Manage Items</NavLink>
          <NavLink to="/" className="hover:text-red-400 transition-colors">Logout</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;