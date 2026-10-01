import { 
  Patient, Inquiry, Appointment, Encounter, Bed, Admission, TriageCase, 
  ToothRecord, TreatmentPlanItem, OperatoryChair, DentalLabCase, DentalRecall,
  MedicationItem, LabOrder, Invoice, AuditEvent, DataPipeline, KPIDefinition, 
  DataQualityCheck, User
} from '../types';

export const CURRENT_FACILITY = {
  name: 'NEXORA Care Hospital & Dental Speciality Centre',
  code: 'NX-FAC-01',
  location: 'North Campus Medical District',
  phone: '+1 (800) 555-CARE',
  email: 'care@nexora.health',
  taxId: 'TX-NXRA-99042',
  currency: 'USD'
};

export const INITIAL_USERS: User[] = [
  { id: 'usr_admin', name: 'Dr. Arthur Sterling', role: 'HOSPITAL_ADMIN', department: 'Administration' },
  { id: 'usr_cardio', name: 'Dr. Elena Rostova, MD', role: 'DOCTOR', department: 'Cardiology' },
  { id: 'usr_dentist', name: 'Dr. Marcus Vance, DDS', role: 'DENTIST', department: 'Dental Surgery' },
  { id: 'usr_neuro', name: 'Dr. Priya Sharma, MS', role: 'DOCTOR', department: 'Neurosurgery' },
  { id: 'usr_front', name: 'Samantha Collins', role: 'FRONT_DESK', department: 'Patient Services' },
  { id: 'usr_nurse', name: 'David Kim, RN', role: 'NURSE', department: 'Inpatient / ICU' },
  { id: 'usr_pharm', name: 'Amina Al-Mansoor, PharmD', role: 'PHARMACIST', department: 'Central Pharmacy' },
  { id: 'usr_lab', name: 'Chen Wei, MLS', role: 'LAB_TECH', department: 'Diagnostic Pathology' },
  { id: 'usr_cashier', name: 'Michael Hernandez', role: 'BILLING_CASHIER', department: 'Finance & TPA' },
  { id: 'usr_patient', name: 'Julian Mercer (Patient View)', role: 'PATIENT' },
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat_001',
    mrn: 'NX-2026-0903-8821',
    name: 'Julian Mercer',
    dob: '1984-04-12',
    age: 42,
    gender: 'MALE',
    phone: '+1 555-234-5678',
    email: 'j.mercer@innovatemail.com',
    address: '742 Evergreen Terrace, Suite 4B',
    city: 'Metro City',
    bloodGroup: 'O+',
    allergies: ['Penicillin', 'Sulfa Drugs'],
    emergencyContact: {
      name: 'Claire Mercer',
      relationship: 'Spouse',
      phone: '+1 555-234-9988'
    },
    patientType: 'REPEAT',
    qrToken: 'nxp_tok_8821_jm84',
    consentSigned: true,
    createdAt: '2025-11-14T09:30:00Z'
  },
  {
    id: 'pat_002',
    mrn: 'NX-2026-0903-8822',
    name: 'Sophia Rodriguez',
    dob: '1992-09-28',
    age: 33,
    gender: 'FEMALE',
    phone: '+1 555-345-6789',
    email: 'sophia.rodriguez@creativestudio.io',
    address: '120 Ocean Drive, Apt 11',
    city: 'Metro City',
    bloodGroup: 'A+',
    allergies: ['Latex'],
    emergencyContact: {
      name: 'Carlos Rodriguez',
      relationship: 'Brother',
      phone: '+1 555-345-0012'
    },
    patientType: 'NEW',
    qrToken: 'nxp_tok_8822_sr92',
    consentSigned: true,
    createdAt: '2026-09-03T08:15:00Z'
  },
  {
    id: 'pat_003',
    mrn: 'NX-2026-0903-8823',
    name: 'Robert Hastings',
    dob: '1961-02-17',
    age: 65,
    gender: 'MALE',
    phone: '+1 555-456-7890',
    email: 'r.hastings@enterprise.net',
    address: '89 Maple Ridge Court',
    city: 'Highland Park',
    bloodGroup: 'B+',
    allergies: ['NSAIDs / Aspirin'],
    emergencyContact: {
      name: 'Martha Hastings',
      relationship: 'Wife',
      phone: '+1 555-456-1123'
    },
    patientType: 'IPD',
    qrToken: 'nxp_tok_8823_rh61',
    consentSigned: true,
    createdAt: '2026-09-01T14:20:00Z'
  },
  {
    id: 'pat_004',
    mrn: 'NX-2026-0903-8824',
    name: 'Ananya Deshmukh',
    dob: '1998-11-05',
    age: 27,
    gender: 'FEMALE',
    phone: '+1 555-567-8901',
    email: 'ananya.d@fintechglobal.com',
    address: '450 Tech Boulevard, Tower 2',
    city: 'Metro City',
    bloodGroup: 'AB+',
    allergies: [],
    emergencyContact: {
      name: 'Rohan Deshmukh',
      relationship: 'Father',
      phone: '+1 555-567-4433'
    },
    patientType: 'REPEAT',
    qrToken: 'nxp_tok_8824_ad98',
    consentSigned: true,
    createdAt: '2026-02-18T11:00:00Z'
  },
  {
    id: 'pat_005',
    mrn: 'NX-2026-0903-8825',
    name: 'Liam O\'Connor',
    dob: '2005-07-22',
    age: 21,
    gender: 'MALE',
    phone: '+1 555-678-9012',
    email: 'liam.oc@university.edu',
    address: '15 University Row, Dorm B',
    city: 'Metro City',
    bloodGroup: 'O-',
    allergies: ['Codeine'],
    emergencyContact: {
      name: 'Bridget O\'Connor',
      relationship: 'Mother',
      phone: '+1 555-678-7788'
    },
    patientType: 'EMERGENCY',
    qrToken: 'nxp_tok_8825_lo05',
    consentSigned: true,
    createdAt: '2026-09-03T10:45:00Z'
  },
  {
    id: 'pat_006',
    mrn: 'NX-2026-0903-8826',
    name: 'Tanya Chen',
    dob: '1975-08-30',
    age: 51,
    gender: 'FEMALE',
    phone: '+1 555-789-0123',
    email: 'tanya.chen@biomed.org',
    address: '320 Pine Valley Rd',
    city: 'Metro City',
    bloodGroup: 'A-',
    allergies: ['Iodinated Contrast'],
    emergencyContact: {
      name: 'Howard Chen',
      relationship: 'Spouse',
      phone: '+1 555-789-9900'
    },
    patientType: 'REPEAT',
    qrToken: 'nxp_tok_8826_tc75',
    consentSigned: true,
    createdAt: '2025-06-12T16:00:00Z'
  },
  {
    id: 'pat_007',
    mrn: 'NX-2026-0903-8827',
    name: 'Aiden Vance',
    dob: '2016-03-14',
    age: 10,
    gender: 'MALE',
    phone: '+1 555-890-1234',
    email: 'vance.family@webmail.com',
    address: '67 Oak Crest Way',
    city: 'Metro City',
    bloodGroup: 'O+',
    allergies: ['Peanuts'],
    emergencyContact: {
      name: 'Sarah Vance',
      relationship: 'Mother',
      phone: '+1 555-890-1234'
    },
    patientType: 'NEW',
    qrToken: 'nxp_tok_8827_av16',
    consentSigned: true,
    createdAt: '2026-09-03T09:00:00Z'
  },
  {
    id: 'pat_008',
    mrn: 'NX-2026-0903-8828',
    name: 'Beatrice Montgomery',
    dob: '1948-12-03',
    age: 77,
    gender: 'FEMALE',
    phone: '+1 555-901-2345',
    email: 'bmontgomery@heritage.org',
    address: '210 Sunset Ridge Retirement Estates',
    city: 'Metro City',
    bloodGroup: 'B-',
    allergies: ['Morphine'],
    emergencyContact: {
      name: 'George Montgomery',
      relationship: 'Son',
      phone: '+1 555-901-8899'
    },
    patientType: 'IPD',
    qrToken: 'nxp_tok_8828_bm48',
    consentSigned: true,
    createdAt: '2026-09-02T18:30:00Z'
  }
];

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq_101',
    name: 'Victoria Vance',
    phone: '+1 555-912-3401',
    email: 'v.vance@lifestyle.com',
    source: 'WEBSITE',
    department: 'Dental Surgery',
    preferredDoctor: 'Dr. Marcus Vance, DDS',
    preferredDate: '2026-09-03',
    notes: 'Inquiring about full-arch dental implant bridge & clear aligners pricing',
    status: 'BOOKED',
    followUpOwner: 'Samantha Collins',
    createdAt: '2026-09-03T07:45:00Z'
  },
  {
    id: 'inq_102',
    name: 'Harrison Wells',
    phone: '+1 555-912-3402',
    email: 'hwells@starlabs.tech',
    source: 'PHONE',
    department: 'Cardiology',
    preferredDoctor: 'Dr. Elena Rostova, MD',
    preferredDate: '2026-09-03',
    notes: 'Experiencing recurrent palpitations during aerobic workouts',
    status: 'CONTACTED',
    followUpOwner: 'Samantha Collins',
    createdAt: '2026-09-03T08:20:00Z'
  },
  {
    id: 'inq_103',
    name: 'Maya Lin',
    phone: '+1 555-912-3403',
    email: 'maya.lin@artforum.org',
    source: 'WALK_IN',
    department: 'Dental Surgery',
    preferredDoctor: 'Dr. Marcus Vance, DDS',
    preferredDate: '2026-09-03',
    notes: 'Severe pain on lower right molar #30, needs urgent evaluation',
    status: 'BOOKED',
    followUpOwner: 'Samantha Collins',
    createdAt: '2026-09-03T08:50:00Z'
  },
  {
    id: 'inq_104',
    name: 'Douglas MacIntyre',
    phone: '+1 555-912-3404',
    email: 'dmac@scotlogistics.co.uk',
    source: 'REFERRAL',
    department: 'Neurosurgery',
    preferredDoctor: 'Dr. Priya Sharma, MS',
    preferredDate: '2026-09-04',
    notes: 'Referral for cervical radiculopathy MRI review',
    status: 'NEW',
    followUpOwner: 'Samantha Collins',
    createdAt: '2026-09-03T09:15:00Z'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_201',
    patientId: 'pat_001',
    patientName: 'Julian Mercer',
    patientPhone: '+1 555-234-5678',
    patientMrn: 'NX-2026-0903-8821',
    departmentId: 'dept_cardio',
    departmentName: 'Cardiology',
    doctorId: 'usr_cardio',
    doctorName: 'Dr. Elena Rostova, MD',
    date: '2026-09-03',
    timeSlot: '09:00 - 09:30',
    tokenNumber: 101,
    appointmentType: 'OPD',
    status: 'COMPLETED',
    checkInTime: '08:50',
    consultStartTime: '09:05',
    consultEndTime: '09:32',
    reason: 'Routine quarterly hypertensive follow-up and ECG check',
    waitTimeMinutes: 15,
    isNewPatient: false
  },
  {
    id: 'apt_202',
    patientId: 'pat_002',
    patientName: 'Sophia Rodriguez',
    patientPhone: '+1 555-345-6789',
    patientMrn: 'NX-2026-0903-8822',
    departmentId: 'dept_dental',
    departmentName: 'Dental Surgery',
    doctorId: 'usr_dentist',
    doctorName: 'Dr. Marcus Vance, DDS',
    date: '2026-09-03',
    timeSlot: '09:30 - 10:15',
    tokenNumber: 102,
    appointmentType: 'DENTAL',
    status: 'IN_CONSULTATION',
    checkInTime: '09:20',
    consultStartTime: '09:35',
    reason: 'Localized severe tooth sensitivity in upper right quadrant (#14)',
    waitTimeMinutes: 15,
    isNewPatient: true
  },
  {
    id: 'apt_203',
    patientId: 'pat_004',
    patientName: 'Ananya Deshmukh',
    patientPhone: '+1 555-567-8901',
    patientMrn: 'NX-2026-0903-8824',
    departmentId: 'dept_neuro',
    departmentName: 'Neurosurgery',
    doctorId: 'usr_neuro',
    doctorName: 'Dr. Priya Sharma, MS',
    date: '2026-09-03',
    timeSlot: '10:00 - 10:30',
    tokenNumber: 103,
    appointmentType: 'OPD',
    status: 'ARRIVED',
    checkInTime: '09:40',
    reason: 'Severe chronic migraine with photophobia and aura',
    waitTimeMinutes: 42, // Alert >30m wait
    isNewPatient: false
  },
  {
    id: 'apt_204',
    patientId: 'pat_006',
    patientName: 'Tanya Chen',
    patientPhone: '+1 555-789-0123',
    patientMrn: 'NX-2026-0903-8826',
    departmentId: 'dept_cardio',
    departmentName: 'Cardiology',
    doctorId: 'usr_cardio',
    doctorName: 'Dr. Elena Rostova, MD',
    date: '2026-09-03',
    timeSlot: '10:30 - 11:00',
    tokenNumber: 104,
    appointmentType: 'OPD',
    status: 'ARRIVED',
    checkInTime: '10:18',
    reason: 'Dyspnea on moderate exertion, bilateral ankle edema',
    waitTimeMinutes: 14,
    isNewPatient: false
  },
  {
    id: 'apt_205',
    patientId: 'pat_007',
    patientName: 'Aiden Vance',
    patientPhone: '+1 555-890-1234',
    patientMrn: 'NX-2026-0903-8827',
    departmentId: 'dept_dental',
    departmentName: 'Dental Surgery',
    doctorId: 'usr_dentist',
    doctorName: 'Dr. Marcus Vance, DDS',
    date: '2026-09-03',
    timeSlot: '11:00 - 11:30',
    tokenNumber: 105,
    appointmentType: 'DENTAL',
    status: 'CONFIRMED',
    reason: 'Pediatric dental prophylaxis, sealant evaluation and bitewings',
    waitTimeMinutes: 0,
    isNewPatient: true
  },
  {
    id: 'apt_206',
    patientId: 'pat_005',
    patientName: 'Liam O\'Connor',
    patientPhone: '+1 555-678-9012',
    patientMrn: 'NX-2026-0903-8825',
    departmentId: 'dept_emergency',
    departmentName: 'Emergency Trauma',
    doctorId: 'usr_neuro',
    doctorName: 'Dr. Priya Sharma, MS',
    date: '2026-09-03',
    timeSlot: '11:15 - 11:45',
    tokenNumber: 106,
    appointmentType: 'EMERGENCY',
    status: 'IN_CONSULTATION',
    checkInTime: '10:50',
    consultStartTime: '11:00',
    reason: 'Blunt head trauma following cycling collision; brief loss of consciousness',
    waitTimeMinutes: 10,
    isNewPatient: true
  },
  {
    id: 'apt_207',
    patientId: 'pat_001',
    patientName: 'Julian Mercer',
    patientPhone: '+1 555-234-5678',
    patientMrn: 'NX-2026-0903-8821',
    departmentId: 'dept_dental',
    departmentName: 'Dental Surgery',
    doctorId: 'usr_dentist',
    doctorName: 'Dr. Marcus Vance, DDS',
    date: '2026-09-03',
    timeSlot: '14:00 - 15:00',
    tokenNumber: 107,
    appointmentType: 'DENTAL',
    status: 'BOOKED',
    reason: 'Crown preparation and digital scan for tooth #30',
    waitTimeMinutes: 0,
    isNewPatient: false
  },
  {
    id: 'apt_208',
    patientId: 'pat_002',
    patientName: 'Sophia Rodriguez',
    patientPhone: '+1 555-345-6789',
    patientMrn: 'NX-2026-0903-8822',
    departmentId: 'dept_cardio',
    departmentName: 'Cardiology',
    doctorId: 'usr_cardio',
    doctorName: 'Dr. Elena Rostova, MD',
    date: '2026-09-03',
    timeSlot: '15:30 - 16:00',
    tokenNumber: 108,
    appointmentType: 'OPD',
    status: 'CANCELLED',
    reason: 'Pre-operative cardiac clearance for elective rhinoplasty',
    waitTimeMinutes: 0,
    isNewPatient: false
  },
  {
    id: 'apt_209',
    patientId: 'pat_004',
    patientName: 'Ananya Deshmukh',
    patientPhone: '+1 555-567-8901',
    patientMrn: 'NX-2026-0903-8824',
    departmentId: 'dept_dental',
    departmentName: 'Dental Surgery',
    doctorId: 'usr_dentist',
    doctorName: 'Dr. Marcus Vance, DDS',
    date: '2026-09-03',
    timeSlot: '16:30 - 17:00',
    tokenNumber: 109,
    appointmentType: 'DENTAL',
    status: 'NO_SHOW',
    reason: 'Orthodontic aligner checkup - Stage 14',
    waitTimeMinutes: 0,
    isNewPatient: false
  }
];

