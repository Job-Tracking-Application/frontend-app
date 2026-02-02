import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout() {
    // Default open on larger screens, closed on mobile could be better but let's stick to simple state
    // Ideally use media query hook, but for now we default to true.
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            <div className="container-fluid flex-grow-1">
                <div className="row h-100">
                    {/* Sidebar Column - Only visible on Mobile when open. 
                        d-lg-none ensures it's HIDDEN on desktop. 
                    */}
                    {isSidebarOpen && (
                        <div className="col-12 col-md-3 p-0 border-end bg-white d-lg-none" style={{ minHeight: 'calc(100vh - 60px)', position: 'absolute', zIndex: 1000, width: '250px' }}>
                            <Sidebar />
                        </div>
                    )}

                    {/* Main Content Column 
                        Desktop: Always col-12 (Sidebar hidden).
                        Mobile: col-12 (Sidebar overlays).
                    */}
                    <div className="col-12">
                        <div className="p-3">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
