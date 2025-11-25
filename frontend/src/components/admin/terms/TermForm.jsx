import React, { useState, useEffect } from "react";
import { createTerm, updateTerm } from "../../../api/terms";

const TermForm = ({ term, onClose }) => {
  const [formData, setFormData] = useState({ year: "", semester: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (term) {
      setFormData({
        year: term.year?.toString() || "",
        semester: term.semester || "",
      });
    } else {
      setFormData({ year: "", semester: "" });
    }
  }, [term]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (term) {
        await updateTerm(term.id, formData);
        alert("Term updated successfully!");
      } else {
        await createTerm(formData);
        alert("Term created successfully!");
      }
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save term");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {term ? "Edit Term" : "Create New Term"}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            min="2000"
            max="2100"
            placeholder="e.g., 2025"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Semester
          </label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Semester --</option>
            <option value="Even Semester">Even Semester</option>
            <option value="Odd Semester">Odd Semester</option>
            <option value="Summer Term">Summer Term</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-6">
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
            className={`px-4 py-2 text-white rounded ${term
              ? "bg-green-500 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
              } disabled:bg-gray-400`}
          >
            {loading ? "Saving..." : term ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TermForm;
