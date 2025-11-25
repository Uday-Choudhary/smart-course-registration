import React, { useState, useEffect } from "react";
import Table from "../../components/admin/common/Table";
import TableSearch from "../../components/admin/common/TableSearch";
import Pagination from "../../components/admin/common/Pagination";
import FormModal from "../../components/admin/common/FormModal";
import DeadlineForm from "../../components/admin/deadlines/DeadlineForm";
import { getAllDeadlines, deleteDeadline as deleteDeadlineApi } from "../../api/deadlines";
import { useAuth } from "../../context/AuthContext";

const columns = [
    { header: "Term", accessor: "term" },
    { header: "Course", accessor: "course" },
    { header: "Registration Open", accessor: "registrationOpen" },
    { header: "Add/Drop Start", accessor: "addDropStart" },
    { header: "Add/Drop End", accessor: "addDropEnd" },
    { header: "Registration Close", accessor: "registrationClose" },
    { header: "Waitlist Close", accessor: "waitlistClose" },
    { header: "Actions", accessor: "action" },
];

// Helper function to format readable date
const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date)) return "-";
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const DeadlinesPage = () => {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("create");
    const [selectedDeadline, setSelectedDeadline] = useState(null);
    const [deadlines, setDeadlines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDeadlines();
    }, []);

    const loadDeadlines = async () => {
        try {
            setLoading(true);
            const data = await getAllDeadlines();
            setDeadlines(Array.isArray(data) ? data : []);
        } catch (err) {
            setError("Failed to load deadlines");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (type, deadline = null) => {
        setModalType(type);
        setSelectedDeadline(deadline);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDeadline(null);
        loadDeadlines(); // Refresh list
    };

    const handleDeleteDeadline = async () => {
        try {
            await deleteDeadlineApi(selectedDeadline.id);
            closeModal();
        } catch (err) {
            alert("Failed to delete deadline");
            console.error(err);
        }
    };

    const renderRow = (item) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-gray-50 text-sm hover:bg-[#f3e8ff] transition"
        >
            <td className="p-3 text-gray-800 font-medium">
                {item.course?.term ? `${item.course.term.semester} ${item.course.term.year}` : "-"}
            </td>
            <td className="text-gray-700">
                {item.course ? `${item.course.code} - ${item.course.title}` : "-"}
            </td>
            <td className="text-gray-700">{formatDate(item.registrationOpen)}</td>
            <td className="text-gray-700">{formatDate(item.addDropStart)}</td>
            <td className="text-gray-700">{formatDate(item.addDropEnd)}</td>
            <td className="text-gray-700">{formatDate(item.registrationClose)}</td>
            <td className="text-gray-700">{formatDate(item.waitlistClose)}</td>
            <td className="p-3">
                <div className="flex items-center justify-center gap-2">
                    {/* 📝 EDIT BUTTON */}
                    <button
                        onClick={() => openModal("update", item)}
                        title="Edit Deadline"
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-[#b9e3ff] hover:bg-[#a3d8ff] transition"
                    >
                        <img src="/update.png" alt="edit" width={16} height={16} />
                    </button>

                    {/* 🗑 DELETE BUTTON */}
                    <button
                        onClick={() => openModal("delete", item)}
                        title="Delete Deadline"
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-[#c7b8ff] hover:bg-[#b7a6ff] transition"
                    >
                        <img src="/delete.png" alt="delete" width={16} height={16} />
                    </button>
                </div>
            </td>
        </tr>
    );

    if (loading) return <div className="p-8">Loading deadlines...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm flex-1">
            {/* ===== HEADER ===== */}
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between border-b border-gray-200 px-6 py-4">
                <h1 className="text-lg font-semibold text-gray-800">Manage Deadlines</h1>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    {/* 🔍 Search Bar */}
                    <TableSearch />

                    {/* ➕ Add Deadline */}
                    {user?.role === "Admin" && (
                        <button
                            onClick={() => openModal("create")}
                            title="Add Deadline"
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
                    )}
                </div>
            </div>

            {error && (
                <div className="mx-6 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* ===== DEADLINES TABLE ===== */}
            <div className="px-4 md:px-6 py-3 overflow-x-auto">
                <Table columns={columns} renderRow={renderRow} data={deadlines} />
            </div>

            {/* ===== PAGINATION ===== */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-center md:justify-end">
                <Pagination />
            </div>

            {/* ===== FORM MODAL ===== */}
            <FormModal isOpen={isModalOpen} onClose={closeModal}>
                {modalType === "delete" ? (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this deadline?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeModal}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteDeadline}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ) : (
                    <DeadlineForm
                        type={modalType}
                        data={selectedDeadline}
                        onClose={closeModal}
                    />
                )}
            </FormModal>
        </div>
    );
};

export default DeadlinesPage;
