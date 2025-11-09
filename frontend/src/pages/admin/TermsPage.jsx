// terms management where admin can create,edit,and delete terms
import React, { useState, useEffect } from 'react'
import { getAllTerms, deleteTerm } from '../../api/terms'
import Pagination from "../../components/admin/common/Pagination";
import Table from "../../components/admin/faculty/Table";
import TableSearch from "../../components/admin/common/TableSearch";
import FormModal from "../../components/admin/common/FormModal";
import TermForm from '../../components/admin/terms/TermForm'

const columns = [
    { header: "ID", accessor: "id" },
    { header: "Year", accessor: "year" },
    { header: "Semester", accessor: "semester" },
    { header: "Actions", accessor: "action" },
];

const TermsPage = () => {
    const [terms, setTerms] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalType, setModalType] = useState("create")
    const [selectedTerm, setSelectedTerm] = useState(null)

    useEffect(() => {
        loadTerms()
    }, [])

    const loadTerms = async () => {
        try {
            setLoading(true)
            setError('')
            const data = await getAllTerms()
            setTerms(Array.isArray(data) ? data : [])
        } catch (err) {
            setError(err.message || 'Failed to load terms')
            setTerms([])
        } finally {
            setLoading(false)
        }
    }

    const openModal = (type, term = null) => {
        setModalType(type)
        setSelectedTerm(term)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedTerm(null)
        loadTerms()
    }

    const handleDeleteTerm = async (id) => {
        try {
            await deleteTerm(id)
            loadTerms()
            closeModal()
        } catch (err) {
            alert(err.message || 'Failed to delete term')
        }
    }

    const renderRow = (item) => (
        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="p-4 font-medium text-gray-800">{item.id}</td>
            <td className="p-4 text-gray-700">{item.year}</td>
            <td className="p-4 text-gray-700">{item.semester}</td>
            <td className="pr-4">
                <div className="flex items-center justify-center gap-2">
                    <button
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-[#b9e3ff] hover:bg-[#a3d8ff] transition"
                        onClick={() => openModal("update", item)}
                    >
                        <img src="/update.png" alt="edit" width={16} height={16} />
                    </button>
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
        return <div className="p-8">Loading terms...</div>
    }

    return (
        <div className="bg-white rounded-xl shadow-sm flex-1">
            {/* ===== TOP BAR ===== */}
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between border-b border-gray-200 px-6 py-4">
                <h1 className="text-lg font-semibold text-gray-800">All Terms</h1>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />

                    <div className="flex items-center gap-3">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C] hover:bg-[#f8d84e] transition">
                            <img src="/filter.png" alt="filter" width={14} height={14} />
                        </button>

                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C] hover:bg-[#f8d84e] transition">
                            <img src="/sort.png" alt="sort" width={14} height={14} />
                        </button>

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

            {error && (
                <div className="mx-6 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="px-4 md:px-6 py-2">
                {terms.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No terms found. Create one to get started!
                    </div>
                ) : (
                    <Table columns={columns} renderRow={renderRow} data={terms} />
                )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-center md:justify-end">
                <Pagination />
            </div>

            <FormModal isOpen={isModalOpen} onClose={closeModal}>
                {modalType === "delete" ? (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this term?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeModal}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteTerm(selectedTerm.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ) : (
                    <TermForm
                        term={modalType === "update" ? selectedTerm : null}
                        onClose={closeModal}
                    />
                )}
            </FormModal>
        </div>
    )
}

export default TermsPage
