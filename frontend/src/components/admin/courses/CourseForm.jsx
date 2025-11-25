import React, { useState, useEffect } from 'react'
import { createCourse, updateCourse } from '../../../api/courses'
import { getAllTerms } from '../../../api/terms'
import { getAllFaculty } from '../../../api/faculty'

const CourseForm = ({ course, onClose }) => {
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    creditHours: '',
    description: '',
    termId: '',
    facultyIds: []
  })
  const [terms, setTerms] = useState([])
  const [faculties, setFaculties] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true)
        const [termsData, facultiesData] = await Promise.all([
          getAllTerms(),
          getAllFaculty()
        ])
        setTerms(Array.isArray(termsData) ? termsData : [])
        setFaculties(Array.isArray(facultiesData) ? facultiesData : [])
      } catch (err) {
        setError('Failed to load options')
      } finally {
        setLoadingOptions(false)
      }
    }
    loadOptions()
  }, [])

  useEffect(() => {
    if (course) {
      setFormData({
        code: course.code || '',
        title: course.title || '',
        creditHours: course.creditHours?.toString() || '',
        description: course.description || '',
        termId: course.termId?.toString() || '',
        facultyIds: course.faculties ? course.faculties.map(f => f.id) : []
      })
    } else {
      setFormData({
        code: '',
        title: '',
        creditHours: '',
        description: '',
        termId: '',
        facultyIds: []
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

  const handleFacultyChange = (e) => {
    const { value, checked } = e.target
    setFormData(prev => {
      if (checked) {
        return { ...prev, facultyIds: [...prev.facultyIds, value] }
      } else {
        return { ...prev, facultyIds: prev.facultyIds.filter(id => id !== value) }
      }
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
            Term <span className="text-red-500">*</span>
          </label>
          {loadingOptions ? (
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
              Loading terms...
            </div>
          ) : (
            <select
              name="termId"
              value={formData.termId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a term</option>
              {terms.map((term) => (
                <option key={term.id} value={term.id}>
                  {term.year} - {term.semester}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign Faculty
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md max-h-40 overflow-y-auto">
            {loadingOptions ? (
              <p className="text-gray-500">Loading faculty...</p>
            ) : faculties.length > 0 ? (
              faculties.map(faculty => (
                <div key={faculty.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`faculty-${faculty.id}`}
                    value={faculty.id}
                    checked={formData.facultyIds.includes(faculty.id)}
                    onChange={handleFacultyChange}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`faculty-${faculty.id}`} className="text-sm text-gray-700">
                    {faculty.full_name}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No faculty found.</p>
            )}
          </div>
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

