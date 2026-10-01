import api from './api';

// ─── Consultations ───────────────────────────────────────────────────────────

export interface BackendConsultation {
  id: number;
  patient_id: number;
  doctor_id: number;
  encounter_id?: number;
  consultation_date: string;
  chief_complaint?: string;
  history_of_present_illness?: string;
  past_medical_history?: string;
  clinical_notes?: string;
  examination_findings?: string;
  plan?: string;
  status?: string;
  created_at: string;
}

// GET /api/v1/consultations
export const getConsultations = async (): Promise<BackendConsultation[]> => {
  const response = await api.get<{ consultations: BackendConsultation[] }>('/v1/consultations');
  return response.data.consultations;
};

// POST /api/v1/consultations
export const createConsultation = async (data: Partial<BackendConsultation>): Promise<BackendConsultation> => {
  const response = await api.post<{ consultation: BackendConsultation }>('/v1/consultations', data);
  return response.data.consultation;
};

// PUT /api/v1/consultations/{id}
export const updateConsultation = async (id: number, data: Partial<BackendConsultation>): Promise<BackendConsultation> => {
  const response = await api.put<{ consultation: BackendConsultation }>(`/v1/consultations/${id}`, data);
  return response.data.consultation;
};

// DELETE /api/v1/consultations/{id}
export const deleteConsultation = async (id: number): Promise<void> => {
  await api.delete(`/v1/consultations/${id}`);
};

// ─── Investigations (Lab Orders) ─────────────────────────────────────────────

export interface BackendInvestigation {
  id: number;
  patient_id: number;
  doctor_id: number;
  consultation_id?: number;
  test_name: string;
  test_type?: string;
  specimen?: string;
  priority?: 'routine' | 'urgent' | 'stat';
  status?: 'ordered' | 'sample_collected' | 'processing' | 'completed';
  result_value?: string;
  result_unit?: string;
  reference_range?: string;
  is_abnormal?: boolean;
  notes?: string;
  ordered_at: string;
  resulted_at?: string;
}

// GET /api/v1/investigations
export const getInvestigations = async (): Promise<BackendInvestigation[]> => {
  const response = await api.get<{ investigations: BackendInvestigation[] }>('/v1/investigations');
  return response.data.investigations;
};

// POST /api/v1/investigations
export const createInvestigation = async (data: Partial<BackendInvestigation>): Promise<BackendInvestigation> => {
  const response = await api.post<{ investigation: BackendInvestigation }>('/v1/investigations', data);
  return response.data.investigation;
};

// PUT /api/v1/investigations/{id}
export const updateInvestigation = async (id: number, data: Partial<BackendInvestigation>): Promise<BackendInvestigation> => {
  const response = await api.put<{ investigation: BackendInvestigation }>(`/v1/investigations/${id}`, data);
  return response.data.investigation;
};

// DELETE /api/v1/investigations/{id}
export const deleteInvestigation = async (id: number): Promise<void> => {
  await api.delete(`/v1/investigations/${id}`);
};

// ─── Medications ─────────────────────────────────────────────────────────────

export interface BackendMedication {
  id: number;
  patient_id: number;
  consultation_id?: number;
  doctor_id?: number;
  drug_name: string;
  generic_name?: string;
  dosage?: string;
  route?: string;
  frequency?: string;
  duration?: string;
  quantity?: number;
  instructions?: string;
  is_chronic?: boolean;
  start_date?: string;
  end_date?: string;
  status?: string;
}

// GET /api/v1/medications
export const getMedications = async (): Promise<BackendMedication[]> => {
  const response = await api.get<{ medications: BackendMedication[] }>('/v1/medications');
  return response.data.medications;
};

// POST /api/v1/medications
export const createMedication = async (data: Partial<BackendMedication>): Promise<BackendMedication> => {
  const response = await api.post<{ medication: BackendMedication }>('/v1/medications', data);
  return response.data.medication;
};