export const INITIAL_ENCOUNTERS: Encounter[] = [
  {
    id: 'enc_301',
    appointmentId: 'apt_201',
    patientId: 'pat_001',
    doctorId: 'usr_cardio',
    doctorName: 'Dr. Elena Rostova, MD',
    date: '2026-09-03',
    chiefComplaint: 'Quarterly review for Stage 2 Essential Hypertension and mild dizziness upon standing.',
    history: 'Patient diagnosed with hypertension 4 years ago. Currently on Telmisartan 40mg. Denies chest pain or shortness of breath.',
    vitals: {
      bpSystolic: 138,
      bpDiastolic: 86,
      heartRate: 72,
      respiratoryRate: 16,
      tempCelsius: 36.8,
      spO2: 99,
      heightCm: 178,
      weightKg: 82,
      bmi: 25.9,
      recordedAt: '2026-09-03T08:55:00Z'
    },
    diagnoses: [
      { code: 'I10', description: 'Essential (primary) hypertension, moderately controlled', type: 'PRIMARY' },
      { code: 'E78.5', description: 'Hyperlipidemia, unspecified', type: 'SECONDARY' }
    ],
    prescriptions: [
      {
        id: 'rx_line_1',
        medicationName: 'Telmisartan 40mg Tab',
        genericName: 'Telmisartan',
        dosage: '40 mg',
        route: 'Oral',
        frequency: 'Once daily (OD)',
        duration: '90 days',
        instructions: 'Take in the morning with or without food',
        substitutionAllowed: true
      },
      {
        id: 'rx_line_2',
        medicationName: 'Atorvastatin 20mg Tab',
        genericName: 'Atorvastatin Calcium',
        dosage: '20 mg',
        route: 'Oral',
        frequency: 'Once daily at bedtime (QHS)',
        duration: '90 days',
        instructions: 'Take at night before sleeping',
        substitutionAllowed: false
      }
    ],
    advice: 'Low-sodium DASH diet recommended. Maintain 30 min daily brisk walking. Home BP log twice weekly.',
    followUpDate: '2026-12-03',
    isSigned: true,
    signedAt: '2026-09-03T09:30:00Z',
    signedBy: 'Dr. Elena Rostova, MD [Electronic Signature Verified]'
  }
];

