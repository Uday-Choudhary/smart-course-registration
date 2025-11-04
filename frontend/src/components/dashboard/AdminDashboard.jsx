// AdminDashboard is the main layout for admin pages
// It uses Outlet from react-router-dom to show nested routes (like /admin/terms)
import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import SidebarAdmin from '../common/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import DashboardNavbar from '../common/DashboardNavbar'

const AdminDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="flex h-screen bg-[#ffffff] p-4 gap-4">
      {/* LEFT - SIDEBAR */}
      <div className="w-[18%] p-4 bg-[#F7F7F7] rounded-3xl">
        <Link
          to="/"
          className="flex items-center justify-center lg:justify-start gap-2 mb-8"
        >
          <img src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block font-bold text-gray-800">SchooLama</span>
        </Link>
        <SidebarAdmin role={user?.role} />
      </div>

      {/* RIGHT - MAIN CONTENT */}
      <div className="w-[82%] flex flex-col gap-4">
        {/* NAVBAR */}
        <div className="bg-white rounded-2xl shadow-sm">
          <DashboardNavbar />
        </div>
        {/* MAIN */}
        <main className=" rounded-2xl flex-1 p-8 bg-[#F7F7F7]">
          {/* Outlet renders the nested route component (like TermsPage) */}
          {/* If no route matches, it shows nothing - that's why we redirect to /admin/terms */}
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
