import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './store';

import App from './App.jsx'
import Login from './pages/Login.jsx'
import Home from "./pages/CustomerPages/Home.jsx";
import ShopPage from "./pages/CustomerPages/ShopPage";
import CustomerProductPage from "./pages/CustomerPages/CustomerProductPage.jsx";
import AboutUsPage from "./pages/CustomerPages/AboutUsPage";

import Admin from "./pages/AdminPages/Admin";
import ProductOverviewPage from "./pages/AdminPages/ProductOverviewPage";
import ProductOrdersPage from "./pages/AdminPages/ProductOrdersPage";
import ProductEditPage from "./pages/AdminPages/ProductEditPage.jsx";
import ProductAddPage from "./pages/AdminPages/ProductAddPage.jsx";
import './styles/App.css';
import './styles/index.css';
import NotFound from "./pages/NotFound";
import { ShopPathName } from "./staticData/PathData.js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path={`${ShopPathName}/:category?`} element={<ShopPage />} />
            <Route path=":product/:product_id" element={<CustomerProductPage />} />
            <Route path="about_us" element={<AboutUsPage />} />

            <Route path="admin" element={<Admin />}>
              <Route index element={<ProductOrdersPage />} />
              <Route path="overview_products" element={<ProductOverviewPage />} />
              <Route path="edit_product" element={<ProductEditPage />} />
              <Route path="add_product" element={<ProductAddPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
