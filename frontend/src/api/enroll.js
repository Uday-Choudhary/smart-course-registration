import { apiClient } from './client';

export const enrollStudent = async (studentId, sectionId) => {
    const response = await apiClient.post('/api/enroll/register', { studentId, sectionId }, { auth: true });
    return response;
};
