// This is the form component for creating and editing sections
// It receives a section prop - if section exists, we're editing; if null, we're creating
import React, { useState, useEffect } from 'react'
import { createSection, updateSection } from '../../../api/sections'
import { getAllCourses } from '../../../api/courses'
import { getAllTerms } from '../../../api/terms'
import { getAllFaculty } from '../../../api/faculty'

const SectionForm = ({ section, onClose }) => {
  // State to store form data
  const [formData, setFormData] = useState({
    sectionCode: '',
    capacity: '',
    courseId: '',
    termId: '',
    facultyId: ''
  })
  // State to track if form is being submitted
  const [loading, setLoading] = useState(false)
  // State to store error messages
  const [error, setError] = useState('')
  // State for dropdown options
  const [courses, setCourses] = useState([])
  const [terms, setTerms] = useState([])
  const [faculties, setFaculties] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)

  // Load dropdown options
  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true)
        const [coursesData, termsData, facultiesData] = await Promise.all([
          getAllCourses(),
          getAllTerms(),
          getAllFaculty()
        ])
        setCourses(coursesData)
        setTerms(termsData)
        setFaculties(facultiesData)
      } catch (err) {
        setError('Failed to load options')
      } finally {
        setLoadingOptions(false)
      }
    }
    loadOptions()
  }, [])

  // useEffect runs when component mounts or when 'section' prop changes
  // If we're editing (section exists), fill the form with existing data
  useEffect(() => {
    if (section) {
      setFormData({
        sectionCode: section.sectionCode || '',
        capacity: section.capacity?.toString() || '',
        courseId: section.courseId?.toString() || '',
        termId: section.termId?.toString() || '',
        facultyId: section.facultyId || ''
      })
    } else {
      // If creating new, start with empty form
      setFormData({
        sectionCode: '',
        capacity: '',
        courseId: '',
        termId: '',
        facultyId: ''
      })
    }
  }, [section])

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
      // Prepare data for API
      const submitData = {
        sectionCode: formData.sectionCode,
        capacity: parseInt(formData.capacity),
        courseId: parseInt(formData.courseId),
        termId: parseInt(formData.termId),
        ...(formData.facultyId && { facultyId: formData.facultyId })
      }

      // Check if we're editing (section exists) or creating (section is null)
      if (section) {
        // Update existing section - call API with section ID and new data
        await updateSection(section.id, submitData)
        alert('Section updated successfully!')
      } else {
        // Create new section - call API with form data
        await createSection(submitData)
        alert('Section created successfully!')
      }
      // Close form and refresh list (handled by parent component)
      onClose()
    } catch (err) {
      // Show error if something went wrong
      setError(err.message || err.data?.error || 'Failed to save section')
    } finally {
      setLoading(false)
    }
  }

  if (loadingOptions) {
    return <p>Loading options...</p>
  }

  const formContent = (
    <>
      <h2 className="text-xl font-bold mb-4">
        {section ? 'Edit Section' : 'Create New Section'}
      </h2>

      {/* Show error message if any */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Section Code input field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Code
          </label>
          <input
            type="text"
            name="sectionCode"
            value={formData.sectionCode}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Rama, Hopper, Turing"
          />
        </div>

        {/* Capacity input field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Capacity
          </label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 30"
          />
        </div>

        {/* Course dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course
          </label>
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Term dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Term
          </label>
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
        </div>

        {/* Faculty dropdown (optional) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Faculty (Optional)
          </label>
          <select
            name="facultyId"
            value={formData.facultyId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a faculty (optional)</option>
            {faculties.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.full_name}
              </option>
            ))}
          </select>
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
            {loading ? 'Saving...' : section ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </>
  )

  // If used inside FormModal, just return the content without the modal wrapper
  return formContent
}

export default SectionForm

