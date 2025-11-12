import React from "react";

const StudentView = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Student Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Name:</span>
          <span className="text-gray-800">{student.full_name || "N/A"}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Student ID:</span>
          <span className="text-gray-800">{student.id ? student.id.slice(0, 8) : "N/A"}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Email:</span>
          <span className="text-gray-800">{student.email || "N/A"}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Phone:</span>
          <span className="text-gray-800">{student.phone || "N/A"}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Sex:</span>
          <span className="text-gray-800 capitalize">{student.sex || "N/A"}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Blood Type:</span>
          <span className="text-gray-800">{student.bloodType || "N/A"}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Birthday:</span>
          <span className="text-gray-800">{student.birthday || "N/A"}</span>
        </div>
        <div className="flex flex-col md:col-span-2">
          <span className="text-sm font-medium text-gray-500">Address:</span>
          <span className="text-gray-800">{student.address || "N/A"}</span>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default StudentView;