export const INITIAL_BEDS: Bed[] = [
  { id: 'bed_icu_01', number: 'ICU-Bed-01', ward: 'ICU', status: 'OCCUPIED', currentPatientId: 'pat_003', currentPatientName: 'Robert Hastings', currentPatientMrn: 'NX-2026-0903-8823', currentAdmissionId: 'adm_401', admittedAt: '2026-09-01T14:30:00Z' },
  { id: 'bed_icu_02', number: 'ICU-Bed-02', ward: 'ICU', status: 'OCCUPIED', currentPatientId: 'pat_008', currentPatientName: 'Beatrice Montgomery', currentPatientMrn: 'NX-2026-0903-8828', currentAdmissionId: 'adm_402', admittedAt: '2026-09-02T19:00:00Z' },
  { id: 'bed_icu_03', number: 'ICU-Bed-03', ward: 'ICU', status: 'AVAILABLE' },
  { id: 'bed_gen_m01', number: 'W-GM-101', ward: 'GENERAL_MALE', status: 'AVAILABLE' },
  { id: 'bed_gen_m02', number: 'W-GM-102', ward: 'GENERAL_MALE', status: 'CLEANING' },
  { id: 'bed_gen_m03', number: 'W-GM-103', ward: 'GENERAL_MALE', status: 'RESERVED' },
  { id: 'bed_gen_f01', number: 'W-GF-201', ward: 'GENERAL_FEMALE', status: 'AVAILABLE' },
  { id: 'bed_gen_f02', number: 'W-GF-202', ward: 'GENERAL_FEMALE', status: 'AVAILABLE' },
  { id: 'bed_deluxe_01', number: 'SUITE-301', ward: 'DELUXE', status: 'AVAILABLE' },
  { id: 'bed_deluxe_02', number: 'SUITE-302', ward: 'DELUXE', status: 'MAINTENANCE' },
  { id: 'bed_trauma_01', number: 'ER-BAY-01', ward: 'EMERGENCY_TRAUMA', status: 'OCCUPIED', currentPatientId: 'pat_005', currentPatientName: 'Liam O\'Connor', currentPatientMrn: 'NX-2026-0903-8825', admittedAt: '2026-09-03T10:50:00Z' },
  { id: 'bed_trauma_02', number: 'ER-BAY-02', ward: 'EMERGENCY_TRAUMA', status: 'AVAILABLE' }
];

