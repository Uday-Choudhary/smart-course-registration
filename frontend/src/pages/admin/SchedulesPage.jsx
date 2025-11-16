import React, { useState, useEffect } from "react";
import { getAllSchedules, deleteSchedule } from "../../api/schedules";
import Pagination from "../../components/admin/common/Pagination";
import Table from "../../components/admin/common/Table";
import TableSearch from "../../components/admin/common/TableSearch";
import FormModal from "../../components/admin/common/FormModal";
import ScheduleForm from "../../components/admin/schedule/ScheduleForm";

const columns = [
    { header: "ID", accessor: "id" },
    { header: "Section", accessor: "section.course.code" },
    { header: "Room", accessor: "room.roomCode" },
    { header: "Day", accessor: "dayOfWeek" },
    { header: "Start Time", accessor: "startTime" },
    { header: "End Time", accessor: "endTime" },
    { header: "Faculty", accessor: "faculty.full_name" },
    { header: "Actions", accessor: "action" },
];

const SchedulesPage = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("create");
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    useEffect(() => {
        console.log("Component mounted, loading schedules...");
        loadSchedules();
    }, []);

    const loadSchedules = async () => {
        try {
            setLoading(true);
            setError("");

            console.log("Calling getAllSchedules API...");
            const data = await getAllSchedules();

            console.log("Raw data received:", data);
            console.log("Data type:", typeof data);
            console.log("Is array?", Array.isArray(data));

            // Handle different response formats
            let schedulesArray = [];
            if (Array.isArray(data)) {
                schedulesArray = data;
            } else if (data && Array.isArray(data.data)) {
                schedulesArray = data.data;
            } else if (data && Array.isArray(data.schedules)) {
                schedulesArray = data.schedules;
            } else {
                console.error("Unexpected data format:", data);
            }

            console.log("Final schedules array:", schedulesArray);
            console.log("Number of schedules:", schedulesArray.length);

            setSchedules(schedulesArray);
        } catch (err) {
            console.error("Error loading schedules:", err);
            console.error("Error stack:", err.stack);
            setError(err.message || "Failed to load schedules");
            setSchedules([]);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (type, schedule = null) => {
        console.log("Opening modal:", type, schedule);
        setModalType(type);
        setSelectedSchedule(schedule);
        setIsModalOpen(true);
    };

    const closeModal = (reload = false) => {
        console.log("Closing modal, reload:", reload);
        setIsModalOpen(false);
        setSelectedSchedule(null);
        if (reload) {
            console.log("Reloading schedules after modal close...");
            // Add small delay to ensure DB update is complete
            setTimeout(() => {
                loadSchedules();
            }, 300);
        }
    };

    const handleDeleteSchedule = async (id) => {
        if (!window.confirm("Are you sure you want to delete this schedule?")) {
            return;
        }

        try {
            console.log("Deleting schedule:", id);
            await deleteSchedule(id);
            alert("Schedule deleted successfully!");
            loadSchedules();
        } catch (err) {
            console.error("Delete error:", err);
            alert(err.message || "Failed to delete schedule");
        }
    };

    const renderRow = (item) => {
        console.log("Rendering row for item:", item);
        return (
            <tr
                key={item.id}
                className="border-b border-gray-200 even:bg-gray-50 text-sm hover:bg-[#f3e8ff] transition"
            >
                <td className="p-4 text-gray-800 font-medium">{item.id}</td>
                <td className="p-4 text-gray-700">
                    {item.section?.course?.code || item.section?.sectionCode || 'N/A'}
                </td>
                <td className="p-4 text-gray-700">{item.room?.roomCode || 'N/A'}</td>
                <td className="p-4 text-gray-700">{item.dayOfWeek || 'N/A'}</td>
                <td className="p-4 text-gray-700">
                    {item.startTime ? new Date(item.startTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    }) : 'N/A'}
                </td>
                <td className="p-4 text-gray-700">
                    {item.endTime ? new Date(item.endTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    }) : 'N/A'}
                </td>
                <td className="p-4 text-gray-700">{item.faculty?.full_name || 'N/A'}</td>
                <td className="pr-4">
                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={() => openModal("update", item)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-[#b9e3ff] hover:bg-[#a3d8ff] transition"
                            title="Edit"
                        >
                            <img src="/update.png" alt="edit" width={16} height={16} />
                        </button>
                        <button
                            onClick={() => handleDeleteSchedule(item.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-[#c7b8ff] hover:bg-[#b7a6ff] transition"
                            title="Delete"
                        >
                            <img src="/delete.png" alt="delete" width={16} height={16} />
                        </button>
                    </div>
                </td>
            </tr>
        );
    };

    console.log("Current state - schedules:", schedules, "loading:", loading, "error:", error);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm flex-1 p-8">
                <div className="text-center text-gray-600">Loading schedules...</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm flex-1">
            {/* ===== HEADER ===== */}
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between border-b border-gray-200 px-6 py-4">
                <h1 className="text-lg font-semibold text-gray-800">
                    Manage Schedules ({schedules.length})
                </h1>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <button
                        onClick={() => openModal("create")}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FAE27C] hover:bg-[#f8d84e] shadow-md hover:shadow-lg transition-all duration-200 ease-in-out hover:rotate-90 hover:scale-110"
                        title="Create New Schedule"
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

            {error && (
                <div className="mx-6 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* ===== TABLE ===== */}
            <div className="px-4 md:px-6 py-2">
                {schedules.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No schedules found. Create one to begin!
                    </div>
                ) : (
                    <Table columns={columns} renderRow={renderRow} data={schedules} />
                )}
            </div>

            {/* ===== PAGINATION ===== */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-center md:justify-end">
                <Pagination />
            </div>

            {/* ===== MODAL ===== */}
            <FormModal isOpen={isModalOpen} onClose={() => closeModal(false)}>
                <ScheduleForm
                    schedule={modalType === "update" ? selectedSchedule : null}
                    onClose={closeModal}
                />
            </FormModal>
        </div>
    );
};

export default SchedulesPage;