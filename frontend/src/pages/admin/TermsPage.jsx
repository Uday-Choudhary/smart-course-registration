import React, { useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/admin/common/Table";
import TableSearch from "../../components/admin/common/TableSearch";
import Pagination from "../../components/admin/common/Pagination";
import FormModal from "../../components/admin/common/FormModal";
import TermForm from "../../components/admin/terms/TermForm";
import { termsData } from "../../lib/data";

const columns = [
    { header: "Year", accessor: "year" },
    { header: "Semester", accessor: "semester", className: "hidden md:table-cell" },
    { header: "Total Courses", accessor: "totalCourses", className: "hidden lg:table-cell" },
    { header: "Total Sections", accessor: "totalSections", className: "hidden lg:table-cell" },
    { header: "Actions", accessor: "action" },
];

const TermsPage = () => {
    const [terms, setTerms] = useState(termsData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("create");

    const openModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const addTerm = (term) => {
        const newTerm = {
            id: terms.length + 1,
            year: term.year,
            semester: term.semester,
            totalCourses: 0,
            totalSections: 0,
        };
        setTerms([...terms, newTerm]);
        closeModal();
    };

    const renderRow = (item) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-gray-50 text-sm hover:bg-[#f3e8ff] transition-colors duration-200"
        >
            <td className="p-4 text-gray-800 font-medium">{item.year}</td>
            <td className="hidden md:table-cell text-gray-700">{item.semester}</td>
            <td className="hidden md:table-cell text-gray-700">{item.totalCourses}</td>
            <td className="hidden md:table-cell text-gray-700">{item.totalSections}</td>
            <td className="pr-4">
                <div className="flex items-center justify-center gap-2">
                    {/* 👁 VIEW BUTTON */}
                    <Link to={`/admin/terms/${item.id}/courses`}>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#b9e3ff] hover:bg-[#a3d8ff] transition">
                            <img src="/view.png" alt="view" width={16} height={16} />
                        </button>
                    </Link>
                </div>
            </td>
        </tr>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm flex-1">
            {/* ===== TOP BAR ===== */}
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between border-b border-gray-200 px-6 py-4">
                <h1 className="text-lg font-semibold text-gray-800">Academic Terms</h1>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />

                    {/* ➕ Add Term */}
                    <button
                        onClick={() => openModal("create")}
                        title="Add Term"
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

            {/* ===== TABLE LIST ===== */}
            <div className="px-4 md:px-6 py-2">
                <Table columns={columns} renderRow={renderRow} data={terms} />
            </div>

            {/* ===== PAGINATION ===== */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-center md:justify-end">
                <Pagination />
            </div>

            {/* ===== ADD TERM MODAL ===== */}
            <FormModal isOpen={isModalOpen} onClose={closeModal}>
                <TermForm type={modalType} onSubmit={addTerm} />
            </FormModal>
        </div>
    );
};

export default TermsPage;
