import { apiClient } from "./client";

// Fetch all schedules
export const getAllSchedules = async () => {
    const response = await apiClient.get("/api/schedule", { auth: true });
    return response.data;
};

// Create new schedule
export const createSchedule = async (data) => {
    const response = await apiClient.post("/api/schedule/create", data, { auth: true });
    return response.data;
};

// Update schedule
export const updateSchedule = async (id, data) => {
    const response = await apiClient.put(`/api/schedule/${id}`, data, { auth: true });
    return response.data;
};

// Delete schedule
export const deleteSchedule = async (id) => {
    const response = await apiClient.delete(`/api/schedule/${id}`, { auth: true });
    return response.data;
};
