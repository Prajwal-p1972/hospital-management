export type ProductMode = 'CLINIC' | 'HOSPITAL' | 'SUPER_SPECIALTY' | 'DENTAL';

export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'HOSPITAL_ADMIN' 
  | 'FRONT_DESK' 
  | 'DOCTOR' 
  | 'NURSE' 
  | 'DENTIST' 
  | 'PHARMACIST' 
  | 'LAB_TECH' 
  | 'BILLING_CASHIER' 
  | 'PATIENT';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  department?: string;
  avatar?: string;
}

export type PatientType = 'NEW' | 'REPEAT' | 'REFERRAL' | 'EMERGENCY' | 'OPD' | 'IPD' | 'CORPORATE';

export interface Patient {
  id: string;
  mrn: string; // e.g. NX-2026-0903-8821
  name: string;
  dob: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  altPhone?: string;
  email: string;
  address: string;
  city: string;
  bloodGroup: string;
  allergies: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  patientType: PatientType;
  qrToken: string; // safe token nxp_tok_...
  consentSigned: boolean;
  createdAt: string;
}

export type InquirySource = 'WALK_IN' | 'WEBSITE' | 'PHONE' | 'REFERRAL';
export type InquiryStatus = 'NEW' | 'CONTACTED' | 'BOOKED' | 'LOST';

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: InquirySource;
  department: string;
  preferredDoctor: string;
  preferredDate: string;
  notes: string;
  status: InquiryStatus;
  followUpOwner: string;
  createdAt: string;
}

export type AppointmentStatus = 
  | 'BOOKED' 
  | 'CONFIRMED' 
  | 'ARRIVED' 
  | 'IN_CONSULTATION' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'NO_SHOW';

export type AppointmentType = 'OPD' | 'DENTAL' | 'FOLLOW_UP' | 'EMERGENCY';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientMrn: string;
  departmentId: string;
  departmentName: string;
  doctorId: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  tokenNumber: number;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  checkInTime?: string;
  consultStartTime?: string;
  consultEndTime?: string;
  reason: string;
  waitTimeMinutes: number;
  isNewPatient: boolean;
}

export interface VitalSign {
  bpSystolic: number;
  bpDiastolic: number;
  heartRate: number;
  respiratoryRate: number;
  tempCelsius: number;
  spO2: number;
  heightCm: number;
  weightKg: number;
  bmi: number;
  recordedAt: string;
}

export interface DiagnosisEntry {
  code: string;
  description: string;
  type: 'PRIMARY' | 'SECONDARY';
  notes?: string;
}

export interface PrescriptionItem {
  id: string;
  medicationName: string;
  genericName: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  instructions: string;
  substitutionAllowed: boolean;
}

export interface Encounter {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  chiefComplaint: string;
  history: string;
  vitals: VitalSign;
  diagnoses: DiagnosisEntry[];
  prescriptions: PrescriptionItem[];
  advice: string;
  followUpDate?: string;
  isSigned: boolean;
  signedAt?: string;
  signedBy?: string;
}

export type BedStatus = 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE' | 'RESERVED';
export type WardType = 'GENERAL_MALE' | 'GENERAL_FEMALE' | 'ICU' | 'DELUXE' | 'DAY_CARE' | 'EMERGENCY_TRAUMA';

export interface Bed {
  id: string;
  number: string;
  ward: WardType;
  status: BedStatus;
  currentPatientId?: string;
  currentPatientName?: string;
  currentPatientMrn?: string;
  currentAdmissionId?: string;
  admittedAt?: string;
}

export interface Admission {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  bedId: string;
  bedNumber: string;
  ward: WardType;
  admittingDoctor: string;
  admissionDate: string;
  dischargeDate?: string;
  status: 'ADMITTED' | 'DISCHARGED' | 'TRANSFERRED';
  initialDiagnosis: string;
  dailyNotes: string[];
}

export type AcuityLevel = 'LEVEL_1_RESUSCITATION' | 'LEVEL_2_EMERGENT' | 'LEVEL_3_URGENT' | 'LEVEL_4_NON_URGENT';

export interface TriageCase {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  arrivalTime: string;
  acuity: AcuityLevel;
  chiefComplaint: string;
  spO2: number;
  bp: string;
  pulse: number;
  attendingDoctor: string;
  disposition: 'TRIAGED' | 'UNDER_OBSERVATION' | 'ADMIT_IPD' | 'TRANSFER_OPD' | 'DISCHARGED';
}

/* Dental Clinic Specifics */
export type ToothSurface = 'ALL' | 'O' | 'M' | 'D' | 'B' | 'L';

export type ToothFindingType = 
  | 'SOUND' 
  | 'CARIES' 
  | 'RESTORATION' 
  | 'CROWN' 
  | 'ROOT_CANAL' 
  | 'MISSING' 
  | 'IMPLANT' 
  | 'FRACTURE' 
  | 'PERIODONTAL';

