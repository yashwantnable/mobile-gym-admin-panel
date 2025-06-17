import React from 'react'
import { FaBell, FaUser } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const TopBar = () => {

  return (
    <>
      <nav className="bg-primary p-4 flex items-center justify-between shadow-md">
        <span className='text-[#F5D547] text-2xl font-bold pt-3'>Admin Portal </span>
        {/* Right - Icons */}
        <div className="flex items-center space-x-4 mr-30">
          {/* <FaBell className="text-white text-lg cursor-pointer hover:text-[#F5D547]" /> */}

          <NavLink
            key={"Account"}
            to={"/account"}
            className={``}
          // onClick={() => setActive(path)}
          >
            {/* <FaUser className="text-white text-lg cursor-pointer hover:text-[#F5D547]" /> */}
          </NavLink>
        </div>
      </nav>
    </>
  );
};

export default TopBar;
