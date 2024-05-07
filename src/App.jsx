import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import GuestMiddleware from './middlewares/GuestMiddleware'
import AuthMiddleware from './middlewares/AuthMiddleware'
import Profile from './pages/auth/Profile'
import AdminMiddleware from './middlewares/AdminMiddleware'
import Dashboard from './pages/admin/Dashboard'
import Products from './pages/admin/Products'
import CreateProduct from './pages/admin/CreateProduct'
import ProductDetail from './pages/admin/ProductDetail'
import GuestProducts from './pages/guest/GuestProducts'
import GuestProductDetail from './pages/guest/GuestProductDetail'
import EditProduct from './pages/admin/EditProduct'
import Cart from './pages/AuthUser/Cart'
import Orders from './pages/AuthUser/Orders'
import AuthLayout from './pages/AuthUser/AuthLayout'
import AdminOrders from './pages/admin/AdminOrders'
import OrderProductEdit from './pages/admin/OrderProductEdit'
import AdminOrdersEdit from './pages/admin/AdminOrdersEdit'
import Users from './pages/admin/users/Users'
import UserDetail from './pages/admin/users/UserDetail'
import UserInfo from './pages/admin/users/UserInfo'
import UserCart from './pages/admin/users/UserCart'
import UserOrders from './pages/admin/users/UserOrders'
import UserEdit from './pages/admin/users/UserEdit'
import CreateOrder from './pages/AuthUser/CreateOrder'
import CategoryProducts from './pages/guest/CategoryProducts'
import GuestProductsLayout from './pages/guest/GuestProductsLayout'
import AdminCategoryProducts from './pages/admin/AdminCategoryProducts'
import ProductsLayout from './pages/admin/ProductsLayout'
import Categories from './pages/admin/Categories'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<GuestProductsLayout/>}>
            <Route index element={<GuestProducts />} />
            <Route path='categories/:category/products' element={<CategoryProducts />} />
          </Route>
         
          <Route path='products/:id' element={<GuestProductDetail />} />
 
          {/* Auth routes */}
          <Route element={<GuestMiddleware />}>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
          </Route>
          <Route element={<AuthMiddleware />}>
            <Route element={<AuthLayout />}>
            <Route path='cart' element={<Cart />} />
            <Route path='orders' element={<Orders />} />
            <Route path="orders/create" element={<CreateOrder />} />

            <Route path='/profile' element={<Profile />} />
            <Route element={<AdminMiddleware />}>
            <Route path='/dashboard' element={<Dashboard />}>
            <Route path='categories' element={<Categories />} />
              <Route element={<ProductsLayout />} >
                <Route index element={<Products />} />
                <Route path="categories/:category/products" element={<AdminCategoryProducts />} />
              </Route>
              <Route path='products/create' element={<CreateProduct />} />
              <Route path='products/:id' element={<ProductDetail />} />
              <Route path='products/edit/:id' element={<EditProduct />} />
              <Route path='orders'>
                <Route index element={<AdminOrders />} />
                <Route path='order-items/edit/:id' element={<OrderProductEdit />} />
                <Route path="edit/:id" element={<AdminOrdersEdit />} />
              </Route>
              <Route path='users'>
                <Route index element={<Users />} />
                <Route path=':id' element={<UserDetail />} >
                  <Route index element={<UserInfo />} />
                  <Route path='cart' element={<UserCart />} />
                  <Route path='orders' element={<UserOrders />} />
                </Route>
                <Route path='edit/:id' element={<UserEdit />} />
              </Route>
            </Route>
            </Route>
            </Route>
            
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App