import api from './axiosConfig';

export const feedbackApi = {
  getMyFeedback: async () => {
    const res = await api.get('/feedback/my');
    return res.data;
  },
  getEventFeedback: async (eventId) => {
    const res = await api.get(`/feedback/event/${eventId}`);
    return res.data;
  },
  submitFeedback: async (feedbackData) => {
    const res = await api.post('/feedback', feedbackData);
    return res.data;
  },
  deleteFeedback: async (id) => {
    const res = await api.delete(`/feedback/${id}`);
    return res.data;
  },
};