// PUT /api/v1/medications/{id}
export const updateMedication = async (id: number, data: Partial<BackendMedication>): Promise<BackendMedication> => {
  const response = await api.put<{ medication: BackendMedication }>(`/v1/medications/${id}`, data);
  return response.data.medication;
};

// DELETE /api/v1/medications/{id}
export const deleteMedication = async (id: number): Promise<void> => {
  await api.delete(`/v1/medications/${id}`);
};

// ─── Advice ──────────────────────────────────────────────────────────────────

export interface BackendAdvice {
  id: number;
  patient_id: number;
  consultation_id?: number;
  doctor_id?: number;
  advice_text: string;
  category?: string;
  created_at: string;
}

// GET /api/v1/advice
export const getAdvice = async (): Promise<BackendAdvice[]> => {
  const response = await api.get<{ advice: BackendAdvice[] }>('/v1/advice');
  return response.data.advice;
};

// POST /api/v1/advice
export const createAdvice = async (data: Partial<BackendAdvice>): Promise<BackendAdvice> => {
  const response = await api.post<{ advice: BackendAdvice }>('/v1/advice', data);
  return response.data.advice;
};

// PUT /api/v1/advice/{id}
export const updateAdvice = async (id: number, data: Partial<BackendAdvice>): Promise<BackendAdvice> => {
  const response = await api.put<{ advice: BackendAdvice }>(`/v1/advice/${id}`, data);
  return response.data.advice;
};

// ─── Procedures ──────────────────────────────────────────────────────────────

export interface BackendProcedure {
  id: number;
  patient_id: number;
  consultation_id?: number;
  doctor_id?: number;
  procedure_name: string;
  procedure_code?: string;
  description?: string;
  performed_at?: string;
  status?: string;
  notes?: string;
}

// GET /api/v1/procedures
export const getProcedures = async (): Promise<BackendProcedure[]> => {
  const response = await api.get<{ procedures: BackendProcedure[] }>('/v1/procedures');
  return response.data.procedures;
};

// POST /api/v1/procedures
export const createProcedure = async (data: Partial<BackendProcedure>): Promise<BackendProcedure> => {
  const response = await api.post<{ procedure: BackendProcedure }>('/v1/procedures', data);
  return response.data.procedure;
};

// ─── Follow-Ups ──────────────────────────────────────────────────────────────

export interface BackendFollowUp {
  id: number;
  patient_id: number;
  doctor_id?: number;
  consultation_id?: number;
  follow_up_date: string;
  reason?: string;
  notes?: string;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
}

// GET /api/v1/follow-ups
export const getFollowUps = async (): Promise<BackendFollowUp[]> => {
  const response = await api.get<{ follow_ups: BackendFollowUp[] }>('/v1/follow-ups');
  return response.data.follow_ups;
};

// POST /api/v1/follow-ups
export const createFollowUp = async (data: Partial<BackendFollowUp>): Promise<BackendFollowUp> => {
  const response = await api.post<{ follow_up: BackendFollowUp }>('/v1/follow-ups', data);
  return response.data.follow_up;
};

// PUT /api/v1/follow-ups/{id}
export const updateFollowUp = async (id: number, data: Partial<BackendFollowUp>): Promise<BackendFollowUp> => {
  const response = await api.put<{ follow_up: BackendFollowUp }>(`/v1/follow-ups/${id}`, data);
  return response.data.follow_up;
};

// ─── Prescriptions ───────────────────────────────────────────────────────────

export interface BackendPrescription {
  id: number;
  patient_id: number;
  doctor_id: number;
  consultation_id?: number;
  prescription_date: string;
  notes?: string;
  status?: string;
  medications?: BackendMedication[];
}

// GET /api/prescriptions
export const getPrescriptions = async (): Promise<BackendPrescription[]> => {
  const response = await api.get<{ prescriptions: BackendPrescription[] }>('/prescriptions');
  return response.data.prescriptions;
};

// POST /api/prescriptions
export const createPrescription = async (data: Partial<BackendPrescription>): Promise<BackendPrescription> => {
  const response = await api.post<{ prescription: BackendPrescription }>('/prescriptions', data);
  return response.data.prescription;
};

