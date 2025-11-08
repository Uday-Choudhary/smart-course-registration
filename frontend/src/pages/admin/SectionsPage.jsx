import React, { useState } from "react";
import Pagination from "../../components/admin/students/Pagination";
import Table from "../../components/admin/faculty/Table";
import TableSearch from "../../components/admin/students/TableSearch";
import { sectionsData } from "../../lib/data";
import FormModal from "../../components/admin/students/FormModal";

const columns = [
    { header: "Section Name", accessor: "sectionName" },
    { header: "Capacity", accessor: "capacity", className: "hidden md:table-cell" },
    { header: "Grade", accessor: "grade", className: "hidden md:table-cell" },
    { header: "Supervisor", accessor: "supervisor", className: "hidden lg:table-cell" },
    { header: "Actions", accessor: "action" },
];

const SectionsPage = () => {
    const [sections, setSections] = useState(sectionsData);

    const handleAddSection = () => {
        const newSection = {
            id: sections.length + 1,
            sectionName: `New${sections.length + 1}`,
            capacity: 20,
            grade: 1,
            supervisor: "New Supervisor",
        };
        setSections([...sections, newSection]);
    };

    const handleDelete = (id) => {
        setSections(sections.filter((sec) => sec.id !== id));
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
                        onClick={() => alert(`Edit ${item.sectionName}`)}
                    >
                        <img src="/view.png" alt="edit" width={16} height={16} />
                    </button>

                    {/* Delete Button */}
                    <button
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-[#c7b8ff] hover:bg-[#b7a6ff] transition"
                        onClick={() => handleDelete(item.id)}
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
                            onClick={handleAddSection}
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
        </div>
    );
};

export default SectionsPage;
