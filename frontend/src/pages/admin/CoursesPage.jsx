// courses management where admin can create,edit,and delete courses
import React, { useState, useEffect } from 'react'
import { getAllCourses, deleteCourse } from '../../api/courses'
import Pagination from "../../components/admin/common/Pagination";
import Table from "../../components/admin/faculty/Table";
import TableSearch from "../../components/admin/common/TableSearch";
import FormModal from "../../components/admin/common/FormModal";
import CourseForm from '../../components/admin/courses/CourseForm'

const columns = [
    { header: "Code", accessor: "code" },
    { header: "Title", accessor: "title" },
    { header: "Credit Hours", accessor: "creditHours", className: "hidden md:table-cell" },
    { header: "Actions", accessor: "action" },
];

const CoursesPage = () => {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalType, setModalType] = useState("create")
    const [selectedCourse, setSelectedCourse] = useState(null)

    useEffect(() => {
        loadCourses()
    }, [])

    const loadCourses = async () => {
        try {
            setLoading(true)
            setError('')
            const data = await getAllCourses()
            // getAllCourses already returns the data array
            setCourses(Array.isArray(data) ? data : [])
        } catch (err) {
            setError(err.message || 'Failed to load courses')
            setCourses([])
        } finally {
            setLoading(false)
        }
    }

    const openModal = (type, course = null) => {
        setModalType(type)
        setSelectedCourse(course)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedCourse(null)
        loadCourses() // Refresh list after modal closes
    }

    const handleDeleteCourse = async (id) => {
        try {
            await deleteCourse(id)
            loadCourses()
            closeModal()
        } catch (err) {
            alert(err.message || 'Failed to delete course')
        }
    }

    const renderRow = (item) => (
        <tr key={item.id} className="border-b border-gray-100 hover:bg-[#f3e8ff] transition-colors duration-200">
            <td className="p-4 font-medium text-gray-800">{item.code}</td>
            <td className="p-4 text-gray-700">{item.title}</td>
            <td className="hidden md:table-cell text-gray-700">{item.creditHours}</td>
            <td className="pr-4">
                <div className="flex items-center justify-center gap-2">
                    {/* Update Button */}
                    <button
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-[#b9e3ff] hover:bg-[#a3d8ff] transition"
                        onClick={() => openModal("update", item)}
                    >
                        <img src="/update.png" alt="edit" width={16} height={16} />
                    </button>

                    {/* Delete Button */}
                    <button
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-[#c7b8ff] hover:bg-[#b7a6ff] transition"
                        onClick={() => openModal("delete", item)}
                    >
                        <img src="/delete.png" alt="delete" width={16} height={16} />
                    </button>
                </div>
            </td>
        </tr>
    );

    if (loading) {
        return <div className="p-8">Loading courses...</div>
    }

    return (
        <div className="bg-white rounded-xl shadow-sm flex-1">
            {/* ===== TOP BAR ===== */}
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between border-b border-gray-200 px-6 py-4">
                <h1 className="text-lg font-semibold text-gray-800">All Courses</h1>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    {/* SEARCH BAR */}
                    <TableSearch />

                    {/* ACTION BUTTONS */}
                    <div className="flex items-center gap-3">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C] hover:bg-[#f8d84e] transition">
                            <img src="/filter.png" alt="filter" width={14} height={14} />
                        </button>

                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C] hover:bg-[#f8d84e] transition">
                            <img src="/sort.png" alt="sort" width={14} height={14} />
                        </button>

                        {/* ADD COURSE BUTTON */}
                        <button
                            onClick={() => openModal("create")}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FAE27C] hover:bg-[#f8d84e] shadow-md hover:shadow-lg transition-all duration-200 ease-in-out hover:rotate-90 hover:scale-110"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="black"
                                className="w-5 h-5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Show error if something went wrong */}
            {error && (
                <div className="mx-6 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* ===== TABLE LIST ===== */}
            <div className="px-4 md:px-6 py-2">
                {courses.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No courses found. Create one to get started!
                    </div>
                ) : (
                    <Table columns={columns} renderRow={renderRow} data={courses} />
                )}
            </div>

            {/* ===== PAGINATION ===== */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-center md:justify-end">
                <Pagination />
            </div>

            {/* ===== MODAL SECTION ===== */}
            <FormModal isOpen={isModalOpen} onClose={closeModal}>
                {modalType === "delete" ? (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this course?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeModal}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteCourse(selectedCourse.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ) : (
                    <CourseForm
                        course={modalType === "update" ? selectedCourse : null}
                        onClose={closeModal}
                    />
                )}
            </FormModal>
        </div>
    )
}

export default CoursesPage