// PUT /api/prescriptions/{id}
export const updatePrescription = async (id: number, data: Partial<BackendPrescription>): Promise<BackendPrescription> => {
  const response = await api.put<{ prescription: BackendPrescription }>(`/prescriptions/${id}`, data);
  return response.data.prescription;
};

// ─── Appointments ────────────────────────────────────────────────────────────

export interface BackendAppointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time?: string;
  duration_minutes?: number;
  appointment_type?: string;
  status?: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  reason?: string;
  notes?: string;
  token_number?: number;
  created_at: string;
}

// GET /api/appointments
export const getAppointments = async (): Promise<BackendAppointment[]> => {
  const response = await api.get<{ appointments: BackendAppointment[] }>('/appointments');
  return response.data.appointments;
};

// POST /api/appointments
export const createAppointment = async (data: Partial<BackendAppointment>): Promise<BackendAppointment> => {
  const response = await api.post<{ appointment: BackendAppointment }>('/appointments', data);
  return response.data.appointment;
};

// PUT /api/appointments/{id}
export const updateAppointment = async (id: number, data: Partial<BackendAppointment>): Promise<BackendAppointment> => {
  const response = await api.put<{ appointment: BackendAppointment }>(`/appointments/${id}`, data);
  return response.data.appointment;
};

// DELETE /api/appointments/{id}
export const deleteAppointment = async (id: number): Promise<void> => {
  await api.delete(`/appointments/${id}`);
};

// ─── Patient Encounters ──────────────────────────────────────────────────────

export interface BackendEncounter {
  id: number;
  patient_id: number;
  doctor_id?: number;
  appointment_id?: number;
  encounter_date: string;
  encounter_type?: string;
  chief_complaint?: string;
  vitals?: Record<string, any>;
  status?: string;
  notes?: string;
  created_at: string;
}

// GET /api/patients/{patientId}/encounters
export const getPatientEncounters = async (patientId: number): Promise<BackendEncounter[]> => {
  const response = await api.get<{ encounters: BackendEncounter[] }>(`/patients/${patientId}/encounters`);
  return response.data.encounters;
};

// POST /api/patients/{patientId}/encounters
export const createEncounter = async (patientId: number, data: Partial<BackendEncounter>): Promise<BackendEncounter> => {
  const response = await api.post<{ encounter: BackendEncounter }>(`/patients/${patientId}/encounters`, data);
  return response.data.encounter;
};

// PUT /api/patients/{patientId}/encounters/{encounterId}
export const updateEncounter = async (patientId: number, encounterId: number, data: Partial<BackendEncounter>): Promise<BackendEncounter> => {
  const response = await api.put<{ encounter: BackendEncounter }>(`/patients/${patientId}/encounters/${encounterId}`, data);
  return response.data.encounter;
};

// ─── Admin Users ─────────────────────────────────────────────────────────────

export interface BackendAdminUser {
  id: number;
  name: string;
  email: string;
  role_id: number;
  role?: { id: number; name: string };
  created_at: string;
}

// GET /api/admin/users
export const getAdminUsers = async (): Promise<BackendAdminUser[]> => {
  const response = await api.get<{ users: BackendAdminUser[] }>('/admin/users');
  return response.data.users;
};

// POST /api/admin/users
export const createAdminUser = async (data: { name: string; email: string; password: string; role_id: number }): Promise<BackendAdminUser> => {
  const response = await api.post<{ user: BackendAdminUser }>('/admin/users', data);
  return response.data.user;
};

// PUT /api/admin/users/{id}
export const updateAdminUser = async (id: number, data: { name: string; email: string; role_id: number }): Promise<BackendAdminUser> => {
  const response = await api.put<{ user: BackendAdminUser }>(`/admin/users/${id}`, data);
  return response.data.user;
};

// DELETE /api/admin/users/{id}
export const deleteAdminUser = async (id: number): Promise<void> => {
  await api.delete(`/admin/users/${id}`);
};
