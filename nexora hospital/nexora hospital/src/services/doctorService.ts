import api from './api';

// ─── Doctor ─────────────────────────────────────────────────────────────────

export interface BackendDoctor {
  id: number;
  name: string;
  specialization?: string;
  department?: string;
  qualification?: string;
  experience_years?: number;
  phone?: string;
  email?: string;
  is_active?: boolean;
  created_at: string;
}

// GET /api/v1/doctors
export const getDoctors = async (): Promise<BackendDoctor[]> => {
  const response = await api.get<{ doctors: BackendDoctor[] }>('/v1/doctors');
  return response.data.doctors;
};

// GET /api/v1/doctors/{id}
export const getDoctor = async (id: number): Promise<BackendDoctor> => {
  const response = await api.get<{ doctor: BackendDoctor }>(`/v1/doctors/${id}`);
  return response.data.doctor;
};

// POST /api/v1/doctors
export const createDoctor = async (data: Partial<BackendDoctor>): Promise<BackendDoctor> => {
  const response = await api.post<{ doctor: BackendDoctor }>('/v1/doctors', data);
  return response.data.doctor;
};

// PUT /api/v1/doctors/{id}
export const updateDoctor = async (id: number, data: Partial<BackendDoctor>): Promise<BackendDoctor> => {
  const response = await api.put<{ doctor: BackendDoctor }>(`/v1/doctors/${id}`, data);
  return response.data.doctor;
};

// DELETE /api/v1/doctors/{id}
export const deleteDoctor = async (id: number): Promise<void> => {
  await api.delete(`/v1/doctors/${id}`);
};

// ─── Doctor Schedules ────────────────────────────────────────────────────────

export interface BackendDoctorSchedule {
  id: number;
  doctor_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  max_patients: number;
  is_active: boolean;
}

// GET /api/v1/doctors/{doctorId}/schedules
export const getDoctorSchedules = async (doctorId: number): Promise<BackendDoctorSchedule[]> => {
  const response = await api.get<{ schedules: BackendDoctorSchedule[] }>(`/v1/doctors/${doctorId}/schedules`);
  return response.data.schedules;
};

// POST /api/v1/doctors/{doctorId}/schedules
export const createDoctorSchedule = async (doctorId: number, data: Partial<BackendDoctorSchedule>): Promise<BackendDoctorSchedule> => {
  const response = await api.post<{ schedule: BackendDoctorSchedule }>(`/v1/doctors/${doctorId}/schedules`, data);
  return response.data.schedule;
};

// PUT /api/v1/doctor-schedules/{id}
export const updateDoctorSchedule = async (id: number, data: Partial<BackendDoctorSchedule>): Promise<BackendDoctorSchedule> => {
  const response = await api.put<{ schedule: BackendDoctorSchedule }>(`/v1/doctor-schedules/${id}`, data);
  return response.data.schedule;
};

// DELETE /api/v1/doctor-schedules/{id}
export const deleteDoctorSchedule = async (id: number): Promise<void> => {
  await api.delete(`/v1/doctor-schedules/${id}`);
};

// ─── Doctor Queue ────────────────────────────────────────────────────────────

export interface BackendDoctorQueue {
  id: number;
  doctor_id: number;
  patient_id: number;
  queue_date: string;
  token_number: number;
  status: 'waiting' | 'in_progress' | 'completed' | 'skipped';
  priority?: string;
  notes?: string;
  created_at: string;
}

// GET /api/v1/doctors/{doctorId}/today-queue
export const getTodayQueue = async (doctorId: number): Promise<BackendDoctorQueue[]> => {
  const response = await api.get<{ queue: BackendDoctorQueue[] }>(`/v1/doctors/${doctorId}/today-queue`);
  return response.data.queue;
};

// GET /api/v1/doctor-queues
export const getDoctorQueues = async (): Promise<BackendDoctorQueue[]> => {
  const response = await api.get<{ queues: BackendDoctorQueue[] }>('/v1/doctor-queues');
  return response.data.queues;
};

// POST /api/v1/doctor-queues
export const addToQueue = async (data: Partial<BackendDoctorQueue>): Promise<BackendDoctorQueue> => {
  const response = await api.post<{ queue: BackendDoctorQueue }>('/v1/doctor-queues', data);
  return response.data.queue;
};

// PUT /api/v1/doctor-queues/{id}
export const updateQueueEntry = async (id: number, data: Partial<BackendDoctorQueue>): Promise<BackendDoctorQueue> => {
  const response = await api.put<{ queue: BackendDoctorQueue }>(`/v1/doctor-queues/${id}`, data);
  return response.data.queue;
};

// DELETE /api/v1/doctor-queues/{id}
export const removeFromQueue = async (id: number): Promise<void> => {
  await api.delete(`/v1/doctor-queues/${id}`);
};

// ─── Doctor Dashboard ────────────────────────────────────────────────────────

export const getDoctorDashboard = async (): Promise<any> => {
  const response = await api.get('/v1/doctor-dashboard');
  return response.data;
};