export const INITIAL_ADMISSIONS: Admission[] = [
  {
    id: 'adm_401',
    patientId: 'pat_003',
    patientName: 'Robert Hastings',
    patientMrn: 'NX-2026-0903-8823',
    bedId: 'bed_icu_01',
    bedNumber: 'ICU-Bed-01',
    ward: 'ICU',
    admittingDoctor: 'Dr. Elena Rostova, MD',
    admissionDate: '2026-09-01T14:30:00Z',
    status: 'ADMITTED',
    initialDiagnosis: 'Acute Non-ST-Elevation Myocardial Infarction (NSTEMI) post-coronary stenting',
    dailyNotes: [
      'Day 1: Post-PCI stable. Dual antiplatelet therapy initiated. Hemodynamically stable.',
      'Day 2: Cardiac telemetry shows sinus rhythm without ectopy. Troponin trending downwards.',
      'Day 3 (Today): Tolerating oral intake. Planned step-down transfer to Telemetry Ward tomorrow morning.'
    ]
  },
  {
    id: 'adm_402',
    patientId: 'pat_008',
    patientName: 'Beatrice Montgomery',
    patientMrn: 'NX-2026-0903-8828',
    bedId: 'bed_icu_02',
    bedNumber: 'ICU-Bed-02',
    ward: 'ICU',
    admittingDoctor: 'Dr. Priya Sharma, MS',
    admissionDate: '2026-09-02T19:00:00Z',
    status: 'ADMITTED',
    initialDiagnosis: 'Subacute Subdural Hematoma with progressive hemiparesis',
    dailyNotes: [
      'Day 1: Bur-hole evacuation completed uneventfully. Neurological checks every 2 hours intact.',
      'Day 2 (Today): Glasgow Coma Scale 15/15. Motor strength 5/5 in upper extremities.'
    ]
  }
];

export const INITIAL_TRIAGE_CASES: TriageCase[] = [
  {
    id: 'trg_501',
    patientId: 'pat_005',
    patientName: 'Liam O\'Connor',
    patientAge: 21,
    patientGender: 'MALE',
    arrivalTime: '2026-09-03 10:45',
    acuity: 'LEVEL_2_EMERGENT',
    chiefComplaint: 'Bicycle collision with car. Brief loss of consciousness (~2 min), scalp laceration and severe dizziness.',
    spO2: 97,
    bp: '132/84',
    pulse: 98,
    attendingDoctor: 'Dr. Priya Sharma, MS',
    disposition: 'UNDER_OBSERVATION'
  },
  {
    id: 'trg_502',
    patientId: 'pat_003',
    patientName: 'Robert Hastings',
    patientAge: 65,
    patientGender: 'MALE',
    arrivalTime: '2026-09-01 14:15',
    acuity: 'LEVEL_1_RESUSCITATION',
    chiefComplaint: 'Crushing substernal chest pressure radiating to jaw, diaphoresis',
    spO2: 94,
    bp: '88/56',
    pulse: 110,
    attendingDoctor: 'Dr. Elena Rostova, MD',
    disposition: 'ADMIT_IPD'
  }
];

export const INITIAL_TEETH_RECORDS: ToothRecord[] = Array.from({ length: 32 }, (_, i) => {
  const toothNum = i + 1;
  // Calculate FDI notation from Universal 1-32
  let fdi = 11;
  if (toothNum >= 1 && toothNum <= 8) fdi = 19 - toothNum; // Upper Right (18 to 11)
  else if (toothNum >= 9 && toothNum <= 16) fdi = 12 + toothNum; // Upper Left (21 to 28)
  else if (toothNum >= 17 && toothNum <= 24) fdi = 55 - toothNum; // Lower Left (38 to 31)
  else if (toothNum >= 25 && toothNum <= 32) fdi = 16 + toothNum; // Lower Right (41 to 48)

  const toothNames: { [key: number]: string } = {
    1: 'Upper Right 3rd Molar (Wisdom)',
    2: 'Upper Right 2nd Molar',
    3: 'Upper Right 1st Molar',
    4: 'Upper Right 2nd Premolar',
    5: 'Upper Right 1st Premolar',
    6: 'Upper Right Canine (Cuspid)',
    7: 'Upper Right Lateral Incisor',
    8: 'Upper Right Central Incisor',
    9: 'Upper Left Central Incisor',
    10: 'Upper Left Lateral Incisor',
    11: 'Upper Left Canine',
    12: 'Upper Left 1st Premolar',
    13: 'Upper Left 2nd Premolar',
    14: 'Upper Left 1st Molar',
    15: 'Upper Left 2nd Molar',
    16: 'Upper Left 3rd Molar',
    17: 'Lower Left 3rd Molar',
    18: 'Lower Left 2nd Molar',
    19: 'Lower Left 1st Molar',
    20: 'Lower Left 2nd Premolar',
    21: 'Lower Left 1st Premolar',
    22: 'Lower Left Canine',
    23: 'Lower Left Lateral Incisor',
    24: 'Lower Left Central Incisor',
    25: 'Lower Right Central Incisor',
    26: 'Lower Right Lateral Incisor',
    27: 'Lower Right Canine',
    28: 'Lower Right 1st Premolar',
    29: 'Lower Right 2nd Premolar',
    30: 'Lower Right 1st Molar',
    31: 'Lower Right 2nd Molar',
    32: 'Lower Right 3rd Molar',
  };

  // Seed sample clinical findings on specific teeth
  const findings: ToothRecord['findings'] = [];
  if (toothNum === 14) {
    findings.push({
      id: 'tf_14',
      surface: 'O',
      findingType: 'CARIES',
      severity: 'Moderate Dentine Cavitation',
      date: '2026-09-03',
      notes: 'Active lesion on occlusal pit, cold sensitive'
    });
  } else if (toothNum === 19) {
    findings.push({
      id: 'tf_19',
      surface: 'O',
      findingType: 'RESTORATION',
      severity: 'Composite Resin',
      date: '2024-05-10',
      notes: 'Existing sound class I restoration'
    });
  } else if (toothNum === 30) {
    findings.push({
      id: 'tf_30_1',
      surface: 'ALL',
      findingType: 'ROOT_CANAL',
      date: '2026-08-20',
      notes: 'Completed endodontic therapy, ready for full porcelain crown'
    });
    findings.push({
      id: 'tf_30_2',
      surface: 'ALL',
      findingType: 'CROWN',
      date: '2026-09-03',
      notes: 'Zirconia crown prep in progress'
    });
  } else if (toothNum === 3) {
    findings.push({
      id: 'tf_3',
      surface: 'ALL',
      findingType: 'MISSING',
      date: '2023-01-15',
      notes: 'Extracted previously; planned bone graft & implant'
    });
  }

  return {
    toothNumber: toothNum,
    fdiNumber: fdi,
    name: toothNames[toothNum] || `Tooth #${toothNum}`,
    findings
  };
});

