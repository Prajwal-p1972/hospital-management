import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { 
  ProductMode, UserRole, User, Patient, Inquiry, Appointment, Encounter, 
  Bed, Admission, TriageCase, ToothRecord, TreatmentPlanItem, OperatoryChair, 
  DentalLabCase, DentalRecall, MedicationItem, LabOrder, Invoice, AuditEvent, 
  DataPipeline, KPIDefinition, DataQualityCheck, ToothSurface, ToothFindingType,
  PaymentMethod, AppointmentStatus
} from '../types';
import { 
  INITIAL_USERS, INITIAL_PATIENTS, INITIAL_INQUIRIES, INITIAL_APPOINTMENTS, 
  INITIAL_ENCOUNTERS, INITIAL_BEDS, INITIAL_ADMISSIONS, INITIAL_TRIAGE_CASES, 
  INITIAL_TEETH_RECORDS, INITIAL_TREATMENT_PLANS, INITIAL_OPERATORY_CHAIRS, 
  INITIAL_LAB_CASES, INITIAL_RECALLS, INITIAL_MEDICATIONS, INITIAL_LAB_ORDERS, 
  INITIAL_INVOICES, INITIAL_AUDIT_EVENTS, INITIAL_PIPELINES, INITIAL_KPIS, 
  INITIAL_DATA_QUALITY_CHECKS 
} from '../data/seedData';
import { getPatients, createPatient, mapPatient, searchPatients as apiSearchPatients } from '../services/patientService';
import { getAppointments, createAppointment as apiCreateAppointment } from '../services/appointmentService';
import { getDoctors } from '../services/doctorService';
import { getInquiries, createInquiry as apiCreateInquiry } from '../services/inquiryService';
import { useAuth } from './AuthContext';

export type NavigationTab = 
  | 'DASHBOARD'
  | 'PATIENTS'
  | 'INQUIRIES_QUEUE'
  | 'OPD_CONSULTATION'
  | 'BED_BOARD'
  | 'EMERGENCY_TRIAGE'
  | 'DENTAL_MODE'
  | 'PHARMACY'
  | 'LAB_DIAGNOSTICS'
  | 'BILLING'
  | 'DATA_ENGINEERING'
  | 'KPI_CATALOGUE'
  | 'AUDIT_LOGS';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

interface AppContextType {
  mode: ProductMode;
  setMode: (mode: ProductMode) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  selectedDate: string; // YYYY-MM-DD
  setSelectedDate: (date: string) => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  
  // Data
  patients: Patient[];
  inquiries: Inquiry[];
  appointments: Appointment[];
  encounters: Encounter[];
  beds: Bed[];
  admissions: Admission[];
  triageCases: TriageCase[];
  teethRecords: ToothRecord[];
  treatmentPlans: TreatmentPlanItem[];
  operatoryChairs: OperatoryChair[];
  dentalLabCases: DentalLabCase[];
  dentalRecalls: DentalRecall[];
  medications: MedicationItem[];
  labOrders: LabOrder[];
  invoices: Invoice[];
  auditEvents: AuditEvent[];
  pipelines: DataPipeline[];
  kpis: KPIDefinition[];
  qualityChecks: DataQualityCheck[];
  
