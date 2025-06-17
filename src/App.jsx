import React from 'react'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import './App.css'
import Layout from './Layout/Layout';
import Dashboard from './Pages/Dashboard';
import ProtectedRoute, { PublicRoute } from './Middleware/ProtectedRoute';
import Service from './Pages/Service';
import MyService from './Pages/Services/MyService';
import Login from './Components/Auth/Login';
import GroomersEmployee from './Pages/Users/GroomersEmployee';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Booking from './Pages/Booking';
import BookingDashboard from './Pages/Booking/BookingDashboard';
import Pets from './Pages/PetsProfile/Pets';
import Payment from './Pages/Payments/Payment';
import Scheduler from './Pages/Scheduler';
import AdminScheduler from './Pages/Schedule/AdminScheduler';
import PetType from './Pages/Master/PetType';
import BreedType from './Pages/Master/BreedType';
import CurrencyMaster from './Pages/Master/CurrencyMaster';
import Promocode from './Pages/Promocode';
import Account from './Pages/Account/Account';
import TaxMaster from './Pages/Master/Tax';
import Ratings from './Pages/Ratings/Ratings';
import Order from './Pages/Booking/Order';
import SubServiceRating from './Pages/Ratings/SubServiceRating';
import Articles from './Pages/Articles/Articles';
import BlogPost from './Pages/Articles/BlogPost';
import LateFeesMaster from './Pages/Master/LateFees';
import Categories from './Pages/Categories/Categories';
import Customers from './Pages/PetsProfile/Pets';
import TenureMaster from './Pages/Master/TenureMaster';


const App = () => {
  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route path="/login" element={<PublicRoute children={<Login />} />} />
      <Route path="/" element={<Layout />}>
        {/* All components  */}
        <Route path="/" element={<ProtectedRoute children={<Dashboard />} />} />
        <Route path="/categories" element={<ProtectedRoute children={<Categories />} />} />
        <Route path="sessions" element={<ProtectedRoute children={<MyService />} />} >
          {/* <Route path='my-service' element={<ProtectedRoute children={<MyService />} />} /> */}
        </Route>
        <Route path="booking" element={<ProtectedRoute children={<Booking />} />} >
          <Route path='dashboard' element={<ProtectedRoute children={<BookingDashboard />} />} />
          <Route path='order' element={<ProtectedRoute children={<Order />} />} />
        </Route>
        <Route path='groomers' element={<ProtectedRoute children={<GroomersEmployee />} />} />
        <Route path='articles' element={<ProtectedRoute children={<Articles />} />} />
        <Route path="schedule" element={<ProtectedRoute children={<Scheduler />} />} >
          <Route path='planner' element={<ProtectedRoute children={<AdminScheduler />} />} />
        </Route>
        <Route path='customers' element={<ProtectedRoute children={<Customers />} />} />
        <Route path='payments' element={<ProtectedRoute children={<Payment />} />} />
        <Route path='/masters/pet-types' element={<ProtectedRoute children={<PetType />} />} />
        <Route path='/masters/breeds' element={<ProtectedRoute children={<BreedType />} />} />
        <Route path='/masters/currency' element={<ProtectedRoute children={<CurrencyMaster />} />} />
        <Route path='/masters/tax' element={<ProtectedRoute children={<TaxMaster />} />} />
        <Route path='/masters/tenures' element={<ProtectedRoute children={<TenureMaster />} />} />
        <Route path='/masters/latefee' element={<ProtectedRoute children={<LateFeesMaster />} />} />
        <Route path='/promocode' element={<ProtectedRoute children={<Promocode />} />} />
        <Route path='/account' element={<ProtectedRoute children={<Account />} />} />
        <Route path='/ratings/trainers' element={<ProtectedRoute children={<Ratings />} />} />
        <Route path='/ratings/sessions' element={<ProtectedRoute children={<SubServiceRating />} />} />
        <Route path='/articles/tips/:id' element={<ProtectedRoute children={<BlogPost />} />} />
      </Route>
    </>
  ))
  return (
    <div>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  )
}

export default App