export const INITIAL_TREATMENT_PLANS: TreatmentPlanItem[] = [
  {
    id: 'tp_01',
    patientId: 'pat_002',
    toothNumber: 14,
    surface: 'O',
    procedureCode: 'D2391',
    procedureName: 'Resin-based Composite Restoration - 1 Surface, Posterior',
    estimatedCost: 185.00,
    priority: 'HIGH',
    phase: 'PHASE_1',
    acceptanceStatus: 'ACCEPTED',
    acceptanceDate: '2026-09-03',
    notes: 'Approved by patient Sophia Rodriguez during today consultation'
  },
  {
    id: 'tp_02',
    patientId: 'pat_001',
    toothNumber: 30,
    surface: 'ALL',
    procedureCode: 'D2740',
    procedureName: 'Crown - Porcelain / Ceramic Substrate (Monolithic Zirconia)',
    estimatedCost: 950.00,
    priority: 'HIGH',
    phase: 'PHASE_1',
    acceptanceStatus: 'ACCEPTED',
    acceptanceDate: '2026-09-01',
    notes: 'Fabricated at OrthoCraft Labs, shade A2'
  },
  {
    id: 'tp_03',
    patientId: 'pat_001',
    toothNumber: 3,
    surface: 'ALL',
    procedureCode: 'D6010',
    procedureName: 'Surgical Placement of Implant Body - Endosteal',
    estimatedCost: 1850.00,
    priority: 'MEDIUM',
    phase: 'PHASE_2',
    acceptanceStatus: 'PENDING',
    notes: 'Awaiting CT bone density review'
  },
  {
    id: 'tp_04',
    patientId: 'pat_002',
    toothNumber: 0, // General Prophylaxis
    surface: 'ALL',
    procedureCode: 'D1110',
    procedureName: 'Prophylaxis - Adult Dental Cleaning & Ultrasonic Debridement',
    estimatedCost: 110.00,
    priority: 'LOW',
    phase: 'PHASE_1',
    acceptanceStatus: 'ACCEPTED',
    acceptanceDate: '2026-09-03'
  }
];

export const INITIAL_OPERATORY_CHAIRS: OperatoryChair[] = [
  {
    id: 'chair_01',
    name: 'Operatory 1 - Restorative Suite',
    status: 'OCCUPIED',
    currentDoctor: 'Dr. Marcus Vance, DDS',
    currentPatient: 'Sophia Rodriguez (#NX-8822)',
    currentProcedure: 'Tooth #14 Composite Filling (D2391)',
    startTime: '09:35 AM'
  },
  {
    id: 'chair_02',
    name: 'Operatory 2 - Hygiene & Recall',
    status: 'AVAILABLE'
  },
  {
    id: 'chair_03',
    name: 'Operatory 3 - Surgical & Implant Suite',
    status: 'CLEANING',
    startTime: '10:15 AM'
  },
  {
    id: 'chair_04',
    name: 'Operatory 4 - Orthodontics Bay',
    status: 'AVAILABLE'
  }
];

export const INITIAL_LAB_CASES: DentalLabCase[] = [
  {
    id: 'dlc_801',
    patientId: 'pat_001',
    patientName: 'Julian Mercer',
    toothNumber: 30,
    itemType: 'ZIRCONIA_CROWN',
    shade: 'A2 (VITA Classical)',
    labName: 'Apex Dental Ceramics Lab',
    sentDate: '2026-08-25',
    dueDate: '2026-09-03',
    status: 'RECEIVED',
    cost: 165.00
  },
  {
    id: 'dlc_802',
    patientId: 'pat_004',
    patientName: 'Ananya Deshmukh',
    toothNumber: 0,
    itemType: 'ORTHO_ALIGNER',
    shade: 'Clear Transparent',
    labName: 'AlignTech Precision Ortho',
    sentDate: '2026-08-28',
    dueDate: '2026-09-07',
    status: 'IN_LAB',
    cost: 450.00
  }
];

export const INITIAL_RECALLS: DentalRecall[] = [
  {
    id: 'rec_901',
    patientId: 'pat_006',
    patientName: 'Tanya Chen',
    lastVisitDate: '2026-03-01',
    recallReason: '6_MONTH_PROPHYLAXIS',
    dueDate: '2026-09-01',
    status: 'OVERDUE'
  },
  {
    id: 'rec_902',
    patientId: 'pat_004',
    patientName: 'Ananya Deshmukh',
    lastVisitDate: '2026-07-15',
    recallReason: 'ORTHO_CHECKUP',
    dueDate: '2026-09-15',
    status: 'SCHEDULED'
  }
];

export const INITIAL_MEDICATIONS: MedicationItem[] = [
  { id: 'med_01', name: 'Telmisartan 40mg Tab', genericName: 'Telmisartan', category: 'Cardiovascular / ARB', dosageForm: 'Tablet', strength: '40 mg', stockQuantity: 340, reorderLevel: 50, unitPrice: 0.85, batchNumber: 'TEL-2026-B9', expiryDate: '2027-11-30' },
  { id: 'med_02', name: 'Atorvastatin 20mg Tab', genericName: 'Atorvastatin', category: 'Lipid-Lowering / Statin', dosageForm: 'Tablet', strength: '20 mg', stockQuantity: 280, reorderLevel: 60, unitPrice: 1.10, batchNumber: 'ATV-2026-K4', expiryDate: '2028-02-15' },
  { id: 'med_03', name: 'Amoxicillin + Clavulanic Acid 625mg', genericName: 'Co-Amoxiclav', category: 'Antibacterial', dosageForm: 'Tablet', strength: '500/125 mg', stockQuantity: 45, reorderLevel: 50, unitPrice: 2.20, batchNumber: 'AMX-2025-X2', expiryDate: '2026-10-31' }, // Low stock warning
  { id: 'med_04', name: 'Ibuprofen 400mg Tab', genericName: 'Ibuprofen', category: 'NSAID / Analgesic', dosageForm: 'Tablet', strength: '400 mg', stockQuantity: 520, reorderLevel: 100, unitPrice: 0.35, batchNumber: 'IBU-2026-C1', expiryDate: '2027-08-31' },
  { id: 'med_05', name: 'Lidocaine 2% with Epinephrine 1:100,000', genericName: 'Lidocaine HCl + Adrenaline', category: 'Local Anesthetic (Dental)', dosageForm: 'Dental Cartridge 1.8ml', strength: '2%', stockQuantity: 18, reorderLevel: 40, unitPrice: 3.50, batchNumber: 'LID-2026-Q9', expiryDate: '2027-04-30' }, // Low stock alert!
  { id: 'med_06', name: 'Metformin 500mg ER Tab', genericName: 'Metformin Hydrochloride', category: 'Antidiabetic / Biguanide', dosageForm: 'Extended Release Tab', strength: '500 mg', stockQuantity: 410, reorderLevel: 75, unitPrice: 0.40, batchNumber: 'MET-2026-A3', expiryDate: '2028-01-20' },
  { id: 'med_07', name: 'Ceftriaxone 1g Injection Vial', genericName: 'Ceftriaxone Sodium', category: 'Cephalosporin Antibiotic', dosageForm: 'IV/IM Vial', strength: '1 g', stockQuantity: 95, reorderLevel: 30, unitPrice: 8.50, batchNumber: 'CFT-2026-V8', expiryDate: '2027-09-15' },
  { id: 'med_08', name: 'Pantoprazole 40mg Tab', genericName: 'Pantoprazole Sodium', category: 'Proton Pump Inhibitor', dosageForm: 'Enteric Coated Tab', strength: '40 mg', stockQuantity: 360, reorderLevel: 80, unitPrice: 0.65, batchNumber: 'PAN-2026-F5', expiryDate: '2027-12-31' }
];

