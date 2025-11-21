import React, { useState, useEffect } from 'react'
import { addCourseToSection } from '../../../api/sections'
import { getAllCourses } from '../../../api/courses'
import { getAllFaculty } from '../../../api/faculty'

const SectionCoursesManager = ({ section, onClose }) => {
    const [courses, setCourses] = useState([])
    const [faculties, setFaculties] = useState([])
    const [loadingOptions, setLoadingOptions] = useState(true)
    const [selectedCourseId, setSelectedCourseId] = useState('')
    const [selectedFacultyId, setSelectedFacultyId] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadOptions = async () => {
            try {
                setLoadingOptions(true)
                const [coursesData, facultiesData] = await Promise.all([
                    getAllCourses(),
                    getAllFaculty()
                ])
                setCourses(coursesData)
                setFaculties(facultiesData)
            } catch (err) {
                setError('Failed to load options')
            } finally {
                setLoadingOptions(false)
            }
        }
        loadOptions()
    }, [])

    const handleAddCourse = async (e) => {
        e.preventDefault()
        if (!selectedCourseId) return

        setLoading(true)
        setError('')
        try {
            await addCourseToSection({
                sectionId: section.id,
                courseId: parseInt(selectedCourseId),
                facultyId: selectedFacultyId || null
            })
            alert('Course added successfully!')
            onClose() // Close to refresh parent
        } catch (err) {
            setError(err.message || err.data?.error || 'Failed to add course')
        } finally {
            setLoading(false)
        }
    }

    if (loadingOptions) return <p>Loading options...</p>

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Manage Courses for {section.sectionCode}</h2>

            {/* Existing Courses List */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Current Courses:</h3>
                {section.sectionCourses && section.sectionCourses.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {section.sectionCourses.map(sc => (
                            <li key={sc.id} className="mb-1">
                                {sc.course.code} - {sc.course.title}
                                {sc.faculty && <span className="text-sm text-gray-500 ml-2">(Faculty: {sc.faculty.full_name})</span>}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 italic">No courses added yet.</p>
                )}
            </div>

            <hr className="my-4" />

            {/* Add New Course Form */}
            <h3 className="font-semibold mb-2">Add New Course:</h3>
            {error && <div className="bg-red-100 text-red-700 p-2 mb-2 rounded">{error}</div>}

            <form onSubmit={handleAddCourse}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                    <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded"
                    >
                        <option value="">Select a course</option>
                        {courses.map(c => (
                            <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Faculty (Optional)</label>
                    <select
                        value={selectedFacultyId}
                        onChange={(e) => setSelectedFacultyId(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                    >
                        <option value="">Select faculty</option>
                        {faculties.map(f => (
                            <option key={f.id} value={f.id}>{f.full_name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Close</button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
                    >
                        {loading ? 'Adding...' : 'Add Course'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SectionCoursesManager
