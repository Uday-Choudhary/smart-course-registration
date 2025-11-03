import React from 'react'
import SidebarAdmin from '../common/Sidebar'
import { useAuth } from '../../context/AuthContext'
import DashboardNavbar from '../common/DashboardNavbar'
import { Link } from 'react-router-dom'

const StudentDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="h-screen flex">


      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <img src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block font-bold text-gray-800">SchooLama</span>
        </Link>
        <p>Welcome, {user?.name}!</p>
        <SidebarAdmin role={user?.role} />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        <DashboardNavbar />
        <main className="p-8">
          {/* Add your dashboard content here */}
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Student Dashboard</h1>
          <p className="text-gray-700">This is where the main content of the student dashboard will go.</p>
        </main>
      </div>
    </div>
  )
}

export default StudentDashboard