export const INITIAL_LAB_ORDERS: LabOrder[] = [
  {
    id: 'lab_601',
    patientId: 'pat_001',
    patientName: 'Julian Mercer',
    doctorName: 'Dr. Elena Rostova, MD',
    orderDate: '2026-09-03 09:15',
    testName: 'Complete Blood Count (CBC) with Automated Differential',
    specimen: 'Whole Blood EDTA',
    resultValue: 'Hemoglobin: 14.8 g/dL, WBC: 6.8 K/uL, Platelets: 245 K/uL',
    unit: 'Standard',
    referenceRange: 'Hb 13.5-17.5 g/dL',
    abnormalFlag: false,
    status: 'COMPLETED'
  },
  {
    id: 'lab_602',
    patientId: 'pat_001',
    patientName: 'Julian Mercer',
    doctorName: 'Dr. Elena Rostova, MD',
    orderDate: '2026-09-03 09:15',
    testName: 'Lipid Panel with Non-HDL Ratio',
    specimen: 'Serum Gold SST',
    resultValue: 'Total Chol: 218 mg/dL, LDL: 138 mg/dL, HDL: 44 mg/dL, Trig: 180 mg/dL',
    unit: 'mg/dL',
    referenceRange: 'LDL < 100 mg/dL',
    abnormalFlag: true, // Abnormal flag!
    status: 'COMPLETED'
  },
  {
    id: 'lab_603',
    patientId: 'pat_005',
    patientName: 'Liam O\'Connor',
    doctorName: 'Dr. Priya Sharma, MS',
    orderDate: '2026-09-03 10:55',
    testName: 'Non-Contrast Cranial Computed Tomography (CT Head)',
    specimen: 'Radiology / CT Modality',
    resultValue: 'No intracranial hemorrhage, midline shift, or acute calvarial fracture identified. Minimal subgaleal soft tissue swelling left parietal.',
    referenceRange: 'Normal Scan',
    abnormalFlag: false,
    status: 'COMPLETED'
  },
  {
    id: 'lab_604',
    patientId: 'pat_003',
    patientName: 'Robert Hastings',
    doctorName: 'Dr. Elena Rostova, MD',
    orderDate: '2026-09-03 06:00',
    testName: 'High-Sensitivity Cardiac Troponin-I (hs-cTnI)',
    specimen: 'Plasma Lithium Heparin',
    resultValue: '84.2 ng/L (Trending down from 420 ng/L)',
    unit: 'ng/L',
    referenceRange: '< 14 ng/L',
    abnormalFlag: true,
    status: 'COMPLETED'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv_701',
    invoiceNumber: 'INV-2026-0903-01',
    patientId: 'pat_001',
    patientName: 'Julian Mercer',
    patientMrn: 'NX-2026-0903-8821',
    date: '2026-09-03',
    items: [
      { id: 'ii_1', description: 'Consultation Fee - Cardiology (Dr. Elena Rostova)', category: 'CONSULTATION', quantity: 1, unitPrice: 120.00, total: 120.00 },
      { id: 'ii_2', description: 'Resting 12-Lead Electrocardiogram (ECG)', category: 'PROCEDURE', quantity: 1, unitPrice: 65.00, total: 65.00 },
      { id: 'ii_3', description: 'Lipid Panel + Automated CBC', category: 'LAB', quantity: 1, unitPrice: 85.00, total: 85.00 },
      { id: 'ii_4', description: 'Pharmacy: Telmisartan 40mg (90 Tabs) + Atorvastatin 20mg (90 Tabs)', category: 'PHARMACY', quantity: 1, unitPrice: 175.50, total: 175.50 }
    ],
    subtotal: 445.50,
    discount: 25.00,
    tax: 21.03,
    grandTotal: 441.53,
    paidAmount: 441.53,
    outstandingAmount: 0.00,
    status: 'PAID',
    paymentMethod: 'CREDIT_CARD'
  },
  {
    id: 'inv_702',
    invoiceNumber: 'INV-2026-0903-02',
    patientId: 'pat_002',
    patientName: 'Sophia Rodriguez',
    patientMrn: 'NX-2026-0903-8822',
    date: '2026-09-03',
    items: [
      { id: 'ii_5', description: 'Comprehensive Dental Exam & Bitewing Radiographs', category: 'DENTAL', quantity: 1, unitPrice: 95.00, total: 95.00 },
      { id: 'ii_6', description: 'Resin-based Composite - 1 Surface, Posterior (#14 Occlusal)', category: 'DENTAL', quantity: 1, unitPrice: 185.00, total: 185.00 },
      { id: 'ii_7', description: 'Adult Dental Prophylaxis & Polish', category: 'DENTAL', quantity: 1, unitPrice: 110.00, total: 110.00 }
    ],
    subtotal: 390.00,
    discount: 40.00,
    tax: 17.50,
    grandTotal: 367.50,
    paidAmount: 200.00,
    outstandingAmount: 167.50,
    status: 'PARTIALLY_PAID',
    paymentMethod: 'UPI'
  },
  {
    id: 'inv_703',
    invoiceNumber: 'INV-2026-0903-03',
    patientId: 'pat_005',
    patientName: 'Liam O\'Connor',
    patientMrn: 'NX-2026-0903-8825',
    date: '2026-09-03',
    items: [
      { id: 'ii_8', description: 'Emergency Department Trauma Bay Level 2 Assessment', category: 'PROCEDURE', quantity: 1, unitPrice: 350.00, total: 350.00 },
      { id: 'ii_9', description: 'Emergency Non-Contrast CT Scan Head', category: 'PROCEDURE', quantity: 1, unitPrice: 480.00, total: 480.00 },
      { id: 'ii_10', description: 'Simple Scalp Laceration Repair (Sutures)', category: 'PROCEDURE', quantity: 1, unitPrice: 160.00, total: 160.00 }
    ],
    subtotal: 990.00,
    discount: 0.00,
    tax: 0.00,
    grandTotal: 990.00,
    paidAmount: 0.00,
    outstandingAmount: 990.00,
    status: 'UNPAID',
    paymentMethod: 'INSURANCE_TPA',
    insuranceClaimNumber: 'CLM-BLUECROSS-2026-99120'
  }
];

