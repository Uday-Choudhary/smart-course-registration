import React, { useState } from "react";
import Pagination from "../../components/admin/students/Pagination";
import Table from "../../components/admin/faculty/Table";
import TableSearch from "../../components/admin/students/TableSearch";
import { coursesData } from "../../lib/data";
import FormModal from "../../components/admin/students/FormModal";
import CourseForm from "../../components/admin/courses/CourseForm"; // Import CourseForm

const columns = [
    { header: "Course Name", accessor: "courseName" },
    { header: "Teachers", accessor: "teachers", className: "hidden md:table-cell" },
    { header: "Actions", accessor: "action" },
];

const CoursesPage = () => {
    const [courses, setCourses] = useState(coursesData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("create");
    const [selectedCourse, setSelectedCourse] = useState(null);

    const openModal = (type, course = null) => {
        setModalType(type);
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCourse(null);
    };

    const addCourse = (newCourse) => {
        setCourses([...courses, { ...newCourse, id: courses.length + 1, teachers: newCourse.teachers }]);
        closeModal();
    };

    const updateCourse = (updatedCourse) => {
        setCourses(
            courses.map((course) =>
                course.id === updatedCourse.id
                    ? { ...course, ...updatedCourse, teachers: updatedCourse.teachers }
                    : course
            )
        );
        closeModal();
    };

    const handleDeleteCourse = (id) => {
        setCourses(courses.filter((course) => course.id !== id));
        closeModal(); // Close modal after delete
    };

    const renderRow = (item) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-gray-50 text-sm transition-colors duration-200 hover:bg-[#f3e8ff]"
        >
            <td className="p-4 font-medium text-gray-800">{item.courseName}</td>
            <td className="hidden md:table-cell text-gray-700">
                {item.teachers.join(", ")}
            </td>
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
                <h1 className="text-lg font-semibold text-gray-800">All Subjects</h1>

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
                <Table columns={columns} renderRow={renderRow} data={courses} />
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
                        type={modalType}
                        data={selectedCourse ? { ...selectedCourse, teachers: selectedCourse.teachers.join(', ') } : null}
                        onSubmit={modalType === "create" ? addCourse : updateCourse}
                    />
                )}
            </FormModal>
        </div>
    );
};

export default CoursesPage;
