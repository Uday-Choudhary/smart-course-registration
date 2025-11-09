import React from "react";
import { useParams, Link } from "react-router-dom";
import Pagination from "../../components/admin/common/Pagination";
import Table from "../../components/admin/common/Table";
import TableSearch from "../../components/admin/common/TableSearch";
import { coursesData, termsData } from "../../lib/data";

const columns = [
    { header: "Course Code", accessor: "courseCode" },
    { header: "Course Name", accessor: "courseName", className: "hidden md:table-cell" },
    { header: "Credit Hours", accessor: "creditHours", className: "hidden lg:table-cell" },
    { header: "Teachers", accessor: "teachers", className: "hidden lg:table-cell" },
    { header: "Actions", accessor: "action" },
];

const TermCoursesPage = () => {
    const { termId } = useParams();
    const term = termsData.find((t) => t.id === Number(termId));

    if (!term) {
        return (
            <div className="flex justify-center items-center h-full text-gray-600">
                <h2 className="text-lg font-medium">Term not found ❌</h2>
            </div>
        );
    }

    const renderRow = (item) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-gray-50 text-sm hover:bg-[#f3e8ff] transition"
        >
            <td className="p-4 font-medium text-gray-800">{item.courseCode}</td>
            <td className="hidden md:table-cell text-gray-700">{item.courseName}</td>
            <td className="hidden md:table-cell text-gray-700">{item.creditHours}</td>
            <td className="hidden md:table-cell text-gray-700">
                {item.teachers.join(", ")}
            </td>
            <td className="pr-4">
                <div className="flex items-center justify-center gap-2">
                    <Link to={`/admin/courses/${item.id}/sections`}>
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
            {/* ===== HEADER ===== */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <div>
                    <h1 className="text-lg font-semibold text-gray-800">
                        Courses under {term.semester} {term.year}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Showing all courses and sections registered for this academic term.
                    </p>
                </div>
                <Link
                    to="/admin/terms"
                    className="text-sm font-medium text-blue-500 hover:underline"
                >
                    ← Back to Terms
                </Link>
            </div>

            {/* ===== TABLE ===== */}
            <div className="px-4 md:px-6 py-2">
                <Table columns={columns} renderRow={renderRow} data={coursesData} />
            </div>

            {/* ===== PAGINATION ===== */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-center md:justify-end">
                <Pagination />
            </div>
        </div>
    );
};

export default TermCoursesPage;
