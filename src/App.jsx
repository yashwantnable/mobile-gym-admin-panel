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
import Login from './Components/Auth/Login';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Booking from './Pages/Booking';
import BookingDashboard from './Pages/Booking/BookingDashboard';
import Pets from './Pages/PetsProfile/Customers';
import Payment from './Pages/Payments/Payment';
import Scheduler from './Pages/ScheduleCalender/Scheduler';
import AdminScheduler from './Pages/Schedule/AdminScheduler';
// import PetType from './Pages/Master/PetType';
// import BreedType from './Pages/Master/BreedType';
import CurrencyMaster from './Pages/Master/CurrencyMaster';
import Promocode from './Pages/Promocode';
import Account from './Pages/Account/Account';
import TaxMaster from './Pages/Master/Tax';
import Ratings from './Pages/Ratings/Ratings';
// import Order from './Pages/Booking/Order';
import SubServiceRating from './Pages/Ratings/SubscriptionRating';
import Articles from './Pages/Articles/Articles';
import BlogPost from './Pages/Articles/BlogPost';
import LateFeesMaster from './Pages/Master/LateFees';
import Categories from './Pages/Categories/Categories';
import Customers from './Pages/PetsProfile/Customers';
import TenureMaster from './Pages/Master/TenureMaster';
import SystemSettings from './Pages/Settings/SystemSettings';
import Trainers from './Pages/Users/Trainers';
import ServiceRating from './Pages/Ratings/SubscriptionRating';
import Subscription from './Pages/Subscription/Subscription';
import TrainerReviewPage from './Pages/Ratings/TrainerReviewPage';
import MySessions from './Pages/Services/MySessions';
import LocationMaster from './Pages/Master/LocationMaster';
import { LoaderProvider } from './Components/loader/LoaderContext';
import Loader from './components/loader/Loader';
import TrainerDashboard from './Pages/TrainerPages/TrainerDashboard';
import TrainerSessions from './Pages/TrainerPages/TrainerSessions';


const App = () => {
  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route path="/login" element={<PublicRoute children={<Login />} />} />
      <Route path="/" element={<Layout />}>
        {/* All components  */}
        {/* <Route path="/" element={<ProtectedRoute children={<Dashboard />} />} /> */}
        <Route index element={<ProtectedRoute allowedRoles={["admin"]}> <Dashboard /></ProtectedRoute>
          }
        />
        {/* <Route path="/master/categories" element={<ProtectedRoute children={<Categories />} />} /> */}
         <Route path="master/categories" element={<ProtectedRoute allowedRoles={["admin"]}><Categories /></ProtectedRoute>
          }
        />
        <Route path="/master/sessions" element={<ProtectedRoute children={<MySessions />} />} >
          {/* <Route path='my-service' element={<ProtectedRoute children={<MyService />} />} /> */}
        </Route>
        <Route path="booking" element={<ProtectedRoute children={<Booking />} />} >
          <Route path='dashboard' element={<ProtectedRoute children={<BookingDashboard />} />} />
          {/* <Route path='order' element={<ProtectedRoute children={<Order />} />} /> */}
        </Route>
        <Route path='trainers' element={<ProtectedRoute children={<Trainers />} />} />
        <Route path='articles' element={<ProtectedRoute children={<Articles />} />} />
        <Route path="schedules" element={<ProtectedRoute children={<Scheduler />} />} >
          <Route path='planner' element={<ProtectedRoute children={<AdminScheduler />} />} />
        </Route>
        <Route path='customers' element={<ProtectedRoute children={<Customers />} />} />
        <Route path='subscription' element={<ProtectedRoute children={<Subscription />} />} />
        <Route path='payments' element={<ProtectedRoute children={<Payment />} />} />
        {/* <Route path='/masters/pet-types' element={<ProtectedRoute children={<PetType />} />} /> */}
        {/* <Route path='/masters/breeds' element={<ProtectedRoute children={<BreedType />} />} /> */}
        <Route path='/masters/currency' element={<ProtectedRoute children={<CurrencyMaster />} />} />
        <Route path='/masters/tax' element={<ProtectedRoute children={<TaxMaster />} />} />
        <Route path='/master/locations' element={<ProtectedRoute children={<LocationMaster />} />} />
        <Route path='/masters/tenures' element={<ProtectedRoute children={<TenureMaster />} />} />
        {/* <Route path='/masters/latefee' element={<ProtectedRoute children={<LateFeesMaster />} />} /> */}
        <Route path='/promocode' element={<ProtectedRoute children={<Promocode />} />} />
        <Route path='/account' element={<ProtectedRoute children={<Account />} />} />
        <Route path='/ratings/trainers' element={<ProtectedRoute children={<Ratings />} />} />
        <Route path='/ratings/trainer/:id' element={<ProtectedRoute children={<TrainerReviewPage />} />} />
        <Route path='/ratings/subscriptions' element={<ProtectedRoute children={<ServiceRating />} />} />
        {/* <Route path='/articles/tips/:id' element={<ProtectedRoute children={<BlogPost />} />} /> */}
        <Route path='/system-settings' element={<ProtectedRoute children={<SystemSettings />} />} />
      </Route>
      <Route path="/trainer" element={<Layout />}>
        <Route
          index
          element={
            <ProtectedRoute allowedRoles={["trainer"]}>
              <TrainerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='my-sessions'
          element={
            <ProtectedRoute allowedRoles={["trainer"]}>
              <TrainerSessions />
            </ProtectedRoute>
          }
        />
        </Route>
    </>
  ))
  return (
    <div>
      <LoaderProvider>
        <Loader/>
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
      </LoaderProvider>
    </div>
  )
}

export default App
