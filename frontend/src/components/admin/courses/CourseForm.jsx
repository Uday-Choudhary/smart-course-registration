import React, { useState, useEffect } from 'react'
import { createCourse, updateCourse } from '../../../api/courses'

const CourseForm = ({ course, onClose }) => {
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    creditHours: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (course) {
      setFormData({
        code: course.code || '',
        title: course.title || '',
        creditHours: course.creditHours?.toString() || '',
        description: course.description || ''
      })
    } else {
      setFormData({
        code: '',
        title: '',
        creditHours: '',
        description: ''
      })
    }
  }, [course])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (course) {
        await updateCourse(course.id, formData)
        alert('Course updated successfully!')
      } else {
        await createCourse(formData)
        alert('Course created successfully!')
      }
      onClose()
    } catch (err) {
      setError(err.message || err.data?.error || 'Failed to save course')
    } finally {
      setLoading(false)
    }
  }

  const formContent = (
    <>
      <h2 className="text-xl font-bold mb-4">
        {course ? 'Edit Course' : 'Create New Course'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Code
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., CS101"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Introduction to Computer Science"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Credit Hours
          </label>
          <input
            type="number"
            name="creditHours"
            value={formData.creditHours}
            onChange={handleChange}
            required
            min="1"
            max="10"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 3"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Course description..."
          />
        </div>

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
            {loading ? 'Saving...' : course ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </>
  )

  return formContent
}

export default CourseForm

