import React from 'react'
import SidebarAdmin from '../common/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import DashboardNavbar from '../common/DashboardNavbar'
import UserCard from '../common/UserCard'

const AdminDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="flex h-screen bg-[#ffffff] p-4 gap-4">
      {/* LEFT - SIDEBAR */}
      <div className="w-[18%] p-4 bg-[#F7F7F7] rounded-3xl shadow-sm">
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
        <main className=" rounded-2xl shadow-sm flex-1 p-8 bg-[#F7F7F7] ">
          {/* <h1 className="text-2xl font-bold mb-4 text-gray-800">Admin Dashboard</h1> */}
          <div className="flex gap-4 justify-between flex-wrap">
            <UserCard type="student" color="bg-[#FAE27C]" />
            <UserCard type="teacher" color="bg-[#c7b8ff]" />
            <UserCard type="parent" color="bg-[#b9e3ff]" />
            <UserCard type="parent" color="bg-[#ffd6e0]" />
            <UserCard type="parent" color="bg-[#ffe3b3]" />
            <UserCard type="parent" color="bg-[#b8f2b6]" />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
