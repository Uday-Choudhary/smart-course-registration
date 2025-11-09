import React, { useState, useEffect } from "react";
import { createRoom, updateRoom } from "../../../api/rooms";

const RoomForm = ({ room, onClose }) => {
  const [formData, setFormData] = useState({ roomCode: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (room) setFormData({ roomCode: room.roomCode || "" });
    else setFormData({ roomCode: "" });
  }, [room]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (room) {
        await updateRoom(room.id, formData);
        alert("Room updated successfully!");
      } else {
        await createRoom(formData);
        alert("Room created successfully!");
      }
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {room ? "Edit Room" : "Create New Room"}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Code
          </label>
          <input
            type="text"
            name="roomCode"
            value={formData.roomCode}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., A101, B205, C301"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Saving..." : room ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomForm;
