import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Request interceptor to automatically add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Medication Services
export const medicationService = {
  getAll: () => api.get('/medications'),
  add: (data) => api.post('/medications', data),
  delete: (id) => api.delete(`/medications/${id}`),
};

// Appointment Services
export const appointmentService = {
  getAll: () => api.get('/appointments'),
  getDoctors: () => api.get('/appointments/doctors'),
  book: (data) => api.post('/appointments', data),
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status`, { status }),
};

export default api;
