import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './store/index.js';

import App from './App.jsx'
import Login from './pages/Login.jsx'
import Home from "./pages/CustomerPages/Home.jsx";
import ShopPage from "./pages/CustomerPages/ShopPage.jsx";
import CustomerProductPage from "./pages/CustomerPages/CustomerProductPage.jsx";
import AboutUsPage from "./pages/CustomerPages/AboutUsPage.jsx";
import CheckoutPage from "./pages/CustomerPages/CheckoutPage.jsx";
import PaymentPage from "./pages/CustomerPages/PaymentPage.jsx";
import OrderStatusPage from "./pages/CustomerPages/OrderStatusPage.jsx";

import Admin from "./pages/AdminPages/Admin.jsx";
import ProductOverviewPage from "./pages/AdminPages/ProductManagementPage.jsx";
import OrdersOverviewPage from "./pages/AdminPages/OrdersOverviewPage.jsx";
import ProductEditPage from "./pages/AdminPages/ProductEditPage.jsx";
import ProductAddPage from "./pages/AdminPages/ProductAddPage.jsx";

import './styles/App.css';
import './styles/index.css';
import NotFound from "./pages/NotFound.jsx";
import { ShopPathName } from "./staticData/PathData.js";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path={`${ShopPathName}/:category?`} element={<ShopPage />} />
            <Route path=":product/:product_id" element={<CustomerProductPage />} />
            <Route path="about_us" element={<AboutUsPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="/order_status/:orderToken" element={<OrderStatusPage />} />

            <Route path="admin" element={<Admin />}>
              <Route path="overview_orders" element={<OrdersOverviewPage />} />
              <Route path="overview_products" element={<ProductOverviewPage />} />
              <Route path="edit_product" element={<ProductEditPage />} />
              <Route path="add_product" element={<ProductAddPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
          
        </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
