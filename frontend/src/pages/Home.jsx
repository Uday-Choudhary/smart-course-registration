import React from 'react'
import { useEffect, useState } from 'react'
import { apiClient } from '../api/client'

const Home = () => {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    apiClient
      .get('/api/test/public')
      .then((data) => {
        if (data && data.message) setMessage(data.message)
      })
      .catch((err) => setError(err.message || 'Failed to connect to backend'))
  }, [])

  return (
    <div>
      <h1>Welcome to Smart Course Registration </h1>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default Home
