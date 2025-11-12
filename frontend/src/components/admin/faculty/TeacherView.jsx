import React from "react";

const TeacherView = ({ teacher, onClose }) => {
  if (!teacher) {
    return null;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Faculty Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Name:</span>
          <span className="text-gray-800">{teacher.full_name || "N/A"}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Faculty ID:</span>
          <span className="text-gray-800">{teacher.id ? teacher.id.slice(0, 8) : "N/A"}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Email:</span>
          <span className="text-gray-800">{teacher.email || "N/A"}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Phone:</span>
          <span className="text-gray-800">{teacher.phone || "N/A"}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Sex:</span>
          <span className="text-gray-800 capitalize">{teacher.sex || "N/A"}</span>
        </div>
        <div className="flex flex-col md:col-span-2">
          <span className="text-sm font-medium text-gray-500">Subjects:</span>
          <span className="text-gray-800">
            {teacher.subjects && teacher.subjects.length > 0 
              ? teacher.subjects.join(", ") 
              : "No subjects assigned"}
          </span>
        </div>
        <div className="flex flex-col md:col-span-2">
          <span className="text-sm font-medium text-gray-500">Classes:</span>
          <span className="text-gray-800">
            {teacher.classes && teacher.classes.length > 0 
              ? teacher.classes.join(", ") 
              : "No classes assigned"}
          </span>
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

export default TeacherView;