export interface ToothRecord {
  toothNumber: number; // 1-32 Universal
  fdiNumber: number;   // 11-48 FDI
  name: string;
  findings: Array<{
    id: string;
    surface: ToothSurface;
    findingType: ToothFindingType;
    severity?: string;
    date: string;
    notes?: string;
  }>;
}

export type PlanAcceptanceStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED';

export interface TreatmentPlanItem {
  id: string;
  patientId: string;
  toothNumber: number;
  surface: ToothSurface;
  procedureCode: string;
  procedureName: string;
  estimatedCost: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  phase: 'PHASE_1' | 'PHASE_2' | 'PHASE_3';
  acceptanceStatus: PlanAcceptanceStatus;
  acceptanceDate?: string;
  billedInvoiceId?: string;
  notes?: string;
}

export interface OperatoryChair {
  id: string;
  name: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE';
  currentDoctor?: string;
  currentPatient?: string;
  currentProcedure?: string;
  startTime?: string;
}

export interface DentalLabCase {
  id: string;
  patientId: string;
  patientName: string;
  toothNumber: number;
  itemType: 'ZIRCONIA_CROWN' | 'E_MAX_VENEER' | 'IMPLANT_ABUTMENT' | 'NIGHT_GUARD' | 'ORTHO_ALIGNER';
  shade: string;
  labName: string;
  sentDate: string;
  dueDate: string;
  status: 'IN_LAB' | 'RECEIVED' | 'FITTED' | 'REMAKE';
  cost: number;
}

export interface DentalRecall {
  id: string;
  patientId: string;
  patientName: string;
  lastVisitDate: string;
  recallReason: '6_MONTH_PROPHYLAXIS' | 'PERIO_MAINTENANCE' | 'ORTHO_CHECKUP' | 'POST_OP_IMPLANT';
  dueDate: string;
  status: 'SCHEDULED' | 'OVERDUE' | 'COMPLETED';
}

/* Pharmacy & Inventory */
export interface MedicationItem {
  id: string;
  name: string;
  genericName: string;
  category: string;
  dosageForm: string;
  strength: string;
  stockQuantity: number;
  reorderLevel: number;
  unitPrice: number;
  batchNumber: string;
  expiryDate: string;
}

/* Laboratory & Diagnostics */
export interface LabOrder {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  orderDate: string;
  testName: string;
  specimen: string;
  resultValue?: string;
  unit?: string;
  referenceRange?: string;
  abnormalFlag?: boolean;
  status: 'ORDERED' | 'SAMPLE_COLLECTED' | 'PROCESSING' | 'COMPLETED';
}

/* Billing & Finance */
export interface InvoiceItem {
  id: string;
  description: string;
  category: 'CONSULTATION' | 'PROCEDURE' | 'DENTAL' | 'PHARMACY' | 'LAB' | 'ROOM_BED';
  quantity: number;
  unitPrice: number;
  total: number;
}

export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'UPI' | 'INSURANCE_TPA';
export type InvoiceStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'REFUNDED';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paidAmount: number;
  outstandingAmount: number;
  status: InvoiceStatus;
  paymentMethod: PaymentMethod;
  insuranceClaimNumber?: string;
}

/* Audit Trail */
export interface AuditEvent {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: 'CREATE' | 'UPDATE' | 'FINALIZE' | 'VOID' | 'VIEW' | 'DELETE';
  entityType: 'PATIENT' | 'APPOINTMENT' | 'ENCOUNTER' | 'PRESCRIPTION' | 'INVOICE' | 'TREATMENT_PLAN' | 'ADMISSION';
  entityId: string;
  details: string;
  facility: string;
}

/* Data Engineering & Governance */
export interface DataPipeline {
  id: string; // DE-01 to DE-12
  code: string;
  name: string;
  layer: 'RAW' | 'STAGING' | 'CORE_WAREHOUSE' | 'MARTS' | 'SEMANTIC';
  owner: string;
  refreshMode: 'CDC_STREAM' | 'HOURLY_BATCH' | 'DAILY_INCREMENTAL';
  status: 'HEALTHY' | 'SYNCING' | 'WARN_LAG';
  lastRun: string;
  latencySeconds: number;
  recordsLoaded: number;
  deadLetterCount: number;
  idempotent: boolean;
}

export interface KPIDefinition {
  id: string; // DA-01 to DA-12
  name: string;
  formula: string;
  grain: string;
  sourceTables: string;
  owner: string;
  cadence: string;
  todayValue: string | number;
  benchTarget: string;
  trendDirection: 'UP' | 'DOWN' | 'STABLE';
  status: 'HEALTHY' | 'NEEDS_ATTENTION' | 'CRITICAL';
}

export interface DataQualityCheck {
  id: string;
  ruleName: string;
  domain: 'PATIENT_UNIQUENESS' | 'TEMPORAL_VALIDITY' | 'REFERENTIAL_INTEGRITY' | 'FINANCIAL_RECONCILIATION';
  description: string;
  status: 'PASSED' | 'FAILED' | 'WARNING';
  testedCount: number;
  failedCount: number;
  lastChecked: string;
}
