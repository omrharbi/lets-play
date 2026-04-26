import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './home/Home'

import Login from './auth/page/Login'
import Register from './auth/page/Register'
import Profile from './profile/profile'
import Settings from './settings/settings'
import AdminDashboard from './admin/adminDashboard'
import { CartProvider } from './CartContext'
import { isAdmin, isLoggedIn } from './jwt/jwt'
import MyProducts from './product/MyProduct/myProducts'
import ProductDetail from './product/DetailsPrduct/productDetail'
import AddProduct from './product/addProduct/addProduct'
import Products from './product/Product/products'
import ErrorPage from './error/ErrorPage'

const PrivateRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" replace />
}

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!isLoggedIn()) return <Navigate to="/login" replace />
  if (!isAdmin()) {
    return <Navigate to="/" replace />
  }
  return children
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/my-products" element={<PrivateRoute><MyProducts /></PrivateRoute>} />
          <Route path="/my-listings" element={<PrivateRoute><MyProducts /></PrivateRoute>} />
          <Route path="/add-product" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="*" element={<ErrorPage />} errorElement={<ErrorPage />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}