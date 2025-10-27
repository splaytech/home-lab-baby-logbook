import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Initialization endpoints
export const checkInitialization = async () => {
  try {
    const response = await api.get('/init/status');
    return response.data;
  } catch (error) {
    console.error('Failed to check initialization status:', error);
    return { initialized: false };
  }
};

export const createAdminAccount = async (adminData) => {
  const response = await api.post('/init/admin', adminData);
  return response.data;
};

export const completeSetup = async (setupData) => {
  const response = await api.post('/init/complete', setupData);
  return response.data;
};

// Auth endpoints
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  localStorage.removeItem('authToken');
  return response.data;
};

// Baby endpoints
export const getAllBabies = async () => {
  const response = await api.get('/babies');
  return response.data;
};

export const getBabyById = async (id) => {
  const response = await api.get(`/babies/${id}`);
  return response.data;
};

export const createBaby = async (babyData) => {
  const response = await api.post('/babies', babyData);
  return response.data;
};

export const updateBaby = async (id, babyData) => {
  const response = await api.put(`/babies/${id}`, babyData);
  return response.data;
};

export const deleteBaby = async (id) => {
  const response = await api.delete(`/babies/${id}`);
  return response.data;
};

// User endpoints
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.post('/users/change-password', passwordData);
  return response.data;
};

// Appointment endpoints
export const getAllAppointments = async (params = {}) => {
  const response = await api.get('/appointments', { params });
  return response.data;
};

export const createAppointment = async (appointmentData) => {
  const response = await api.post('/appointments', appointmentData);
  return response.data;
};

export const updateAppointment = async (id, appointmentData) => {
  const response = await api.put(`/appointments/${id}`, appointmentData);
  return response.data;
};

export const deleteAppointment = async (id) => {
  const response = await api.delete(`/appointments/${id}`);
  return response.data;
};

// Growth Record endpoints
export const getAllGrowthRecords = async (babyId) => {
  const response = await api.get('/growth', { params: { babyId } });
  return response.data;
};

export const getGrowthRecordById = async (id) => {
  const response = await api.get(`/growth/${id}`);
  return response.data;
};

export const createGrowthRecord = async (growthData) => {
  const response = await api.post('/growth', growthData);
  return response.data;
};

export const updateGrowthRecord = async (id, growthData) => {
  const response = await api.put(`/growth/${id}`, growthData);
  return response.data;
};

export const deleteGrowthRecord = async (id) => {
  const response = await api.delete(`/growth/${id}`);
  return response.data;
};

// Vaccination endpoints
export const getVaccinationSchedule = async (params = {}) => {
  const response = await api.get('/vaccinations/schedule', { params });
  return response.data;
};

export const getVaccinationTimeline = async (babyId, params = {}) => {
  const response = await api.get(`/vaccinations/timeline/${babyId}`, { params });
  return response.data;
};

export const getAllVaccinationRecords = async (babyId) => {
  const response = await api.get('/vaccinations/records', { params: { babyId } });
  return response.data;
};

export const getVaccinationRecordById = async (id) => {
  const response = await api.get(`/vaccinations/records/${id}`);
  return response.data;
};

export const createVaccinationRecord = async (vaccinationData) => {
  const response = await api.post('/vaccinations/records', vaccinationData);
  return response.data;
};

export const updateVaccinationRecord = async (id, vaccinationData) => {
  const response = await api.put(`/vaccinations/records/${id}`, vaccinationData);
  return response.data;
};

export const deleteVaccinationRecord = async (id) => {
  const response = await api.delete(`/vaccinations/records/${id}`);
  return response.data;
};

// Milestone endpoints
export const getAllMilestones = async (babyId, params = {}) => {
  const response = await api.get('/milestones', { params: { babyId, ...params } });
  return response.data;
};

export const getMilestoneById = async (id) => {
  const response = await api.get(`/milestones/${id}`);
  return response.data;
};

export const createMilestone = async (milestoneData) => {
  const response = await api.post('/milestones', milestoneData);
  return response.data;
};

export const updateMilestone = async (id, milestoneData) => {
  const response = await api.put(`/milestones/${id}`, milestoneData);
  return response.data;
};

export const deleteMilestone = async (id) => {
  const response = await api.delete(`/milestones/${id}`);
  return response.data;
};

export const getMilestoneTemplates = async () => {
  const response = await api.get('/milestones/templates');
  return response.data;
};

export const getMilestoneStats = async (babyId) => {
  const response = await api.get(`/milestones/stats/${babyId}`);
  return response.data;
};

// Backup endpoints
export const createBackup = async () => {
  const response = await api.get('/backup/create', {
    responseType: 'blob',
  });
  return response;
};

export const restoreBackup = async (file) => {
  const formData = new FormData();
  formData.append('backup', file);
  const response = await api.post('/backup/restore', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const listBackups = async () => {
  const response = await api.get('/backup/list');
  return response.data;
};

export const deleteBackupFile = async (filename) => {
  const response = await api.delete(`/backup/${filename}`);
  return response.data;
};

export default api;
