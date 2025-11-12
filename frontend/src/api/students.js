import { apiClient } from './client';

// Get all students
export const getAllStudents = async () => {
  const response = await apiClient.get('/api/students', { auth: true });
  return response;
};

// Create student
export const createStudent = async (data) => {
  const response = await apiClient.post('/api/students', data, { auth: true });
  return response;
};

// Update student
export const updateStudent = async (id, data) => {
  const response = await apiClient.put(`/api/students/${id}`, data, { auth: true });
  return response;
};

// Delete student
export const deleteStudent = async (id) => {
  const response = await apiClient.delete(`/api/students/${id}`, { auth: true });
  return response;
};

// Get current user's student profile
export const getMyStudentProfile = async () => {
  const response = await apiClient.get('/api/students/me', { auth: true });
  return response;
};
