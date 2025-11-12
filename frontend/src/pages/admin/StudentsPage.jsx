import { useState, useEffect } from "react";
import FormModal from "../../components/admin/common/FormModal";
import Pagination from "../../components/admin/common/Pagination";
import Table from "../../components/admin/common/Table";
import TableSearch from "../../components/admin/common/TableSearch";
import StudentForm from "../../components/admin/students/StudentForm";
import StudentView from "../../components/admin/students/StudentView";
import { getAllStudents, createStudent, updateStudent, deleteStudent } from "../../api/students";

const columns = [
  { header: "Info", accessor: "info" },
  { header: "Student ID", accessor: "studentId", className: "hidden md:table-cell" },
  { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
  { header: "Sex", accessor: "sex", className: "hidden md:table-cell" },
  { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const StudentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getAllStudents();
      setStudents(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, student = null) => {
    setModalType(type);
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const addStudent = async (studentData) => {
    try {
      await createStudent(studentData);
      await fetchStudents();
      closeModal();
    } catch (err) {
      console.error("Error creating student:", err);
      alert("Failed to create student.");
    }
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;
    try {
      await deleteStudent(selectedStudent.id);
      await fetchStudents();
      closeModal();
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Failed to delete student.");
    }
  };

  const updateStudentHandler = async (updatedData) => {
    if (!selectedStudent) return;
    try {
      await updateStudent(selectedStudent.id, updatedData);
      await fetchStudents();
      closeModal();
    } catch (err) {
      console.error("Error updating student:", err);
      alert("Failed to update student.");
    }
  };

  const renderRow = (item) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-gray-50 text-sm transition-colors duration-200 hover:bg-[#f3e8ff]">
      <td className="flex items-center gap-4 p-4">
        <img src="/avatar.png" alt="student" width={40} height={40} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-800 leading-tight">{item.full_name}</h3>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell text-gray-700">{item.id.slice(0, 8)}</td>
      <td className="hidden md:table-cell text-gray-700">{item.phone || "N/A"}</td>
      <td className="hidden md:table-cell text-gray-700 capitalize">{item.sex || "N/A"}</td>
      <td className="hidden md:table-cell text-gray-700">{item.address || "N/A"}</td>
      <td className="pr-4">
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => openModal("view", item)} className="w-7 h-7 flex items-center justify-center rounded-full bg-[#b9e3ff] hover:bg-[#a3d8ff] transition">
            <img src="/view.png" alt="view" width={16} height={16} />
          </button>
          <button onClick={() => openModal("update", item)} className="w-7 h-7 flex items-center justify-center rounded-full bg-[#b9e3ff] hover:bg-[#a3d8ff] transition">
            <img src="/update.png" alt="update" width={16} height={16} />
          </button>
          <button onClick={() => openModal("delete", item)} className="w-7 h-7 flex items-center justify-center rounded-full bg-[#c7b8ff] hover:bg-[#b7a6ff] transition">
            <img src="/delete.png" alt="delete" width={16} height={16} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm flex-1">
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between border-b border-gray-200 px-6 py-4">
        <h1 className="text-lg font-semibold text-gray-800">All Students</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C] hover:bg-[#f8d84e] transition">
              <img src="/filter.png" alt="filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C] hover:bg-[#f8d84e] transition">
              <img src="/sort.png" alt="sort" width={14} height={14} />
            </button>
            <button onClick={() => openModal("create")} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FAE27C] hover:bg-[#f8d84e] shadow-md hover:shadow-lg transition-all duration-200 ease-in-out hover:rotate-90 hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="black" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-2">
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        {loading ? <div className="text-sm text-gray-600">Loading...</div> : <Table columns={columns} renderRow={renderRow} data={students} />}
      </div>

      <div className="px-6 py-4 border-t border-gray-100 flex justify-center md:justify-end">
        <Pagination />
      </div>

      <FormModal isOpen={isModalOpen} onClose={closeModal}>
        {modalType === "delete" ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this student?</p>
            <div className="flex justify-end mt-4">
              <button onClick={closeModal} className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2">Cancel</button>
              <button onClick={handleDeleteStudent} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        ) : modalType === "view" ? (
          <StudentView student={selectedStudent} onClose={closeModal} />
        ) : (
          <StudentForm type={modalType} data={selectedStudent} onSubmit={modalType === "create" ? addStudent : updateStudentHandler} />
        )}
      </FormModal>
    </div>
  );
};

export default StudentsPage;
