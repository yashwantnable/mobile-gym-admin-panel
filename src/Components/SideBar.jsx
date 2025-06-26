import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogout,
  AiOutlineFileText,
  AiOutlineUser,
  AiOutlineCreditCard,
  AiOutlineSetting,
} from "react-icons/ai";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import logo from "../Assets/logo.png";
import {
  MdOutlinePets,
  MdDiscount,
  MdOutlineStarRate,
  MdOutlineArticle,
} from "react-icons/md";
import { TbCategory } from "react-icons/tb";
import { logout } from "../store/slices/storeSlice";
import { useDispatch } from "react-redux";
import { useLoading } from "./loader/LoaderContext";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegUser, FaUserNinja } from "react-icons/fa";
import { FaUsersLine } from "react-icons/fa6";

const menuItems = [
  { name: "Dashboard", icon: AiOutlineHome, path: "/" },
  
  { name: "Customers", icon: FaRegUser, path: "/customers" },
  { name: "Trainers", icon: FaUserNinja, path: "/trainers" },
  // { name: "Schedule", icon: RiCalendarScheduleLine, path: "/schedule/planner" },
  { name: "Subscriptions", icon: FaUsersLine, path: "/subscription" },
  { name: "Promo code", icon: MdDiscount, path: "/promocode" },
  { name: "Payments", icon: AiOutlineCreditCard, path: "/payments" },
  { name: "System Settings", icon: AiOutlineCreditCard, path: "/system-settings" },
  {
    name: "Ratings",
    icon: MdOutlineStarRate,
    path: "/ratings",
    submenu: [
      { name: "Trainers", path: "/ratings/trainers" },
      { name: "Subscriptions", path: "/ratings/subscriptions" },
    ],
  },
  {
    name: "Masters",
    icon: AiOutlineSetting,
    path: "/masters",
    submenu: [
      { name: "Location", icon: TbCategory, path: "/master/locations" },
      { name: "Categories", icon: TbCategory, path: "/master/categories" },
      { name: "Types", icon: FaUsersLine, path: "/master/sessions" },
      // { name: "Tenures", path: "/masters/tenures" },
      // { name: "Currency", path: "/masters/currency" },
      { name: "Tax", path: "/masters/tax" },
      // { name: "Late Fee", path: "/masters/latefee" },
    ],
  },
];

const Sidebar = () => {
  const location = useLocation();
  const active = location.pathname;
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const dispatch = useDispatch();
  const { handleLoading } = useLoading();

  const handleLogout = async () => {
    handleLoading(true);
    try {
      dispatch(logout());
    } catch (err) {
      console.log(err);
    }
    handleLoading(false);
  };

  return (
    <>
      <div className="w-64 min-h-screen bg-primary text-white flex flex-col">
        <Link to="/" className="p-2 flex items-center space-x-3">
          <img src={logo} alt="Outlet" />
        </Link>

        <nav className="flex-1 mt-4">
          {menuItems.map(({ name, icon: Icon, path, submenu }) => (
            <div key={name}>
              <NavLink
                to={path}
                className={`flex items-center justify-between space-x-3 px-6 py-3 text-sm font-medium transition-colors ${
                  active === path ||
                  (submenu && submenu.some((item) => active === item.path))
                    ? "bg-secondary"
                    : "hover:bg-[#afc2d5]"
                }`}
                onClick={(e) => {
                  if (submenu) {
                    e.preventDefault();
                    setOpenSubmenu(openSubmenu === name ? null : name);
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={18} />
                  <span>{name}</span>
                </div>
                {submenu && (
                  <span className="text-xs">
                    {openSubmenu === name ? <SlArrowDown /> : <SlArrowUp />}
                  </span>
                )}
              </NavLink>

              {submenu && (
                <div
                  className={`ml-8 overflow-hidden pt-2 transition-all duration-300 ${
                    openSubmenu === name
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  } bg-primary`}
                >
                  {submenu.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={`flex items-center space-x-3 px-6 py-2 text-sm font-medium transition-colors ${
                        active === item.path
                          ? "bg-secondary text-black"
                          : "hover:bg-[#afc2d5]"
                      }`}
                      onClick={() => setOpenSubmenu(name)}
                    >
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="border-t border-gray-600 mt-auto">
          <button
            onClick={() => setIsLogoutOpen(true)}
            className="flex items-center cursor-pointer space-x-3 px-6 py-3 text-sm font-medium hover:bg-gray-700 transition-colors w-full text-left"
          >
            <AiOutlineLogout size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isLogoutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setIsLogoutOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-[90%] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-3">
                  <AiOutlineLogout className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Logout
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to logout from your account?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setIsLogoutOpen(false)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
