// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import AdminHeader from '../../components/layout/AdminHeader';
import Footer from '../../components/layout/Footer';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl font-bold text-center text-yellow-400 mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NavLink to="/admin/menu-items" className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-200">
            <h2 className="text-2xl font-semibold mb-2">Manage Menu Items</h2>
            <p className="text-gray-400">Add, edit, or remove food and drinks from the menu.</p>
          </NavLink>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;