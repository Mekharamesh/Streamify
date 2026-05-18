import React from 'react'
import useAuthUser from '../hooks/useAuthUser';
import { Link, useLocation } from 'react-router-dom';
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon } from 'lucide-react';

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className='w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0'>
      
      {/* LOGO */}
      <div className='p-5 border-b border-base-300'>
        <Link to="/" className="flex items-center gap-2 text-green-500">
          <ShipWheelIcon className='size-9 text-primary'/>
          <span className='text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide'>
            Streamify
          </span>
        </Link>
      </div>

      {/* MENU */}
      <nav className='flex-1 p-4 space-y-1'>

        <Link
          to="/"
          className={`btn btn-ghost w-full justify-start gap-3 px-3 normal-case ${
            currentPath === "/" ? "btn-active" : ""
          }`}
        >
          <HomeIcon className='size-5 opacity-70'/>
          <span>Home</span>
        </Link>

        <Link
          to="/friends"
          className={`btn btn-ghost w-full justify-start gap-3 px-3 normal-case ${
            currentPath === "/friends" ? "btn-active" : ""
          }`}
        >
          <UsersIcon className='size-5 opacity-70'/>
          <span>Friends</span>
        </Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost w-full justify-start gap-3 px-3 normal-case ${
            currentPath === "/notifications" ? "btn-active" : ""
          }`}
        >
          <BellIcon className='size-5 opacity-70'/>
          <span>Notifications</span>
        </Link>
      </nav>

      {/* USER PROFILE */}
      <div className='p-4 border-t border-base-300 mt-auto'>
        <div className='flex items-center gap-3'>
          
          {/* AVATAR */}
          <div className='avatar'>
            <div className='w-10 h-10 rounded-full overflow-hidden'>
              <img
                src={
                  authUser?.profilePic && authUser.profilePic !== ""
                    ? authUser.profilePic
                    : `https://ui-avatars.com/api/?name=${authUser?.fullName || "User"}`
                }
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${authUser?.fullName || "User"}`;
                }}
              />
            </div>
          </div>

          {/* USER INFO */}
          <div className='flex-1'>
            <p className='font-semibold text-sm'>
              {authUser?.fullName || "User"}
            </p>

            <p className='text-xs text-success flex items-center gap-2'>
              <span className="size-2 rounded-full bg-success inline-block"></span>
              Online
            </p>
          </div>

        </div>
      </div>
    </aside>
  )
}

export default Sidebar;