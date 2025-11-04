// terms management where admin can create,edit,and delete terms
import React, { useState, useEffect } from 'react'
import {getAllTerms,deleteTerm } from '../../api/terms'
import TermForm from '../../components/admin/TermForm'

const TermsPage = () => {
  const [terms, setTerms] =useState([])
  const [loading, setLoading] =useState(true)
  const [error, setError] =useState('')
  const [showForm, setShowForm] =useState(false)
  const [editingTerm, setEditingTerm] =useState(null)

  useEffect(() => {
    loadTerms()
  },[])

  const loadTerms =async()=>{
    try {
      setLoading(true)
      setError('')
      const data =await getAllTerms()
      setTerms(data)
    } catch (err) {
      setError(err.message ||'Failed to load terms')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete =async(id)=> {
    if (!window.confirm('Are you sure you want to delete this term?')) {
      return
    }
    try{
      await deleteTerm(id)
      loadTerms()
    } catch (err) {
      alert(err.message ||'Failed to delete term')
    }
  }

  const handleEdit =(term)=> {
    setEditingTerm(term)
    setShowForm(true)
  }

  const handleCreate = () => {
    setEditingTerm(null)
    setShowForm(true)
  }

  const handleFormClose =()=>{
    setShowForm(false)
    setEditingTerm(null)
    loadTerms()
  }

  if (loading) {
    return <div className="p-8">Loading terms...</div>
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Terms</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Create New Term
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
        <TermForm
          term={editingTerm}
          onClose={handleFormClose}
        />
      )}

      {/* Table showing all terms */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Semester
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {terms.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No terms found. Create one to get started!
                </td>
              </tr>
            ) : (
              terms.map((term) => (
                <tr key={term.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {term.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {term.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {term.semester}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(term)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(term.id)}
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

export default TermsPage

