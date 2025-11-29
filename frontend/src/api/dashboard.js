import { apiClient } from './client';

export const getDashboardStats = async () => {
    const response = await apiClient.get('/api/dashboard/stats', { auth: true });
    return response;
};

export const getEnrollmentTrends = async () => {
    const response = await apiClient.get('/api/dashboard/enrollment-trends', { auth: true });
    return response;
};

export const getCapacityAnalytics = async () => {
    const response = await apiClient.get('/api/dashboard/capacity', { auth: true });
    return response;
};

export const getCalendarEvents = async () => {
    const response = await apiClient.get('/api/dashboard/calendar-events', { auth: true });
    return response;
};
