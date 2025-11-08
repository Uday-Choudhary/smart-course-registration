// sections management where admin can create,edit,and delete sections
import React, { useState, useEffect } from 'react'
import {getAllSections,deleteSection } from '../../api/sections'
import SectionForm from '../../components/admin/SectionForm'

const SectionsPage = () => {
  const [sections, setSections] =useState([])
  const [loading, setLoading] =useState(true)
  const [error, setError] =useState('')
  const [showForm, setShowForm] =useState(false)
  const [editingSection, setEditingSection] =useState(null)

  useEffect(() => {
    loadSections()
  },[])

  const loadSections =async()=>{
    try {
      setLoading(true)
      setError('')
      const data =await getAllSections()
      setSections(data)
    } catch (err) {
      setError(err.message ||'Failed to load sections')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete =async(id)=> {
    if (!window.confirm('Are you sure you want to delete this section?')) {
      return
    }
    try{
      await deleteSection(id)
      loadSections()
    } catch (err) {
      alert(err.message ||'Failed to delete section')
    }
  }

  const handleEdit =(section)=> {
    setEditingSection(section)
    setShowForm(true)
  }

  const handleCreate = () => {
    setEditingSection(null)
    setShowForm(true)
  }

  const handleFormClose =()=>{
    setShowForm(false)
    setEditingSection(null)
    loadSections()
  }

  if (loading) {
    return <div className="p-8">Loading sections...</div>
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Sections</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Create New Section
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
        <SectionForm
          section={editingSection}
          onClose={handleFormClose}
        />
      )}

      {/* Table showing all sections */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Section Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Term
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sections.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No sections found. Create one to get started!
                </td>
              </tr>
            ) : (
              sections.map((section) => (
                <tr key={section.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {section.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {section.sectionCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {section.course?.code || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {section.term ? `${section.term.year} - ${section.term.semester}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {section.capacity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(section)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(section.id)}
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

export default SectionsPage