  // Actions
  addPatient: (patient: Omit<Patient, 'id' | 'mrn' | 'qrToken' | 'createdAt'>) => Promise<Patient>;
  checkDuplicatePatient: (name: string, phone: string, dob: string) => Promise<Patient | null>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  addAppointment: (apt: Omit<Appointment, 'id' | 'tokenNumber' | 'waitTimeMinutes'>) => Promise<Appointment>;
  addInquiry: (inq: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => Promise<Inquiry>;
  convertInquiryToAppointment: (inquiryId: string, patientId: string, doctorId: string, doctorName: string, deptId: string, deptName: string, timeSlot: string) => Promise<void>;
  saveEncounter: (encounter: Encounter) => void;
  updateToothFinding: (toothNum: number, surface: ToothSurface, findingType: ToothFindingType, notes?: string) => void;
  updateTreatmentPlanStatus: (planId: string, status: 'ACCEPTED' | 'DECLINED' | 'COMPLETED') => void;
  convertPlanToInvoice: (planItem: TreatmentPlanItem) => void;
  updateBedStatus: (bedId: string, status: Bed['status'], patientId?: string, patientName?: string, patientMrn?: string) => void;
  transferPatientBed: (currentBedId: string, targetBedId: string) => void;
  dischargePatientFromBed: (bedId: string) => void;
  addTriageCase: (triage: Omit<TriageCase, 'id' | 'arrivalTime'>) => void;
  dispensePrescription: (medicationId: string, qty: number) => boolean;
  updateLabResult: (orderId: string, resultValue: string, abnormalFlag: boolean) => void;
  payInvoice: (invoiceId: string, amount: number, method: PaymentMethod) => void;
  addAuditEvent: (action: AuditEvent['action'], entityType: AuditEvent['entityType'], entityId: string, details: string) => void;
  
  // UI States & Modals
  activePatient360Id: string | null;
  setActivePatient360Id: (id: string | null) => void;
  qrModalPatient: Patient | null;
  setQrModalPatient: (patient: Patient | null) => void;
  toasts: ToastMessage[];
  showToast: (text: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ProductMode>('HOSPITAL');
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Hospital Admin default
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-03');
  const [activeTab, setActiveTab] = useState<NavigationTab>('DASHBOARD');

  // Entities state
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [encounters, setEncounters] = useState<Encounter[]>(INITIAL_ENCOUNTERS);
  const [beds, setBeds] = useState<Bed[]>(INITIAL_BEDS);
  const [admissions, setAdmissions] = useState<Admission[]>(INITIAL_ADMISSIONS);
  const [triageCases, setTriageCases] = useState<TriageCase[]>(INITIAL_TRIAGE_CASES);
  const [teethRecords, setTeethRecords] = useState<ToothRecord[]>(INITIAL_TEETH_RECORDS);
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlanItem[]>(INITIAL_TREATMENT_PLANS);
  const [operatoryChairs] = useState<OperatoryChair[]>(INITIAL_OPERATORY_CHAIRS);
  const [dentalLabCases, setDentalLabCases] = useState<DentalLabCase[]>(INITIAL_LAB_CASES);
  const [dentalRecalls] = useState<DentalRecall[]>(INITIAL_RECALLS);
  const [medications, setMedications] = useState<MedicationItem[]>(INITIAL_MEDICATIONS);
  const [labOrders, setLabOrders] = useState<LabOrder[]>(INITIAL_LAB_ORDERS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(INITIAL_AUDIT_EVENTS);
  const [pipelines] = useState<DataPipeline[]>(INITIAL_PIPELINES);
  const [kpis] = useState<KPIDefinition[]>(INITIAL_KPIS);
  const [qualityChecks] = useState<DataQualityCheck[]>(INITIAL_DATA_QUALITY_CHECKS);

  // Modals & Popups
  const [activePatient360Id, setActivePatient360Id] = useState<string | null>(null);
  const [qrModalPatient, setQrModalPatient] = useState<Patient | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Only fetch protected data from the backend when logged in
    if (!isAuthenticated) return;
    // Fetch live patients from Laravel backend
    getPatients()
      .then((data) => {
        // If the backend has patients, use them, otherwise fallback to seed data
        if (data.length > 0) {
          setPatients(data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch patients from API:', err);
      });

    // Fetch live appointments from Laravel backend
    getAppointments()
      .then((data) => {
        if (data.length > 0) {
          setAppointments(data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch appointments from API:', err);
      });

    // Fetch doctors and add them to users
    getDoctors()
      .then((docs) => {
        if (docs.length > 0) {
          const mappedDocs: User[] = docs.map(d => ({
            id: `doc_${d.id}`,
            name: d.name,
            role: 'DOCTOR',
            department: d.department || d.specialization || 'General'
          }));
          setUsers(prev => {
            // Remove dummy doctors and append real ones
            const nonDoctors = prev.filter(u => u.role !== 'DOCTOR');
            return [...nonDoctors, ...mappedDocs];
          });
        }
      })
      .catch((err) => {
        console.error('Failed to fetch doctors from API:', err);
      });

    // Fetch inquiries
    getInquiries()
      .then((data) => {
        if (data.length > 0) {
          setInquiries(data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch inquiries from API:', err);
      });
  }, [isAuthenticated]);

  const showToast = (text: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setMode = (newMode: ProductMode) => {
    setModeState(newMode);
    if (newMode === 'DENTAL') {
      setActiveTab('DENTAL_MODE');
      // Suggest switching current role to Dentist if currently doctor/admin
      const dentist = users.find(u => u.role === 'DENTIST');
      if (dentist && currentUser.role !== 'SUPER_ADMIN') {
        setCurrentUser(dentist);
      }
      showToast('Switched to Dedicated Dental Clinic Mode', 'info');
    } else if (newMode === 'CLINIC') {
      if (activeTab === 'BED_BOARD' || activeTab === 'EMERGENCY_TRIAGE') {
        setActiveTab('DASHBOARD');
      }
      showToast('Switched to Outpatient Clinic Mode', 'info');
    } else {
      showToast(`Switched to ${newMode} Mode`, 'info');
    }
  };

  const addAuditEvent = (
    action: AuditEvent['action'], 
    entityType: AuditEvent['entityType'], 
    entityId: string, 
    details: string
  ) => {
    const newEvent: AuditEvent = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action,
      entityType,
      entityId,
      details,
      facility: 'NX-FAC-01'
    };
    setAuditEvents(prev => [newEvent, ...prev]);
  };

  const checkDuplicatePatient = async (name: string, phone: string, dob: string): Promise<Patient | null> => {
    try {
      const results = await apiSearchPatients({
        phone: phone.replace(/[^0-9]/g, ''),
        first_name: name.split(' ')[0],
      });
      if (results && results.length > 0) {
        // Find exact match
        const match = results.find(p => p.dob === dob || p.phone === phone);
        if (match) return match;
      }
      return null;
    } catch (err) {
      console.error('Error checking for duplicate patient', err);
      return null;
    }
  };

  const addPatient = async (patientData: Omit<Patient, 'id' | 'mrn' | 'qrToken' | 'createdAt'>): Promise<Patient> => {
    try {
      const result = await createPatient({
        first_name: patientData.name.split(' ')[0] || patientData.name,
        last_name: patientData.name.split(' ').slice(1).join(' '),
        date_of_birth: patientData.dob,
        sex: patientData.gender.toLowerCase(),
        blood_group: patientData.bloodGroup,
        primary_phone: patientData.phone,
        alternate_phone: patientData.altPhone,
        email: patientData.email,
        address: patientData.address,
        city: patientData.city,
        allergies: patientData.allergies.join(','),
        emergency_contact_name: patientData.emergencyContact.name,
        emergency_contact_phone: patientData.emergencyContact.phone,
        emergency_contact_relationship: patientData.emergencyContact.relationship,
        patient_type: patientData.patientType.toLowerCase(),
        consent_given: patientData.consentSigned
      });

      if (!result.success || !result.patient) {
        throw new Error(result.message || 'Failed to create patient');
      }

      const newPatient = mapPatient(result.patient);
      
      setPatients(prev => [newPatient, ...prev]);
      addAuditEvent('CREATE', 'PATIENT', newPatient.id, `Registered patient ${newPatient.name} with MRN ${newPatient.mrn}`);
      showToast(`Patient ${newPatient.name} registered successfully with ID ${newPatient.mrn}`, 'success');
      return newPatient;
    } catch (err: any) {
      showToast(err.message || 'Error creating patient', 'error');
      throw err;
    }
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const updated = { ...a, status };
        if (status === 'ARRIVED' && !a.checkInTime) updated.checkInTime = timeStr;
        if (status === 'IN_CONSULTATION' && !a.consultStartTime) updated.consultStartTime = timeStr;
        if (status === 'COMPLETED' && !a.consultEndTime) updated.consultEndTime = timeStr;
        return updated;
      }
      return a;
    }));
    addAuditEvent('UPDATE', 'APPOINTMENT', id, `Updated appointment status to ${status}`);
    showToast(`Appointment status updated to ${status}`, 'info');
  };

  const addAppointment = async (aptData: Omit<Appointment, 'id' | 'tokenNumber' | 'waitTimeMinutes'>): Promise<Appointment> => {
    try {
      const newAppointment = await apiCreateAppointment(aptData);
      
      setAppointments(prev => [...prev, newAppointment]);
      addAuditEvent('CREATE', 'APPOINTMENT', newAppointment.id, `Booked appointment for ${newAppointment.patientName} with ${newAppointment.doctorName}`);
      showToast(`Appointment confirmed for ${newAppointment.patientName}`, 'success');
      return newAppointment;
    } catch (err: any) {
      console.error("Failed to create appointment", err);
      showToast(err.message || 'Error booking appointment', 'error');
      throw err;
    }
  };

  const addInquiry = async (inqData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Promise<Inquiry> => {
    try {
      const newInquiry = await apiCreateInquiry(inqData);
      setInquiries(prev => [newInquiry, ...prev]);
      showToast(`New inquiry logged from ${newInquiry.name}`, 'info');
      return newInquiry;
    } catch (err: any) {
      console.error("Failed to create inquiry", err);
      showToast(err.message || 'Error capturing lead', 'error');
      throw err;
    }
  };

  const convertInquiryToAppointment = async (
    inquiryId: string, 
    patientId: string, 
    doctorId: string, 
    doctorName: string, 
    deptId: string, 
    deptName: string, 
    timeSlot: string
  ) => {
    const inq = inquiries.find(i => i.id === inquiryId);
    const pat = patients.find(p => p.id === patientId);
    if (!inq || !pat) return;

    setInquiries(prev => prev.map(i => i.id === inquiryId ? { ...i, status: 'BOOKED' } : i));

    await addAppointment({
      patientId: pat.id,
      patientName: pat.name,
      patientPhone: pat.phone,
      patientMrn: pat.mrn,
      departmentId: deptId,
      departmentName: deptName,
      doctorId,
      doctorName,
      date: selectedDate,
      timeSlot,
      appointmentType: deptName.includes('Dental') ? 'DENTAL' : 'OPD',
      status: 'CONFIRMED',
      reason: inq.notes || 'Inquiry Follow-up Consultation',
      isNewPatient: pat.patientType === 'NEW'
    });

    addAuditEvent('UPDATE', 'APPOINTMENT', inquiryId, `Converted inquiry ${inquiryId} into appointment for ${pat.name}`);
  };

  const saveEncounter = (encounter: Encounter) => {
    setEncounters(prev => {
      const idx = prev.findIndex(e => e.id === encounter.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = encounter;
        return next;
      }
      return [encounter, ...prev];
    });

    // Mark appointment as completed
    if (encounter.appointmentId) {
      updateAppointmentStatus(encounter.appointmentId, 'COMPLETED');
    }

    addAuditEvent('FINALIZE', 'ENCOUNTER', encounter.id, `Finalized clinical encounter for patient ${encounter.patientId}. Primary diagnosis: ${encounter.diagnoses[0]?.description || 'None'}`);
    showToast('Clinical encounter & prescription signed successfully!', 'success');
  };

  const updateToothFinding = (
    toothNum: number, 
    surface: ToothSurface, 
    findingType: ToothFindingType, 
    notes?: string
  ) => {
    setTeethRecords(prev => prev.map(t => {
      if (t.toothNumber === toothNum) {
        const newFinding = {
          id: `tf_${Date.now()}`,
          surface,
          findingType,
          date: selectedDate,
          notes: notes || `${findingType} recorded on surface ${surface}`
        };
        return {
          ...t,
          findings: [...t.findings, newFinding]
        };
      }
      return t;
    }));

    // If caries or root canal, automatically propose in treatment plan
    if (findingType === 'CARIES') {
      const newItem: TreatmentPlanItem = {
        id: `tp_${Date.now()}`,
        patientId: 'pat_002',
        toothNumber: toothNum,
        surface,
        procedureCode: 'D2391',
        procedureName: `Composite Resin Restoration - Tooth #${toothNum} (${surface})`,
        estimatedCost: 175.00,
        priority: 'HIGH',
        phase: 'PHASE_1',
        acceptanceStatus: 'PENDING',
        notes: notes || 'Proposed from diagnostic tooth chart'
      };
      setTreatmentPlans(tp => [newItem, ...tp]);
    } else if (findingType === 'ROOT_CANAL') {
      const newItem: TreatmentPlanItem = {
        id: `tp_${Date.now()}`,
        patientId: 'pat_001',
        toothNumber: toothNum,
        surface: 'ALL',
        procedureCode: 'D3330',
        procedureName: `Endodontic Root Canal Therapy - Molar #${toothNum}`,
        estimatedCost: 750.00,
        priority: 'HIGH',
        phase: 'PHASE_1',
        acceptanceStatus: 'PENDING'
      };
      setTreatmentPlans(tp => [newItem, ...tp]);
    }

    addAuditEvent('UPDATE', 'TREATMENT_PLAN', `tooth_${toothNum}`, `Added tooth #${toothNum} finding: ${findingType} (${surface})`);
    showToast(`Updated Tooth #${toothNum} with finding: ${findingType}`, 'info');
  };

  const updateTreatmentPlanStatus = (planId: string, status: 'ACCEPTED' | 'DECLINED' | 'COMPLETED') => {
    setTreatmentPlans(prev => prev.map(tp => {
      if (tp.id === planId) {
        return {
          ...tp,
          acceptanceStatus: status,
          acceptanceDate: status === 'ACCEPTED' ? selectedDate : tp.acceptanceDate
        };
      }
      return tp;
    }));
    addAuditEvent('UPDATE', 'TREATMENT_PLAN', planId, `Treatment plan item #${planId} updated to ${status}`);
    showToast(`Treatment plan item status: ${status}`, status === 'ACCEPTED' ? 'success' : 'info');
  };

  const convertPlanToInvoice = (planItem: TreatmentPlanItem) => {
    const targetPatient = patients.find(p => p.id === planItem.patientId) || patients[0];
    const invoiceNumber = `INV-DENT-${Date.now().toString().slice(-6)}`;
    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber,
      patientId: targetPatient.id,
      patientName: targetPatient.name,
      patientMrn: targetPatient.mrn,
      date: selectedDate,
      items: [
        {
          id: `item_${Date.now()}`,
          description: `${planItem.procedureName} (Tooth #${planItem.toothNumber})`,
          category: 'DENTAL',
          quantity: 1,
          unitPrice: planItem.estimatedCost,
          total: planItem.estimatedCost
        }
      ],
      subtotal: planItem.estimatedCost,
      discount: 0,
      tax: planItem.estimatedCost * 0.05,
      grandTotal: planItem.estimatedCost * 1.05,
      paidAmount: 0,
      outstandingAmount: planItem.estimatedCost * 1.05,
      status: 'UNPAID',
      paymentMethod: 'CREDIT_CARD'
    };

    setInvoices(prev => [newInvoice, ...prev]);
    updateTreatmentPlanStatus(planItem.id, 'COMPLETED');
    addAuditEvent('CREATE', 'INVOICE', newInvoice.id, `Generated invoice ${invoiceNumber} from Dental Treatment Plan item #${planItem.id}`);
    showToast(`Converted treatment plan to Invoice ${invoiceNumber}`, 'success');
  };

  const updateBedStatus = (bedId: string, status: Bed['status'], patientId?: string, patientName?: string, patientMrn?: string) => {
    setBeds(prev => prev.map(b => {
      if (b.id === bedId) {
        return {
          ...b,
          status,
          currentPatientId: patientId,
          currentPatientName: patientName,
          currentPatientMrn: patientMrn,
          admittedAt: status === 'OCCUPIED' ? new Date().toISOString() : undefined
        };
      }
      return b;
    }));
    addAuditEvent('UPDATE', 'ADMISSION', bedId, `Updated Bed ${bedId} status to ${status}`);
    showToast(`Bed updated to ${status}`, 'info');
  };

  const transferPatientBed = (currentBedId: string, targetBedId: string) => {
    const sourceBed = beds.find(b => b.id === currentBedId);
    const targetBed = beds.find(b => b.id === targetBedId);
    if (!sourceBed || !targetBed || targetBed.status !== 'AVAILABLE') {
      showToast('Target bed is not available for transfer', 'error');
      return;
    }

    setBeds(prev => prev.map(b => {
      if (b.id === currentBedId) {
        return { ...b, status: 'CLEANING', currentPatientId: undefined, currentPatientName: undefined, currentPatientMrn: undefined };
      }
      if (b.id === targetBedId) {
        return {
          ...b,
          status: 'OCCUPIED',
          currentPatientId: sourceBed.currentPatientId,
          currentPatientName: sourceBed.currentPatientName,
          currentPatientMrn: sourceBed.currentPatientMrn,
          admittedAt: sourceBed.admittedAt
        };
      }
      return b;
    }));

    addAuditEvent('UPDATE', 'ADMISSION', targetBedId, `Transferred patient ${sourceBed.currentPatientName} from Bed ${sourceBed.number} to ${targetBed.number}`);
    showToast(`Patient transferred from ${sourceBed.number} to ${targetBed.number}`, 'success');
  };

  const dischargePatientFromBed = (bedId: string) => {
    const bed = beds.find(b => b.id === bedId);
    if (!bed) return;

    setBeds(prev => prev.map(b => b.id === bedId ? {
      ...b,
      status: 'CLEANING',
      currentPatientId: undefined,
      currentPatientName: undefined,
      currentPatientMrn: undefined
    } : b));

    addAuditEvent('UPDATE', 'ADMISSION', bedId, `Discharged patient ${bed.currentPatientName} from Bed ${bed.number}. Bed set to Cleaning.`);
    showToast(`Patient discharged from ${bed.number}. Bed is now in cleaning status.`, 'success');
  };

  const addTriageCase = (triageData: Omit<TriageCase, 'id' | 'arrivalTime'>) => {
    const newCase: TriageCase = {
      ...triageData,
      id: `trg_${Date.now()}`,
      arrivalTime: `${selectedDate} ${new Date().toTimeString().substring(0, 5)}`
    };
    setTriageCases(prev => [newCase, ...prev]);
    showToast(`Emergency Triage Alert: ${newCase.patientName} triaged as ${newCase.acuity.replace(/_/g, ' ')}`, 'warning');
    addAuditEvent('CREATE', 'PATIENT', newCase.id, `Emergency triage recorded for ${newCase.patientName} (${newCase.acuity})`);
  };

  const dispensePrescription = (medicationId: string, qty: number): boolean => {
    const med = medications.find(m => m.id === medicationId);
    if (!med || med.stockQuantity < qty) {
      showToast(`Insufficient stock for ${med?.name || 'medication'}`, 'error');
      return false;
    }

    setMedications(prev => prev.map(m => {
      if (m.id === medicationId) {
        return { ...m, stockQuantity: m.stockQuantity - qty };
      }
      return m;
    }));

    showToast(`Dispensed ${qty} units of ${med.name}. Remaining: ${med.stockQuantity - qty}`, 'success');
    addAuditEvent('UPDATE', 'PRESCRIPTION', medicationId, `Dispensed ${qty} units of ${med.name}`);
    return true;
  };

  const updateLabResult = (orderId: string, resultValue: string, abnormalFlag: boolean) => {
    setLabOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          resultValue,
          abnormalFlag,
          status: 'COMPLETED'
        };
      }
      return order;
    }));
    addAuditEvent('UPDATE', 'ENCOUNTER', orderId, `Released diagnostic lab result for Order #${orderId}`);
    showToast(`Lab result verified and released for Order #${orderId}`, 'success');
  };

  const payInvoice = (invoiceId: string, amount: number, method: PaymentMethod) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const newPaid = inv.paidAmount + amount;
        const newOutstanding = Math.max(0, inv.grandTotal - newPaid);
        const status = newOutstanding === 0 ? 'PAID' : 'PARTIALLY_PAID';
        return {
          ...inv,
          paidAmount: newPaid,
          outstandingAmount: newOutstanding,
          status,
          paymentMethod: method
        };
      }
      return inv;
    }));

    addAuditEvent('CREATE', 'INVOICE', invoiceId, `Payment of $${amount.toFixed(2)} recorded via ${method} for invoice #${invoiceId}`);
    showToast(`Payment of $${amount.toFixed(2)} recorded successfully!`, 'success');
  };

  return (
    <AppContext.Provider value={{
      mode,
      setMode,
      currentUser,
      setCurrentUser,
      users,
      selectedDate,
      setSelectedDate,
      activeTab,
      setActiveTab,
      patients,
      inquiries,
      appointments,
      encounters,
      beds,
      admissions,
      triageCases,
      teethRecords,
      treatmentPlans,
      operatoryChairs,
      dentalLabCases,
      dentalRecalls,
      medications,
      labOrders,
      invoices,
      auditEvents,
      pipelines,
      kpis,
      qualityChecks,
      addPatient,
      checkDuplicatePatient,
      updateAppointmentStatus,
      addAppointment,
      addInquiry,
      convertInquiryToAppointment,
      saveEncounter,
      updateToothFinding,
      updateTreatmentPlanStatus,
      convertPlanToInvoice,
      updateBedStatus,
      transferPatientBed,
      dischargePatientFromBed,
      addTriageCase,
      dispensePrescription,
      updateLabResult,
      payInvoice,
      addAuditEvent,
      activePatient360Id,
      setActivePatient360Id,
      qrModalPatient,
      setQrModalPatient,
      toasts,
      showToast,
      removeToast,
      isMobileNavOpen,
      setIsMobileNavOpen
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
