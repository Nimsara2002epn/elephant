import api from './axiosConfig';

export const reportApi = {
  getReports: async () => {
    const res = await api.get('/reports');
    return res.data;
  },
  getReport: async (id) => {
    const res = await api.get(`/reports/${id}`);
    return res.data;
  },
  createReport: async (reportData) => {
    const res = await api.post('/reports', reportData);
    return res.data;
  },
  deleteReport: async (id) => {
    const res = await api.delete(`/reports/${id}`);
    return res.data;
  },
  getDashboardData: async () => {
    const res = await api.get('/reports/dashboard');
    return res.data;
  },
  getChartsData: async () => {
    const res = await api.get('/reports/charts');
    return res.data;
  },
};
