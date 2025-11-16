import React, { useState, useEffect } from "react";
import { createSchedule, updateSchedule } from "../../../api/schedules";
import { getAllRooms } from "../../../api/rooms";
import { getAllSections } from "../../../api/sections";
import { getAllFaculty } from "../../../api/faculty";

const ScheduleForm = ({ schedule, onClose }) => {
  const [formData, setFormData] = useState({
    sectionId: "",
    roomId: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    facultyId: "",
  });
  const [rooms, setRooms] = useState([]);
  const [sections, setSections] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (schedule) {
      setFormData({
        sectionId: schedule.sectionId || "",
        roomId: schedule.roomId || "",
        dayOfWeek: schedule.dayOfWeek || "",
        startTime: schedule.startTime ? new Date(schedule.startTime).toTimeString().slice(0, 5) : "",
        endTime: schedule.endTime ? new Date(schedule.endTime).toTimeString().slice(0, 5) : "",
        facultyId: schedule.facultyId || "",
      });
    }
    loadData();
  }, [schedule]);

  const loadData = async () => {
    try {
      const [roomList, sectionList, facultyList] = await Promise.all([
        getAllRooms(),
        getAllSections(),
        getAllFaculty(),
      ]);
      setRooms(roomList);
      setSections(sectionList);
      setFaculty(facultyList);
    } catch (err) {
      console.error("Error loading form data:", err);
      setError("Failed to load rooms, sections, or faculty");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (schedule) {
        await updateSchedule(schedule.id, formData);
        alert("Schedule updated successfully!");
      } else {
        await createSchedule(formData);
        alert("Schedule created successfully!");
      }
      onClose(true); // Close modal and reload data
    } catch (err) {
      console.error("Error saving schedule:", err);
      setError(err.message || "Failed to save schedule");
      setLoading(false); // Only set loading false on error
    }
  };

  const handleCancel = () => {
    onClose(false); // Close without reloading
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {schedule ? "Edit Schedule" : "Create New Schedule"}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section <span className="text-red-500">*</span>
          </label>
          <select
            name="sectionId"
            value={formData.sectionId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Section --</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.sectionCode}
              </option>
            ))}
          </select>
        </div>

        {/* Select Room */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room <span className="text-red-500">*</span>
          </label>
          <select
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Room --</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.roomCode}
              </option>
            ))}
          </select>
        </div>

        {/* Select Faculty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Faculty <span className="text-red-500">*</span>
          </label>
          <select
            name="facultyId"
            value={formData.facultyId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Faculty --</option>
            {faculty.map((f) => (
              <option key={f.id} value={f.id}>
                {f.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* Day */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Day of Week <span className="text-red-500">*</span>
          </label>
          <select
            name="dayOfWeek"
            value={formData.dayOfWeek}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Day --</option>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
              (day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              )
            )}
          </select>
        </div>

        {/* Time Inputs */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 text-white rounded transition ${schedule
              ? "bg-green-500 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Saving..." : schedule ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;