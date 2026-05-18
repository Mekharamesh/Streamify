import React from 'react'
import useAuthUser from '../hooks/useAuthUser';
import { Link, useLocation } from 'react-router-dom';
import { BellIcon, LogOutIcon, ShipWheelIcon } from 'lucide-react';
import ThemeSelector from './ThemeSelector.jsx';
import useLogout from '../hooks/useLogout.js';

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/chat");

  const { logoutMutation } = useLogout();

  return (
    <nav className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        
        <div className='flex items-center justify-between w-full'>

          {/* LOGO */}
          {!isChatPage && (
            <Link to="/" className='flex items-center gap-2.5'>
              <ShipWheelIcon className='size-9 text-primary'/>
              <span className='text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide'>
                Streamify
              </span>
            </Link>
          )}

          {/* RIGHT SIDE */}
          <div className='flex items-center gap-3 sm:gap-4 ml-auto'>

            {/* Notifications */}
            <Link to="/notifications">
              <button className='btn btn-ghost btn-circle'>
                <BellIcon className='h-6 w-6 opacity-70'/>
              </button>
            </Link>

            {/* Theme */}
            <ThemeSelector />

            {/* AVATAR */}
            <div className='avatar'>
              <div className='w-9 h-9 rounded-full overflow-hidden'>
                <img
                  src={
                    authUser?.profilePic && authUser.profilePic !== ""
                      ? authUser.profilePic
                      : `https://ui-avatars.com/api/?name=${authUser?.fullName || "User"}`
                  }
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${authUser?.fullName || "User"}`;
                  }}
                />
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={() => logoutMutation()}
              className='btn btn-ghost btn-circle'
            >
              <LogOutIcon className='h-6 w-6 opacity-70'/>
            </button>

          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;