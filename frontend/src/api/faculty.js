import { apiClient } from './client';

// Get all faculty
export const getAllFaculty = async () => {
  const response = await apiClient.get('/api/faculty', { auth: true });
  return response;
};

// Get faculty by ID
export const getFacultyById = async (id) => {
  const response = await apiClient.get(`/api/faculty/${id}`, { auth: true });
  return response;
};

// Create new faculty
export const createFaculty = async (facultyData) => {
  const response = await apiClient.post('/api/faculty', facultyData, { auth: true });
  return response;
};

// Update faculty
export const updateFaculty = async (id, facultyData) => {
  const response = await apiClient.put(`/api/faculty/${id}`, facultyData, { auth: true });
  return response;
};

// Delete faculty
export const deleteFaculty = async (id) => {
  const response = await apiClient.delete(`/api/faculty/${id}`, { auth: true });
  return response;
};

