import React, { useState } from "react";
import Pagination from "../../components/admin/students/Pagination";
import Table from "../../components/admin/faculty/Table";
import TableSearch from "../../components/admin/students/TableSearch";
import { sectionsData } from "../../lib/data";
import FormModal from "../../components/admin/students/FormModal";
import SectionForm from "../../components/admin/sections/SectionForm"; // Import SectionForm

const columns = [
    { header: "Section Name", accessor: "sectionName" },
    { header: "Capacity", accessor: "capacity", className: "hidden md:table-cell" },
    { header: "Grade", accessor: "grade", className: "hidden md:table-cell" },
    { header: "Supervisor", accessor: "supervisor", className: "hidden lg:table-cell" },
    { header: "Actions", accessor: "action" },
];

const SectionsPage = () => {
    const [sections, setSections] = useState(sectionsData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("create");
    const [selectedSection, setSelectedSection] = useState(null);

    const openModal = (type, section = null) => {
        setModalType(type);
        setSelectedSection(section);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSection(null);
    };

    const addSection = (newSection) => {
        setSections([...sections, { ...newSection, id: sections.length + 1 }]);
        closeModal();
    };

    const updateSection = (updatedSection) => {
        setSections(
            sections.map((section) =>
                section.id === updatedSection.id
                    ? { ...section, ...updatedSection }
                    : section
            )
        );
        closeModal();
    };

    const handleDelete = (id) => {
        setSections(sections.filter((sec) => sec.id !== id));
        closeModal(); // Close modal after delete
    };

    const renderRow = (item) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-gray-50 text-sm transition-colors duration-200 hover:bg-[#f3e8ff]"
        >
            <td className="p-4 font-medium text-gray-800">{item.sectionName}</td>
            <td className="hidden md:table-cell text-gray-700">{item.capacity}</td>
            <td className="hidden md:table-cell text-gray-700">{item.grade}</td>
            <td className="hidden md:table-cell text-gray-700">{item.supervisor}</td>
            <td className="pr-4">
                <div className="flex items-center justify-center gap-2">
                    {/* Update Button */}
                    <button
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-[#b9e3ff] hover:bg-[#a3d8ff] transition"
                        onClick={() => openModal("update", item)} // Use openModal
                    >
                        <img src="/update.png" alt="edit" width={16} height={16} /> {/* Changed icon */}
                    </button>

                    {/* Delete Button */}
                    <button
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-[#c7b8ff] hover:bg-[#b7a6ff] transition"
                        onClick={() => openModal("delete", item)} // Use openModal for delete confirmation
                    >
                        <img src="/delete.png" alt="delete" width={16} height={16} />
                    </button>
                </div>
            </td>
        </tr>
    );

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
                            onClick={() => openModal("create")} // Use openModal
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

            {/* ===== TABLE LIST ===== */}
            <div className="px-4 md:px-6 py-2">
                <Table columns={columns} renderRow={renderRow} data={sections} />
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
                                onClick={() => handleDelete(selectedSection.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ) : (
                    <SectionForm
                        type={modalType}
                        data={selectedSection}
                        onSubmit={modalType === "create" ? addSection : updateSection}
                    />
                )}
            </FormModal>
        </div>
    );
};

export default SectionsPage;