export const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'aud_001',
    timestamp: '2026-09-03 08:15:22',
    actorName: 'Samantha Collins',
    actorRole: 'FRONT_DESK',
    action: 'CREATE',
    entityType: 'PATIENT',
    entityId: 'pat_002',
    details: 'Registered new patient Sophia Rodriguez. Generated QR token nxp_tok_8822_sr92. Zero duplicate matches found.',
    facility: 'NX-FAC-01'
  },
  {
    id: 'aud_002',
    timestamp: '2026-09-03 09:30:15',
    actorName: 'Dr. Elena Rostova, MD',
    actorRole: 'DOCTOR',
    action: 'FINALIZE',
    entityType: 'ENCOUNTER',
    entityId: 'enc_301',
    details: 'Encounter signed and locked with e-signature. Diagnoses ICD-10 I10 & E78.5 committed. E-prescription issued.',
    facility: 'NX-FAC-01'
  },
  {
    id: 'aud_003',
    timestamp: '2026-09-03 09:42:04',
    actorName: 'Michael Hernandez',
    actorRole: 'BILLING_CASHIER',
    action: 'CREATE',
    entityType: 'INVOICE',
    entityId: 'inv_701',
    details: 'Settled invoice INV-2026-0903-01 for Julian Mercer ($441.53) via Credit Card. Immutable receipt generated.',
    facility: 'NX-FAC-01'
  },
  {
    id: 'aud_004',
    timestamp: '2026-09-03 10:10:00',
    actorName: 'Dr. Marcus Vance, DDS',
    actorRole: 'DENTIST',
    action: 'UPDATE',
    entityType: 'TREATMENT_PLAN',
    entityId: 'tp_01',
    details: 'Accepted treatment plan for Tooth #14 composite restoration (D2391) approved by patient.',
    facility: 'NX-FAC-01'
  }
];

export const INITIAL_PIPELINES: DataPipeline[] = [
  { id: 'de_01', code: 'DE-01', name: 'Source Inventory & Event Contracts Engine', layer: 'RAW', owner: 'Core Platform DE Team', refreshMode: 'CDC_STREAM', status: 'HEALTHY', lastRun: '2026-09-03 11:20:00', latencySeconds: 1.2, recordsLoaded: 14200, deadLetterCount: 0, idempotent: true },
  { id: 'de_02', code: 'DE-02', name: 'Operational Healthcare Event CDC Consumer', layer: 'RAW', owner: 'Streaming Team', refreshMode: 'CDC_STREAM', status: 'HEALTHY', lastRun: '2026-09-03 11:20:04', latencySeconds: 0.8, recordsLoaded: 8640, deadLetterCount: 0, idempotent: true },
  { id: 'de_03', code: 'DE-03', name: 'Staging Deduplication & Schema Validator', layer: 'STAGING', owner: 'Analytics Eng', refreshMode: 'CDC_STREAM', status: 'HEALTHY', lastRun: '2026-09-03 11:19:50', latencySeconds: 2.4, recordsLoaded: 8640, deadLetterCount: 0, idempotent: true },
  { id: 'de_04', code: 'DE-04', name: 'Core Dimensional Lakehouse (Star Schema)', layer: 'CORE_WAREHOUSE', owner: 'Warehouse Architect', refreshMode: 'HOURLY_BATCH', status: 'HEALTHY', lastRun: '2026-09-03 11:00:00', latencySeconds: 18.0, recordsLoaded: 38400, deadLetterCount: 0, idempotent: true },
  { id: 'de_05', code: 'DE-05', name: 'dbt Transformation Engine (Marts & Models)', layer: 'MARTS', owner: 'Analytics Eng', refreshMode: 'HOURLY_BATCH', status: 'HEALTHY', lastRun: '2026-09-03 11:02:15', latencySeconds: 42.0, recordsLoaded: 12500, deadLetterCount: 0, idempotent: true },
  { id: 'de_06', code: 'DE-06', name: 'Automated Data Quality & Integrity Test Suite', layer: 'SEMANTIC', owner: 'Data Governance Lead', refreshMode: 'HOURLY_BATCH', status: 'HEALTHY', lastRun: '2026-09-03 11:05:00', latencySeconds: 12.0, recordsLoaded: 54, deadLetterCount: 0, idempotent: true },
  { id: 'de_07', code: 'DE-07', name: 'DAG Orchestrator & SLA Monitor', layer: 'CORE_WAREHOUSE', owner: 'SRE & DevOps', refreshMode: 'CDC_STREAM', status: 'HEALTHY', lastRun: '2026-09-03 11:20:00', latencySeconds: 0.5, recordsLoaded: 12, deadLetterCount: 0, idempotent: true },
  { id: 'de_08', code: 'DE-08', name: 'Data Security, Field Tokenization & RBAC Sync', layer: 'STAGING', owner: 'Infosec Officer', refreshMode: 'CDC_STREAM', status: 'HEALTHY', lastRun: '2026-09-03 11:18:00', latencySeconds: 1.5, recordsLoaded: 8640, deadLetterCount: 0, idempotent: true },
  { id: 'de_09', code: 'DE-09', name: 'Analytical Query Optimizer & Partition Cache', layer: 'CORE_WAREHOUSE', owner: 'DBA Lead', refreshMode: 'HOURLY_BATCH', status: 'HEALTHY', lastRun: '2026-09-03 11:00:00', latencySeconds: 8.0, recordsLoaded: 42000, deadLetterCount: 0, idempotent: true },
  { id: 'de_10', code: 'DE-10', name: 'Lineage Graph & OpenMetadata Observability', layer: 'SEMANTIC', owner: 'Data Governance', refreshMode: 'DAILY_INCREMENTAL', status: 'HEALTHY', lastRun: '2026-09-03 06:00:00', latencySeconds: 24.0, recordsLoaded: 148, deadLetterCount: 0, idempotent: true },
  { id: 'de_11', code: 'DE-11', name: 'External Integrations (HL7 / FHIR / TPA Gateway)', layer: 'STAGING', owner: 'Integration Lead', refreshMode: 'CDC_STREAM', status: 'HEALTHY', lastRun: '2026-09-03 11:15:30', latencySeconds: 3.2, recordsLoaded: 215, deadLetterCount: 0, idempotent: true },
  { id: 'de_12', code: 'DE-12', name: 'AI/ML Feature Store & De-Identification Engine', layer: 'SEMANTIC', owner: 'AI/ML Team', refreshMode: 'DAILY_INCREMENTAL', status: 'HEALTHY', lastRun: '2026-09-03 05:00:00', latencySeconds: 58.0, recordsLoaded: 9400, deadLetterCount: 0, idempotent: true }
];

