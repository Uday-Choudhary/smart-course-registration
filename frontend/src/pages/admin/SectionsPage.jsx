// sections management where admin can create,edit,and delete sections
import React, { useState, useEffect } from 'react'
import { getAllSections, deleteSection } from '../../api/sections'
import Pagination from "../../components/admin/students/Pagination";
import Table from "../../components/admin/faculty/Table";
import TableSearch from "../../components/admin/students/TableSearch";
import FormModal from "../../components/admin/students/FormModal";
import SectionForm from '../../components/admin/SectionForm'

const columns = [
    { header: "Section Code", accessor: "sectionCode" },
    { header: "Course", accessor: "course", className: "hidden md:table-cell" },
    { header: "Term", accessor: "term", className: "hidden md:table-cell" },
    { header: "Capacity", accessor: "capacity", className: "hidden lg:table-cell" },
    { header: "Actions", accessor: "action" },
];

const SectionsPage = () => {
    const [sections, setSections] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalType, setModalType] = useState("create")
    const [selectedSection, setSelectedSection] = useState(null)

    useEffect(() => {
        loadSections()
    }, [])

    const loadSections = async () => {
        try {
            setLoading(true)
            setError('')
            const data = await getAllSections()
            // getAllSections already returns the data array
            setSections(Array.isArray(data) ? data : [])
        } catch (err) {
            setError(err.message || 'Failed to load sections')
            setSections([])
        } finally {
            setLoading(false)
        }
    }

    const openModal = (type, section = null) => {
        setModalType(type)
        setSelectedSection(section)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedSection(null)
        loadSections() // Refresh list after modal closes
    }

    const handleDeleteSection = async (id) => {
        try {
            await deleteSection(id)
            loadSections()
            closeModal()
        } catch (err) {
            alert(err.message || 'Failed to delete section')
        }
    }

    const renderRow = (item) => (
        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="p-4 font-medium text-gray-800">{item.sectionCode}</td>
            <td className="hidden md:table-cell text-gray-700">
                {item.course ? `${item.course.code} - ${item.course.title}` : 'N/A'}
            </td>
            <td className="hidden md:table-cell text-gray-700">
                {item.term ? `${item.term.year} - ${item.term.semester}` : 'N/A'}
            </td>
            <td className="hidden lg:table-cell text-gray-700">{item.capacity}</td>
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
        return <div className="p-8">Loading sections...</div>
    }

    return (
        <div className="bg-white rounded-xl shadow-sm flex-1">
            {/* ===== TOP BAR ===== */}
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between border-b border-gray-200 px-6 py-4">
                <h1 className="text-lg font-semibold text-gray-800">All Sections</h1>

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

                        {/* ADD SECTION BUTTON */}
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
                {sections.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No sections found. Create one to get started!
                    </div>
                ) : (
                    <Table columns={columns} renderRow={renderRow} data={sections} />
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
                        <p>Are you sure you want to delete this section?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeModal}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteSection(selectedSection.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ) : (
                    <SectionForm
                        section={modalType === "update" ? selectedSection : null}
                        onClose={closeModal}
                    />
                )}
            </FormModal>
        </div>
    )
}

export default SectionsPage
