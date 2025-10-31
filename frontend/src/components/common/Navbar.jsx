import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="w-full border-b border-slate-200 px-4 py-3 flex items-center justify-between">
      <Link to="/" className="font-semibold">Smart Course Reg</Link>
      {!isAuthenticated && (
        <div className="flex items-center gap-3">
          <Link to="/login" className="underline">Login</Link>
          <Link to="/register" className="underline">Sign up</Link>
        </div>
      )}
      {isAuthenticated && (
        <div className="flex items-center gap-3">
          <span className="text-sm">{user?.name} ({user?.role})</span>
          <button onClick={handleLogout} className="underline">Logout</button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
