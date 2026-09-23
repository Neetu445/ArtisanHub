import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { StoreProvider, useStore } from './lib/store'
import Layout from './components/Layout'
import Discover from './pages/Discover'
import Artisans from './pages/Artisans'
import ArtisanProfile from './pages/ArtisanProfile'
import ProductDetail from './pages/ProductDetail'
import CustomRequest from './pages/CustomRequest'
import CustomerOrders from './pages/CustomerOrders'
import OrderDetail from './pages/OrderDetail'
import Messages from './pages/Messages'
import Login from './pages/Login'
import Dashboard from './pages/dashboard/Dashboard'
import Products from './pages/dashboard/Products'
import Orders from './pages/dashboard/Orders'
import Profile from './pages/dashboard/Profile'

const Guard = ({ role, children }) => { const { user, ready } = useStore(); if (!ready) return <div className="p-10 text-center text-stone-500">Loading…</div>; if (!user) return <Navigate to="/login"/>; if (role && user.role !== role) return <Navigate to="/"/>; return children }

export default function App() {
  return (
    <StoreProvider><BrowserRouter>
      <Routes><Route element={<Layout/>}>
        <Route path="/" element={<Discover/>}/>
        <Route path="/artisans" element={<Artisans/>}/>
        <Route path="/artisan/:id" element={<ArtisanProfile/>}/>
        <Route path="/product/:id" element={<ProductDetail/>}/>
        <Route path="/custom" element={<CustomRequest/>}/>
        <Route path="/custom/:artisanId" element={<CustomRequest/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/orders" element={<Guard role="customer"><CustomerOrders/></Guard>}/>
        <Route path="/orders/:id" element={<Guard><OrderDetail/></Guard>}/>
        <Route path="/messages" element={<Guard role="customer"><Messages/></Guard>}/>
        <Route path="/dashboard" element={<Guard role="artisan"><Dashboard/></Guard>}/>
        <Route path="/dashboard/products" element={<Guard role="artisan"><Products/></Guard>}/>
        <Route path="/dashboard/orders" element={<Guard role="artisan"><Orders/></Guard>}/>
        <Route path="/dashboard/orders/:id" element={<Guard role="artisan"><OrderDetail/></Guard>}/>
        <Route path="/dashboard/messages" element={<Guard role="artisan"><Messages artisanMode/></Guard>}/>
        <Route path="/dashboard/profile" element={<Guard role="artisan"><Profile/></Guard>}/>
        <Route path="*" element={<Navigate to="/"/>}/>
      </Route></Routes>
    </BrowserRouter></StoreProvider>
  )
}