export const INITIAL_KPIS: KPIDefinition[] = [
  { id: 'da_01', name: 'Appointment Volume', formula: 'COUNT(valid_appointments)', grain: 'Facility / Date / Dept', sourceTables: 'fact_appointments', owner: 'Head of Operations', cadence: 'Real-time', todayValue: 9, benchTarget: '8-15 / day', trendDirection: 'UP', status: 'HEALTHY' },
  { id: 'da_02', name: 'New Patient Ratio', formula: 'COUNT(new_patients) / COUNT(completed_encounters)', grain: 'Date / Clinic', sourceTables: 'fact_encounters, dim_patient', owner: 'Growth Director', cadence: 'Daily', todayValue: '44.4%', benchTarget: '> 35%', trendDirection: 'UP', status: 'HEALTHY' },
  { id: 'da_03', name: 'Repeat Patient Rate', formula: 'COUNT(repeat_patients) / COUNT(completed_encounters)', grain: 'Date / Clinic', sourceTables: 'fact_encounters, dim_patient', owner: 'Clinical Director', cadence: 'Daily', todayValue: '55.6%', benchTarget: '> 50%', trendDirection: 'STABLE', status: 'HEALTHY' },
  { id: 'da_04', name: 'No-Show Rate', formula: 'no_show_appointments / scheduled_appointments', grain: 'Date / Doctor', sourceTables: 'fact_appointments', owner: 'Patient Services Lead', cadence: 'Daily', todayValue: '11.1%', benchTarget: '< 10%', trendDirection: 'UP', status: 'NEEDS_ATTENTION' },
  { id: 'da_05', name: 'Cancellation Rate', formula: 'cancelled_appointments / scheduled_appointments', grain: 'Date / Doctor', sourceTables: 'fact_appointments', owner: 'Patient Services Lead', cadence: 'Daily', todayValue: '11.1%', benchTarget: '< 8%', trendDirection: 'STABLE', status: 'HEALTHY' },
  { id: 'da_06', name: 'Check-In Rate', formula: 'checked_in_appointments / scheduled_appointments', grain: 'Date / Slot', sourceTables: 'fact_appointments', owner: 'Front Desk Lead', cadence: 'Real-time', todayValue: '66.7%', benchTarget: '> 85%', trendDirection: 'STABLE', status: 'HEALTHY' },
  { id: 'da_07', name: 'Consultation Completion', formula: 'completed_encounters / checked_in_appointments', grain: 'Date / Provider', sourceTables: 'fact_encounters', owner: 'Medical Director', cadence: 'Daily', todayValue: '100%', benchTarget: '> 95%', trendDirection: 'STABLE', status: 'HEALTHY' },
  { id: 'da_08', name: 'Average Wait Time', formula: 'AVG(consult_start_time - patient_checkin_time)', grain: 'Date / Dept', sourceTables: 'fact_appointments', owner: 'Ops Manager', cadence: 'Real-time', todayValue: '19.2 min', benchTarget: '< 20 min', trendDirection: 'DOWN', status: 'HEALTHY' },
  { id: 'da_09', name: 'Doctor Utilization Rate', formula: 'active_consult_time / scheduled_care_time', grain: 'Provider / Date', sourceTables: 'fact_appointments, dim_provider', owner: 'Staffing Lead', cadence: 'Daily', todayValue: '78.5%', benchTarget: '75-85%', trendDirection: 'UP', status: 'HEALTHY' },
  { id: 'da_10', name: 'Revenue Per Encounter', formula: 'net_recognized_revenue / completed_encounters', grain: 'Date / Dept', sourceTables: 'fact_billing, fact_encounters', owner: 'Chief Financial Officer', cadence: 'Daily', todayValue: '$441.53', benchTarget: '> $350', trendDirection: 'UP', status: 'HEALTHY' },
  { id: 'da_11', name: 'Collection Rate', formula: 'collected_amount / billed_amount', grain: 'Date / Payer', sourceTables: 'fact_billing', owner: 'Revenue Cycle Manager', cadence: 'Daily', todayValue: '54.5%', benchTarget: '> 80%', trendDirection: 'DOWN', status: 'NEEDS_ATTENTION' }, // Due to pending insurance claim
  { id: 'da_12', name: 'Bed Occupancy (IPD)', formula: 'occupied_bed_hours / available_bed_hours', grain: 'Ward / Date', sourceTables: 'fact_admissions, dim_bed', owner: 'Nursing Superintendent', cadence: 'Real-time', todayValue: '66.7% (ICU)', benchTarget: '65-80%', trendDirection: 'STABLE', status: 'HEALTHY' },
  { id: 'da_13', name: 'Dental Treatment Acceptance', formula: 'accepted_plan_value / presented_plan_value', grain: 'Dentist / Month', sourceTables: 'fact_dental_plans', owner: 'Chief Dental Officer', cadence: 'Weekly', todayValue: '82.4%', benchTarget: '> 75%', trendDirection: 'UP', status: 'HEALTHY' },
  { id: 'da_14', name: 'Dental Chair Utilization', formula: 'occupied_operatory_hours / available_operatory_hours', grain: 'Chair / Date', sourceTables: 'fact_operatory_slots', owner: 'Dental Clinic Manager', cadence: 'Real-time', todayValue: '50.0%', benchTarget: '70%', trendDirection: 'UP', status: 'HEALTHY' }
];

export const INITIAL_DATA_QUALITY_CHECKS: DataQualityCheck[] = [
  { id: 'dq_01', ruleName: 'Patient Uniqueness & Deterministic Token Integrity', domain: 'PATIENT_UNIQUENESS', description: 'Zero duplicate MRNs, valid non-empty phone and encrypted QR token uniqueness check', status: 'PASSED', testedCount: 8, failedCount: 0, lastChecked: '2026-09-03 11:20:00' },
  { id: 'dq_02', ruleName: 'Temporal Sequence & Event Validity', domain: 'TEMPORAL_VALIDITY', description: 'Verify Check-in <= Consult Start <= Consult End <= Billing creation timestamps', status: 'PASSED', testedCount: 9, failedCount: 0, lastChecked: '2026-09-03 11:20:00' },
  { id: 'dq_03', ruleName: 'Referential Integrity: Provider, Patient, Facility', domain: 'REFERENTIAL_INTEGRITY', description: 'All encounters, dental plans, and admissions resolve to active registered entities', status: 'PASSED', testedCount: 24, failedCount: 0, lastChecked: '2026-09-03 11:20:00' },
  { id: 'dq_04', ruleName: 'Financial Ledger Zero-Balance Reconciliation', domain: 'FINANCIAL_RECONCILIATION', description: 'Verify Billed Amount = Paid Amount + Outstanding Amount + Discounts across all invoices', status: 'PASSED', testedCount: 3, failedCount: 0, lastChecked: '2026-09-03 11:20:00' }
];
