import api from './api';
import { Patient } from '../types';

// Backend patient shape (snake_case from Laravel)
export interface BackendPatient {
  id: number;
  patient_id: string;        // e.g. PAT-XXXXXXXX
  first_name: string;
  middle_name?: string;
  last_name?: string;
  date_of_birth?: string;
  sex?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  blood_group?: string;
  photo?: string;
  nationality?: string;
  marital_status?: string;
  occupation?: string;
  primary_phone: string;
  alternate_phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  patient_type?: string;
  allergies?: string;
  critical_alerts?: string;
  infection_precautions?: string;
  clinical_safety_flags?: string;
  consent_given?: boolean;
  qr_token?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface PatientSearchParams {
  phone?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
}

export interface CreatePatientPayload {
  first_name: string;
  middle_name?: string;
  last_name?: string;
  date_of_birth?: string;
  sex?: string;
  blood_group?: string;
  primary_phone: string;
  alternate_phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  patient_type?: string;
  allergies?: string;
  consent_given?: boolean;
}

// Map BackendPatient to Frontend Patient
export const mapPatient = (bp: BackendPatient): Patient => {
  const calculateAge = (dob: string | undefined): number => {
    if (!dob) return 0;
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  return {
    id: bp.id.toString(),
    mrn: bp.patient_id,
    name: [bp.first_name, bp.middle_name, bp.last_name].filter(Boolean).join(' '),
    dob: bp.date_of_birth || '',
    age: calculateAge(bp.date_of_birth),
    gender: (bp.sex?.toUpperCase() || 'OTHER') as 'MALE' | 'FEMALE' | 'OTHER',
    phone: bp.primary_phone,
    altPhone: bp.alternate_phone,
    email: bp.email || '',
    address: bp.address || '',
    city: bp.city || '',
    bloodGroup: bp.blood_group || '',
    allergies: bp.allergies ? bp.allergies.split(',') : [],
    emergencyContact: {
      name: bp.emergency_contact_name || '',
      relationship: bp.emergency_contact_relationship || '',
      phone: bp.emergency_contact_phone || '',
    },
    patientType: (bp.patient_type?.toUpperCase() || 'OPD') as Patient['patientType'],
    qrToken: bp.qr_token || '',
    consentSigned: bp.consent_given || false,
    createdAt: bp.created_at,
  };
};

// GET /api/patients
export const getPatients = async (): Promise<Patient[]> => {
  const response = await api.get<{ patients: BackendPatient[] }>('/patients');
  return response.data.patients.map(mapPatient);
};

// GET /api/patients/{id}
export const getPatient = async (id: number): Promise<Patient> => {
  const response = await api.get<{ patient: BackendPatient }>(`/patients/${id}`);
  return mapPatient(response.data.patient);
};

// POST /api/patients
// Returns { patient } on 201 or { duplicate_patient } on 409
export const createPatient = async (data: CreatePatientPayload): Promise<{
  success: boolean;
  patient?: BackendPatient;
  duplicate?: BackendPatient;
  message: string;
}> => {
  try {
    const response = await api.post<{ message: string; patient: BackendPatient }>('/patients', data);
    return { success: true, patient: response.data.patient, message: response.data.message };
  } catch (error: any) {
    if (error.response?.status === 409) {
      return {
        success: false,
        duplicate: error.response.data.duplicate_patient,
        message: error.response.data.message,
      };
    }
    throw error;
  }
};

// PUT /api/patients/{id}
export const updatePatient = async (id: number, data: Partial<CreatePatientPayload>): Promise<BackendPatient> => {
  const response = await api.put<{ patient: BackendPatient }>(`/patients/${id}`, data);
  return response.data.patient;
};

// DELETE /api/patients/{id}
export const deletePatient = async (id: number): Promise<void> => {
  await api.delete(`/patients/${id}`);
};

// GET /api/patients/search
export const searchPatients = async (params: PatientSearchParams): Promise<Patient[]> => {
  const response = await api.get<{ patients: BackendPatient[] }>('/patients/search', { params });
  return response.data.patients.map(mapPatient);
};

// GET /api/patients/qr/{qr_token}
export const lookupByQRToken = async (qr_token: string): Promise<BackendPatient> => {
  const response = await api.get<{ patient: BackendPatient }>(`/patients/qr/${qr_token}`);
  return response.data.patient;
};

// GET /api/v1/patients/{id}/360
export const getPatient360 = async (id: number): Promise<any> => {
  const response = await api.get(`/v1/patients/${id}/360`);
  return response.data;
};
