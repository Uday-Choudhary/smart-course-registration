// This is the form component for creating and editing terms
// It receives a term prop - if term exists, we're editing; if null, we're creating
import React, { useState, useEffect } from 'react'
import { createTerm, updateTerm } from '../../../api/terms'

const TermForm = ({ term, onClose }) => {
  // State to store form data (year and semester)
  const [formData, setFormData] = useState({
    year: '',
    semester: ''
  })
  // State to track if form is being submitted
  const [loading, setLoading] = useState(false)
  // State to store error messages
  const [error, setError] = useState('')

  // useEffect runs when component mounts or when 'term' prop changes
  // If we're editing (term exists), fill the form with existing data
  useEffect(() => {
    if (term) {
      setFormData({
        year: term.year.toString(), // Convert to string for input field
        semester: term.semester
      })
    } else {
      // If creating new, start with empty form
      setFormData({
        year: '',
        semester: ''
      })
    }
  }, [term])

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
      // Check if we're editing (term exists) or creating (term is null)
      if (term) {
        // Update existing term - call API with term ID and new data
        await updateTerm(term.id, formData)
        alert('Term updated successfully!')
      } else {
        // Create new term - call API with form data
        await createTerm(formData)
        alert('Term created successfully!')
      }
      // Close form and refresh list (handled by parent component)
      onClose()
    } catch (err) {
      // Show error if something went wrong
      setError(err.message || err.data?.error || 'Failed to save term')
    } finally {
      setLoading(false)
    }
  }

  const formContent = (
    <>
      <h2 className="text-xl font-bold mb-4">
        {term ? 'Edit Term' : 'Create New Term'}
      </h2>

      {/* Show error message if any */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Year input field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            min="1900"
            max="3000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 2024"
          />
        </div>

        {/* Semester input field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Semester
          </label>
          <input
            type="text"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Fall, Spring, Summer"
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
            {loading ? 'Saving...' : term ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </>
  )

  return formContent
}

export default TermForm

