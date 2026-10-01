import api from './api';
import { Inquiry } from '../types';

export interface BackendInquiry {
  id: number;
  name: string;
  phone: string;
  email?: string;
  source?: string;
  department?: string;
  preferred_doctor?: string;
  preferred_date?: string;
  notes?: string;
  status?: string;
  follow_up_owner?: string;
  created_at: string;
}

export const mapInquiry = (bi: BackendInquiry): Inquiry => {
  return {
    id: bi.id.toString(),
    name: bi.name,
    phone: bi.phone,
    email: bi.email || '',
    source: (bi.source?.toUpperCase() || 'PHONE') as any,
    department: bi.department || '',
    preferredDoctor: bi.preferred_doctor || '',
    preferredDate: bi.preferred_date || '',
    notes: bi.notes || '',
    status: (bi.status?.toUpperCase() || 'NEW') as any,
    followUpOwner: bi.follow_up_owner || '',
    createdAt: bi.created_at,
  };
};

export const getInquiries = async (): Promise<Inquiry[]> => {
  try {
    const response = await api.get<{ data: BackendInquiry[] }>('/v1/inquiries');
    const items = Array.isArray(response.data) ? response.data : (response.data.data || []);
    return items.map(mapInquiry);
  } catch (error) {
    console.error("Failed to fetch inquiries", error);
    return [];
  }
};

export const createInquiry = async (
  inq: Omit<Inquiry, 'id' | 'createdAt' | 'status'>
): Promise<Inquiry> => {
  const payload = {
    name: inq.name,
    phone: inq.phone,
    email: inq.email,
    source: inq.source,
    department: inq.department,
    preferred_doctor: inq.preferredDoctor,
    preferred_date: inq.preferredDate,
    notes: inq.notes,
    follow_up_owner: inq.followUpOwner,
  };
  
  const response = await api.post<{ data: BackendInquiry }>('/v1/inquiries', payload);
  return mapInquiry(response.data.data);
};

export const updateInquiryStatus = async (id: string, status: string): Promise<void> => {
  await api.put(`/v1/inquiries/${id}`, { status });
};
