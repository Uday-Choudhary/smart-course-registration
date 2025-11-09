import React, { useState } from "react";
import { Link } from "react-router-dom";
import FormModal from "../../components/admin/common/FormModal";
import Pagination from "../../components/admin/common/Pagination";
import Table from "../../components/admin/common/Table";
import TableSearch from "../../components/admin/common/TableSearch";
import { role, studentsData } from "../../lib/data";
import StudentForm from "../../components/admin/students/StudentForm";

const columns = [
  { header: "Info", accessor: "info" },
  { header: "Student ID", accessor: "studentId", className: "hidden md:table-cell" },
  { header: "Grade", accessor: "grade", className: "hidden md:table-cell" },
  { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
  { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const StudentListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState(studentsData);

  const openModal = (type, student = null) => {
    setModalType(type);
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const addStudent = (student) => {
    setStudents([...students, { ...student, id: students.length + 1, photo: "/avatar.png" }]);
    closeModal();
  };

  const deleteStudent = () => {
    setStudents(students.filter((s) => s.id !== selectedStudent.id));
    closeModal();
  };

  const updateStudent = (updatedStudent) => {
    setStudents(
      students.map((student) =>
        student.id === updatedStudent.id ? { ...student, ...updatedStudent } : student
      )
    );
    closeModal();
  };

  const renderRow = (item) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-gray-50 text-sm transition-colors duration-200 hover:bg-[#f3e8ff]"
    >
      <td className="flex items-center gap-4 p-4">
        <img
          src={item.photo}
          alt="student"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover border border-gray-200"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-800 leading-tight">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.className}</p>
        </div>
      </td>
      <td className="hidden md:table-cell text-gray-700">{item.studentId}</td>
      <td className="hidden md:table-cell text-gray-700">{item.grade}</td>
      <td className="hidden md:table-cell text-gray-700">{item.phone}</td>
      <td className="hidden md:table-cell text-gray-700">{item.address}</td>
      <td className="pr-4">
        <div className="flex items-center justify-center gap-2">
          <Link to={`/list/students/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#b9e3ff] hover:bg-[#a3d8ff] transition">
              <img src="/view.png" alt="view" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <>
              <button
                onClick={() => openModal("update", item)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#b9e3ff] hover:bg-[#a3d8ff] transition"
              >
                <img src="/update.png" alt="update" width={16} height={16} />
              </button>
              <button
                onClick={() => openModal("delete", item)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#c7b8ff] hover:bg-[#b7a6ff] transition"
              >
                <img src="/delete.png" alt="delete" width={16} height={16} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm flex-1">
      {/* ===== TOP BAR ===== */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between border-b border-gray-200 px-6 py-4">
        <h1 className="text-lg font-semibold text-gray-800">All Students</h1>

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

            {role === "admin" && (
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
            )}
          </div>
        </div>
      </div>

      {/* ===== TABLE LIST ===== */}
      <div className="px-4 md:px-6 py-2">
        <Table columns={columns} renderRow={renderRow} data={students} />
      </div>

      {/* ===== PAGINATION ===== */}
      <div className="px-6 py-4 border-t border-gray-100 flex justify-center md:justify-end">
        <Pagination />
      </div>
      <FormModal isOpen={isModalOpen} onClose={closeModal}>
        {modalType === "delete" ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this student?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={deleteStudent}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <StudentForm
            type={modalType}
            data={selectedStudent}
            onSubmit={modalType === "create" ? addStudent : updateStudent}
          />
        )}
      </FormModal>
    </div>
  );
};

export default StudentListPage;
