import React from 'react'
import SidebarAdmin from '../common/Sidebar'
import { useAuth } from '../../context/AuthContext'

const FacultyDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="text-center p-8">
      <h1 className="text-2xl font-bold">Faculty Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      <SidebarAdmin role={user?.role} />
    </div>
  )
}

export default FacultyDashboard
