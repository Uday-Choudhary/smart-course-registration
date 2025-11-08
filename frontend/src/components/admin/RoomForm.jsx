// This is the form component for creating and editing rooms
// It receives a room prop - if room exists, we're editing; if null, we're creating
import React, { useState, useEffect } from 'react'
import { createRoom, updateRoom } from '../../api/rooms'

const RoomForm = ({ room, onClose }) => {
  // State to store form data (roomCode)
  const [formData, setFormData] = useState({
    roomCode: ''
  })
  // State to track if form is being submitted
  const [loading, setLoading] = useState(false)
  // State to store error messages
  const [error, setError] = useState('')

  // useEffect runs when component mounts or when 'room' prop changes
  // If we're editing (room exists), fill the form with existing data
  useEffect(() => {
    if (room) {
      setFormData({
        roomCode: room.roomCode || ''
      })
    } else {
      // If creating new, start with empty form
      setFormData({
        roomCode: ''
      })
    }
  }, [room])

  // Handle input field changes - update formData state
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData, // Keep existing values
      [name]: value // Update the field that changed
    })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent page refresh
    setError('')
    setLoading(true)

    try {
      // Check if we're editing (room exists) or creating (room is null)
      if (room) {
        // Update existing room - call API with room ID and new data
        await updateRoom(room.id, formData)
        alert('Room updated successfully!')
      } else {
        // Create new room - call API with form data
        await createRoom(formData)
        alert('Room created successfully!')
      }
      // Close form and refresh list (handled by parent component)
      onClose()
    } catch (err) {
      // Show error if something went wrong
      setError(err.message || err.data?.error || 'Failed to save room')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {room ? 'Edit Room' : 'Create New Room'}
        </h2>

        {/* Show error message if any */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Room Code input field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Code
            </label>
            <input
              type="text"
              name="roomCode"
              value={formData.roomCode}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., A101, B205, C301"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? 'Saving...' : room ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RoomForm
