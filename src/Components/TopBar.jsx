import React, { useState, useRef, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';

const TopBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: clear localStorage, Redux, etc.
    // localStorage.removeItem("token");
    navigate("/login");
  };

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-primary p-4 flex items-center justify-end shadow-md pr-20">
      <span className='text-white text-2xl font-bold'>Admin Portal</span>

      {/* <div className="relative" ref={dropdownRef}>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
          <FaUser className="text-2xl hover:text-outletRed" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
            <div className="py-2">
              <NavLink to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Account
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div> */}
    </nav>
  );
};

export default TopBar;
