import { apiClient } from './client';

export const getMyRegistrations = async () => {
    const response = await apiClient.get('/api/students/registrations', { auth: true });
    return response;
};

export const dropCourse = async (registrationId) => {
    const response = await apiClient.delete(`/api/enroll/drop/${registrationId}`, { auth: true });
    return response;
};

export const getMyWaitlists = async () => {
    const response = await apiClient.get('/api/enroll/waitlists', { auth: true });
    return response;
};
