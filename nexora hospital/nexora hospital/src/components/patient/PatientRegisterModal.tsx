import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient, PatientType } from '../../types';
import { X, UserCheck, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

interface PatientRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PatientRegisterModal: React.FC<PatientRegisterModalProps> = ({ isOpen, onClose }) => {
  const { addPatient, checkDuplicatePatient, setActivePatient360Id, setQrModalPatient } = useApp();

  const [name, setName] = useState('');
  const [dob, setDob] = useState('1995-06-15');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('FEMALE');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Metro City');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergiesText, setAllergiesText] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRel, setEmergencyRel] = useState('Spouse');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [patientType, setPatientType] = useState<PatientType>('NEW');

  // Duplicate prompt state
  const [duplicateFound, setDuplicateFound] = useState<Patient | null>(null);

  if (!isOpen) return null;

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return Math.max(0, age);
  };

  const handleSubmit = async (e: React.FormEvent, forceOverride = false) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    // Check duplicate
    if (!forceOverride) {
      const match = await checkDuplicatePatient(name, phone, dob);
      if (match) {
        setDuplicateFound(match);
        return;
      }
    }

    const allergies = allergiesText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    try {
      const created = await addPatient({
        name: name.trim(),
        dob,
        age: calculateAge(dob),
        gender,
        phone: phone.trim(),
        altPhone: altPhone.trim() || undefined,
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        bloodGroup,
        allergies,
        emergencyContact: {
          name: emergencyName.trim() || 'Not specified',
          relationship: emergencyRel,
          phone: emergencyPhone.trim() || phone.trim()
        },
        patientType,
        consentSigned: true
      });

      setDuplicateFound(null);
      onClose();
      // Offer viewing the new patient's QR code immediately
      setQrModalPatient(created);
    } catch (err) {
      console.error("Failed to register patient", err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={20} color="#38bdf8" />
            <h3 className="title-md">Register New Patient</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <X size={18} />
          </button>
        </div>

        {duplicateFound ? (
          /* Duplicate Match Warning Prompt */
          <div className="modal-body" style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <AlertTriangle size={22} color="#fbbf24" />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fbbf24' }}>
                  Potential Duplicate Patient Detected
                </h4>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#f8fafc', lineHeight: 1.5 }}>
                A patient record with matching phone number or identity is already registered in NEXORA CareOS.
                To preserve canonical healthcare integrity, please verify if this is the same individual.
              </p>
            </div>

            <div className="grid-form-2" style={{ gap: '16px', marginBottom: '24px' }}>
              {/* Existing Record */}
              <div style={{
                background: 'var(--bg-card-hover)',
                border: '1px solid var(--border-medium)',
                borderRadius: '10px',
                padding: '14px'
              }}>
                <span className="badge badge-warning text-xs" style={{ marginBottom: '8px' }}>
                  EXISTING IN SYSTEM
                </span>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {duplicateFound.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#38bdf8', marginTop: '2px' }} className="font-mono">
                  MRN: {duplicateFound.mrn}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.6 }}>
                  <div><strong>DOB:</strong> {duplicateFound.dob} ({duplicateFound.age} yrs)</div>
                  <div><strong>Phone:</strong> {duplicateFound.phone}</div>
                  <div><strong>Address:</strong> {duplicateFound.address}, {duplicateFound.city}</div>
                  <div><strong>Blood Group:</strong> {duplicateFound.bloodGroup}</div>
                </div>
              </div>

              {/* New Record Attempt */}
              <div style={{
                background: 'var(--bg-input)',
                border: '1px dashed var(--border-medium)',
                borderRadius: '10px',
                padding: '14px'
              }}>
                <span className="badge badge-primary text-xs" style={{ marginBottom: '8px' }}>
                  NEW ENTRY ATTEMPT
                </span>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {name}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  System will generate new MRN
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.6 }}>
                  <div><strong>DOB:</strong> {dob} ({calculateAge(dob)} yrs)</div>
                  <div><strong>Phone:</strong> {phone}</div>
                  <div><strong>Address:</strong> {address}, {city}</div>
                  <div><strong>Blood Group:</strong> {bloodGroup}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setActivePatient360Id(duplicateFound.id);
                  onClose();
                }}
                className="btn btn-primary"
              >
                <ArrowRight size={16} />
                <span>Open Existing Patient 360</span>
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setDuplicateFound(null)}
                  className="btn btn-secondary"
                >
                  Edit Information
                </button>
                <button
                  type="button"
                  onClick={e => handleSubmit(e, true)}
                  className="btn btn-ghost text-muted"
                  style={{ fontSize: '0.78rem' }}
                >
                  Confirm Different Person (Force Create)
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Main Registration Form */
          <form onSubmit={e => handleSubmit(e, false)}>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Row 1 */}
              <div className="grid-form-3">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eleanor Rigby"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender *</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="select"
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Phone & Email */}
              <div className="grid-form-3">
                <div className="form-group">
                  <label className="form-label">Primary Phone (Mobile) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 555-000-0000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Alternate Phone</label>
                  <input
                    type="tel"
                    placeholder="Optional"
                    value={altPhone}
                    onChange={e => setAltPhone(e.target.value)}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              {/* Row 3: Address & City & Blood Group */}
              <div className="grid-form-3">
                <div className="form-group">
                  <label className="form-label">Residential Address</label>
                  <input
                    type="text"
                    placeholder="Street, Apartment or Suite"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={e => setBloodGroup(e.target.value)}
                    className="select font-mono"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Allergies & Patient Classification */}
              <div className="grid-form-2">
                <div className="form-group">
                  <label className="form-label">Known Allergies / Clinical Alerts</label>
                  <input
                    type="text"
                    placeholder="e.g. Penicillin, Latex, NSAIDs (comma separated)"
                    value={allergiesText}
                    onChange={e => setAllergiesText(e.target.value)}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Patient Classification</label>
                  <select
                    value={patientType}
                    onChange={e => setPatientType(e.target.value as any)}
                    className="select"
                  >
                    <option value="NEW">New Patient</option>
                    <option value="REPEAT">Returning / Repeat</option>
                    <option value="REFERRAL">Doctor Referral</option>
                    <option value="EMERGENCY">Emergency Fast-Track</option>
                    <option value="CORPORATE">Corporate / Insurance</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Emergency Contact */}
              <div style={{
                background: 'var(--bg-input)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid var(--border-subtle)'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Emergency Contact Details
                </span>
                <div className="grid-form-3" style={{ gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Contact Person Name"
                    value={emergencyName}
                    onChange={e => setEmergencyName(e.target.value)}
                    className="input text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Relationship (e.g. Spouse)"
                    value={emergencyRel}
                    onChange={e => setEmergencyRel(e.target.value)}
                    className="input text-sm"
                  />
                  <input
                    type="tel"
                    placeholder="Emergency Phone"
                    value={emergencyPhone}
                    onChange={e => setEmergencyPhone(e.target.value)}
                    className="input text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn btn-ghost">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <ShieldCheck size={16} />
                <span>Verify & Register Patient</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
