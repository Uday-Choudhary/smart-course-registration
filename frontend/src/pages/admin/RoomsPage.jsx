// rooms management where admin can create,edit,and delete rooms
import React, { useState, useEffect } from 'react'
import {getAllRooms,deleteRoom } from '../../api/rooms'
import RoomForm from '../../components/admin/RoomForm'

const RoomsPage = () => {
  const [rooms, setRooms] =useState([])
  const [loading, setLoading] =useState(true)
  const [error, setError] =useState('')
  const [showForm, setShowForm] =useState(false)
  const [editingRoom, setEditingRoom] =useState(null)

  useEffect(() => {
    loadRooms()
  },[])

  const loadRooms =async()=>{
    try {
      setLoading(true)
      setError('')
      const data =await getAllRooms()
      setRooms(data)
    } catch (err) {
      setError(err.message ||'Failed to load rooms')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete =async(id)=> {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return
    }
    try{
      await deleteRoom(id)
      loadRooms()
    } catch (err) {
      alert(err.message ||'Failed to delete room')
    }
  }

  const handleEdit =(room)=> {
    setEditingRoom(room)
    setShowForm(true)
  }

  const handleCreate = () => {
    setEditingRoom(null)
    setShowForm(true)
  }

  const handleFormClose =()=>{
    setShowForm(false)
    setEditingRoom(null)
    loadRooms()
  }

  if (loading) {
    return <div className="p-8">Loading rooms...</div>
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Rooms</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Create New Room
        </button>
      </div>

      {/* Show error if something went wrong */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Show form when creating or editing */}
      {showForm && (
        <RoomForm
          room={editingRoom}
          onClose={handleFormClose}
        />
      )}

      {/* Table showing all rooms */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  No rooms found. Create one to get started!
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {room.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {room.roomCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(room)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RoomsPage
