import { apiClient } from "./client";

export const getAllDeadlines = async () => {
    const response = await apiClient.get("/api/deadline", { auth: true });
    return response.data;
};

export const createDeadline = async (deadlineData) => {
    const response = await apiClient.post("/api/deadline/create", deadlineData, {
        auth: true,
    });
    return response.data;
};

export const updateDeadline = async (id, deadlineData) => {
    const response = await apiClient.put(`/api/deadline/${id}`, deadlineData, {
        auth: true,
    });
    return response.data;
};

export const deleteDeadline = async (id) => {
    const response = await apiClient.delete(`/api/deadline/${id}`, { auth: true });
    return response.data;
};
