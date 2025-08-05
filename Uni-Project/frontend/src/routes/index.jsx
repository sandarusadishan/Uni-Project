import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage.jsx';
import MenuPage from '../pages/MenuPage.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import LoginPage from '../pages/LoginPage.jsx'; // <-- ADD THIS
import SignupPage from '../pages/SignupPage.jsx'; // <-- ADD THIS
import Cart from '../pages/Cart.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes with Header and Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
      </Route>
        
      {/* Standalone routes without Header and Footer */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
};

export default AppRoutes;
