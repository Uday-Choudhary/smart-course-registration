import React from "react";

const TeacherView = ({ teacher, onClose }) => {
  if (!teacher) {
    return null;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Teacher Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Name:</span>
          <span className="text-gray-800">{teacher.name}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Teacher ID:</span>
          <span className="text-gray-800">{teacher.teacherId}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Email:</span>
          <span className="text-gray-800">{teacher.email}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Phone:</span>
          <span className="text-gray-800">{teacher.phone}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Subjects:</span>
          <span className="text-gray-800">{teacher.subjects.join(", ")}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Classes:</span>
          <span className="text-gray-800">{teacher.classes.join(", ")}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Address:</span>
          <span className="text-gray-800">{teacher.address}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Blood Type:</span>
          <span className="text-gray-800">{teacher.bloodType}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Birthday:</span>
          <span className="text-gray-800">{teacher.birthday}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Sex:</span>
          <span className="text-gray-800">{teacher.sex}</span>
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