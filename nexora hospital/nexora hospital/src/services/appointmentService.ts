import api from './api';
import { Appointment } from '../types';

export interface BackendAppointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  appointment_type?: string;
  status?: string;
  reason?: string;
  notes?: string;
  created_at: string;
  patient?: any;
  doctor?: any;
}

// Convert BackendAppointment to Frontend Appointment
export const mapAppointment = (ba: BackendAppointment): Appointment => {
  return {
    id: ba.id.toString(),
    patientId: ba.patient_id.toString(),
    patientName: ba.patient?.first_name ? `${ba.patient.first_name} ${ba.patient.last_name || ''}`.trim() : `Patient ${ba.patient_id}`,
    patientPhone: ba.patient?.primary_phone || '',
    patientMrn: ba.patient?.patient_id || '',
    departmentId: '1',
    departmentName: 'General', // Not supported in backend currently
    doctorId: ba.doctor_id.toString(),
    doctorName: ba.doctor?.name || `Doctor ${ba.doctor_id}`,
    date: ba.appointment_date,
    timeSlot: ba.appointment_time,
    tokenNumber: ba.id, // using ID as token for now
    appointmentType: (ba.appointment_type?.toUpperCase() || 'OPD') as any,
    status: (ba.status?.toUpperCase() || 'BOOKED') as any,
    reason: ba.reason || '',
    waitTimeMinutes: 0,
    isNewPatient: false
  };
};

export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await api.get<{ data: BackendAppointment[] }>('/appointments');
    // Depending on Laravel pagination/resource formatting, it might be in .data
    const items = Array.isArray(response.data) ? response.data : (response.data.data || []);
    return items.map(mapAppointment);
  } catch (error) {
    console.error("Failed to fetch appointments", error);
    return [];
  }
};

export const createAppointment = async (
  apt: Omit<Appointment, 'id' | 'tokenNumber' | 'waitTimeMinutes'>
): Promise<Appointment> => {
  const payload = {
    patient_id: parseInt(apt.patientId),
    doctor_id: parseInt(apt.doctorId),
    appointment_date: apt.date,
    appointment_time: apt.timeSlot,
    appointment_type: apt.appointmentType.toLowerCase(),
    status: apt.status.toLowerCase(),
    reason: apt.reason
  };
  
  const response = await api.post<{ data: BackendAppointment }>('/appointments', payload);
  return mapAppointment(response.data.data);
};
