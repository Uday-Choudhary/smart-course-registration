import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiClient } from '../api/client'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      if (!token) return
      try {
        setLoading(true)
        const profile = await apiClient.get('/api/profile', { auth: true })
        setUser(profile.user)
      } catch (err) {
        // token probably invalid
        localStorage.removeItem('token')
        setToken('')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [token])

  const login = async (email, password) => {
    const res = await apiClient.post('/api/login', { email, password })
    if (res?.token) {
      localStorage.setItem('token', res.token)
      setToken(res.token)
      setUser(res.user)
    }
    return res
  }

  const register = async ({ name, email, password, role }) => {
    return apiClient.post('/api/register', { name, email, password, role })
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setUser(null)
  }

  const changePassword = async (oldPassword, newPassword) => {
    return apiClient.post('/api/change-password', { oldPassword, newPassword }, { auth: true })
  }

  // ⭐ NEW → update user instantly after profile update
  const updateUserInContext = (updated) => {
    setUser(prev => ({
      ...prev,
      ...updated
    }))
  }

  const value = useMemo(() => ({
    token,
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    
    updateUserInContext,   // ⭐ expose it to all components
    changePassword
  }), [token, user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
