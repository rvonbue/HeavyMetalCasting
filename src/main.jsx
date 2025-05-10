import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './styles/index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Home from "./pages/Home";

import Admin from "./pages/Admin";
import ProductOverviewPage from "./pages/AdminPages/ProductOverviewPage";
import ProductOrdersPage from "./pages/AdminPages/ProductOrdersPage";
import ProductEditPage from "./pages/AdminPages/ProductEditPage.jsx";
import ProductAddPage from "./pages/AdminPages/ProductAddPage.jsx";

import NotFound from "./pages/NotFound";
import { AppStateProvider } from './AppState';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppStateProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} errorElement={<NotFound />}>
          <Route index element={<Home />} /> {/* default when path is "/" */}
          <Route path="login" element={<Login />} />
          <Route path="admin" element={<Admin />}>
            <Route path="orders" element={<ProductOrdersPage />} />
            <Route path="overview_products" element={<ProductOverviewPage />} />
            <Route path="edit_product" element={<ProductEditPage />} />
            <Route path="add_product" element={<ProductAddPage />} />
          </Route>
          <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
        </Route>
      </Routes>
      </BrowserRouter>
    </AppStateProvider>
  </StrictMode>,
)
