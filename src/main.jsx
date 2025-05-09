import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import Root from './Root.jsx'
import Login from './pages/Login.jsx'
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Root />} errorElement={<NotFound />}>
          <Route index element={<Home />} /> {/* default when path is "/" */}
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
      </Route>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
