import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../Components/TopBar";
import SideBar from "../Components/SideBar";


const Layout = () => {
    return (
        <main className="flex h-[100vh] w-full">
            <SideBar />
            <div className="w-[100%] flex flex-col overflow-auto bg-[#f4f6f8] ">
                <TopBar />
                <div className="p-2">
                    <Outlet />
                </div>
            </div>
            {/* <Footer /> */}
        </main>
    );
};

export default Layout;
