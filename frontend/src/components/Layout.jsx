import React from "react";
import Sidebar from "../components/Sidebar.jsx";   // ✅ FIX
import Navbar from "../components/Navbar.jsx";     // ✅ FIX

const Layout = ({ children, showSidebar = false }) => {
  return (
     <div className="min-h-screen bg-base-100"> {/* ✅ background added */}
      
      <div className="flex min-h-screen"> {/* ✅ full height flex */}

        {/* Sidebar */}
        {showSidebar && <Sidebar />}

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-base-100"> {/* ✅ bg added */}
          
          <Navbar />

          <main className="flex-1 overflow-y-auto p-4 bg-base-100"> {/* ✅ bg added */}
            {children}
          </main>

        </div>

      </div>
    </div>
  );
};

export default Layout;