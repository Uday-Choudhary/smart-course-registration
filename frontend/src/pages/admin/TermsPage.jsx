import React, { useState, useEffect } from "react";
import { getAllTerms } from "../../api/terms";
import Pagination from "../../components/admin/common/Pagination";
import Table from "../../components/admin/common/Table";
import TableSearch from "../../components/admin/common/TableSearch";
import FormModal from "../../components/admin/common/FormModal";
import TermForm from "../../components/admin/terms/TermForm";
import { Link } from "react-router-dom";

const columns = [
    { header: "ID", accessor: "id" },
    { header: "Year", accessor: "year" },
    { header: "Semester", accessor: "semester" },
    { header: "Actions", accessor: "action" },
];

const TermsPage = () => {
    const [terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("create");
    const [selectedTerm, setSelectedTerm] = useState(null);

    useEffect(() => {
        loadTerms();
    }, []);

    const loadTerms = async () => {
        try {
            setLoading(true);
            const data = await getAllTerms();
            setTerms(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Failed to load terms");
        } finally {
            setLoading(false);
        }
    };

    const openModal = (type, term = null) => {
        setModalType(type);
        setSelectedTerm(term);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTerm(null);
        loadTerms();
    };

    const renderRow = (item) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-gray-50 text-sm hover:bg-[#f3e8ff] transition"
        >
            <td className="p-4 font-medium text-gray-800">{item.id}</td>
            <td className="p-4 text-gray-700">{item.year}</td>
            <td className="p-4 text-gray-700">{item.semester}</td>
            <td className="pr-4">
                <div className="flex items-center justify-center gap-2">
                    {/* 👁 View Courses under this Term */}
                    <Link to={`/admin/terms/${item.id}/courses`}>
                        <button
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-[#b9e3ff] hover:bg-[#a3d8ff] transition"
                            title="View Courses"
                        >
                            <img src="/view.png" alt="view" width={16} height={16} />
                        </button>
                    </Link>

                    {/* ✏️ Edit Term */}
                    <button
                        onClick={() => openModal("update", item)}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-[#b9e3ff] hover:bg-[#a3d8ff] transition"
                        title="Edit Term"
                    >
                        <img src="/update.png" alt="edit" width={16} height={16} />
                    </button>
                </div>
            </td>
        </tr>
    );

    if (loading)
        return <div className="p-8 text-gray-600">Loading academic terms...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm flex-1">
            {/* ===== HEADER ===== */}
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between border-b border-gray-200 px-6 py-4">
                <h1 className="text-lg font-semibold text-gray-800">Manage Academic Terms</h1>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <button
                        onClick={() => openModal("create")}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FAE27C] hover:bg-[#f8d84e] shadow-md hover:shadow-lg transition-all duration-200 ease-in-out hover:rotate-90 hover:scale-110"
                        title="Add Term"
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

            {/* ===== ERROR ===== */}
            {error && (
                <div className="mx-6 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* ===== TABLE ===== */}
            <div className="px-4 md:px-6 py-2">
                {terms.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No academic terms found. Create one to begin!
                    </div>
                ) : (
                    <Table columns={columns} renderRow={renderRow} data={terms} />
                )}
            </div>

            {/* ===== PAGINATION ===== */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-center md:justify-end">
                <Pagination />
            </div>

            {/* ===== MODAL (Create / Edit only) ===== */}
            <FormModal isOpen={isModalOpen} onClose={closeModal}>
                <TermForm
                    term={modalType === "update" ? selectedTerm : null}
                    onClose={closeModal}
                />
            </FormModal>
        </div>
    );
};

export default TermsPage;
