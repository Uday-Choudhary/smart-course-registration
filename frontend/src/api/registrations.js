import { apiClient } from './client';

export const getMyRegistrations = async () => {
    const response = await apiClient.get('/api/students/registrations', { auth: true });
    return response;
};
