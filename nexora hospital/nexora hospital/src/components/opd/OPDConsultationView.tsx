import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment, Encounter, PrescriptionItem, DiagnosisEntry } from '../../types';
import { 
  Stethoscope, CheckCircle2, Plus, Trash2, Printer, 
  FileText, ShieldCheck, HeartPulse, Pill, AlertCircle, 
  Clock, ArrowRight, User
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const OPDConsultationView: React.FC = () => {
  const { 
    appointments, patients, selectedDate, encounters, 
    saveEncounter, currentUser, medications, setActivePatient360Id, showToast 
  } = useApp();

  // Pick first arrived/in_consultation or any appointment on selected date
  const dateAppointments = appointments.filter(a => a.date === selectedDate);
  const activeQueuedApt = dateAppointments.find(a => a.status === 'IN_CONSULTATION') || 
                          dateAppointments.find(a => a.status === 'ARRIVED') || 
                          dateAppointments[0];

  const [selectedAptId, setSelectedAptId] = useState<string>(activeQueuedApt?.id || '');

  const activeApt = appointments.find(a => a.id === selectedAptId);
  const activePatient = patients.find(p => p.id === activeApt?.patientId) || patients[0];

  // Clinical Form States
  const [chiefComplaint, setChiefComplaint] = useState(activeApt?.reason || 'Evaluation for recurring tension headache and fatigue');
  const [history, setHistory] = useState('Patient reports symptoms starting 2 weeks ago, aggravated by screen exposure. Denies nausea, vomiting, or focal weakness.');
  
  // Vitals
  const [bpSys, setBpSys] = useState(128);
  const [bpDia, setBpDia] = useState(82);
  const [pulse, setPulse] = useState(74);
  const [respRate, setRespRate] = useState(16);
  const [temp, setTemp] = useState(36.7);
  const [spO2, setSpO2] = useState(99);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(76);

  // Diagnoses list
  const [diagnoses, setDiagnoses] = useState<DiagnosisEntry[]>([
    { code: 'G43.909', description: 'Migraine, unspecified, not intractable, without status migrainosus', type: 'PRIMARY' }
  ]);
  const [newDiagCode, setNewDiagCode] = useState('R51.9');
  const [newDiagDesc, setNewDiagDesc] = useState('Headache, unspecified');

  // Prescriptions list
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      id: 'rx_draft_1',
      medicationName: 'Ibuprofen 400mg Tab',
      genericName: 'Ibuprofen',
      dosage: '400 mg',
      route: 'Oral',
      frequency: 'TDS (Three times daily after meals)',
      duration: '5 days',
      instructions: 'Take with full glass of water, do not take on empty stomach',
      substitutionAllowed: true
    },
    {
      id: 'rx_draft_2',
      medicationName: 'Pantoprazole 40mg Tab',
      genericName: 'Pantoprazole Sodium',
      dosage: '40 mg',
      route: 'Oral',
      frequency: 'OD (Once daily before breakfast)',
      duration: '14 days',
      instructions: 'Take 30 minutes prior to first meal',
      substitutionAllowed: true
    }
  ]);

  const [selectedMedId, setSelectedMedId] = useState(medications[0]?.id || '');
  const [advice, setAdvice] = useState('Ensure adequate hydration (2.5L daily). Follow 20-20-20 rule during screen usage. Return if focal signs develop.');
  const [followUpDate, setFollowUpDate] = useState('2026-09-17');
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Auto calculate BMI
  const heightM = height / 100;
  const bmi = heightM > 0 ? parseFloat((weight / (heightM * heightM)).toFixed(1)) : 22.0;

  const handleAddDiagnosis = () => {
    if (!newDiagCode.trim()) return;
    setDiagnoses(prev => [...prev, { code: newDiagCode, description: newDiagDesc, type: 'SECONDARY' }]);
    setNewDiagCode('');
    setNewDiagDesc('');
  };

  const handleAddMedication = () => {
    const med = medications.find(m => m.id === selectedMedId);
    if (!med) return;

    setPrescriptions(prev => [
      ...prev,
      {
        id: `rx_${Date.now()}`,
        medicationName: med.name,
        genericName: med.genericName,
        dosage: med.strength,
        route: 'Oral',
        frequency: 'OD (Once daily)',
        duration: '30 days',
        instructions: 'Take as directed by doctor',
        substitutionAllowed: true
      }
    ]);
  };

  const handleRemoveMed = (id: string) => {
    setPrescriptions(prev => prev.filter(p => p.id !== id));
  };

  const handleSignEncounter = () => {
    if (!activeApt) return;

    const newEncounter: Encounter = {
      id: `enc_${Date.now()}`,
      appointmentId: activeApt.id,
      patientId: activePatient.id,
      doctorId: currentUser.id,
      doctorName: currentUser.name,
      date: selectedDate,
      chiefComplaint,
      history,
      vitals: {
        bpSystolic: bpSys,
        bpDiastolic: bpDia,
        heartRate: pulse,
        respiratoryRate: respRate,
        tempCelsius: temp,
        spO2,
        heightCm: height,
        weightKg: weight,
        bmi,
        recordedAt: new Date().toISOString()
      },
      diagnoses,
      prescriptions,
      advice,
      followUpDate,
      isSigned: true,
      signedAt: new Date().toISOString(),
      signedBy: `${currentUser.name} [Verified Electronic Signature]`
    };

    saveEncounter(newEncounter);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    setShowPrintModal(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #121a2d 0%, #0d1322 100%)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Stethoscope size={22} color="#ffffff" />
          </div>
          <div>
            <h1 className="title-lg">Doctor Clinical Record & OPD Consultation</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Attending Provider: <strong>{currentUser.name}</strong> • Date: <strong>{selectedDate}</strong>
            </p>
          </div>
        </div>

        {/* Queue Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Select Queue Patient:</span>
          <select
            value={selectedAptId}
            onChange={e => setSelectedAptId(e.target.value)}
            className="select font-mono text-sm"
            style={{ width: '280px', padding: '6px 12px' }}
          >
            {dateAppointments.map(a => (
              <option key={a.id} value={a.id}>
                Token #{a.tokenNumber} - {a.patientName} ({a.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Patient Banner */}
      <div className="card banner-responsive" style={{
        background: 'rgba(14, 165, 233, 0.05)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        padding: '16px 20px',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: '#ffffff'
          }}>
            {activePatient.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {activePatient.name}
              </span>
              <span className="badge badge-primary font-mono text-xs">{activePatient.mrn}</span>
              <span className="badge badge-danger text-xs font-mono">{activePatient.bloodGroup}</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {activePatient.dob} ({activePatient.age} yrs, {activePatient.gender}) • Phone: {activePatient.phone}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {activePatient.allergies.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={15} color="#ef4444" />
              <span style={{ fontSize: '0.78rem', color: '#f87171', fontWeight: 700 }}>
                Allergies: {activePatient.allergies.join(', ')}
              </span>
            </div>
          )}
          <button
            onClick={() => setActivePatient360Id(activePatient.id)}
            className="btn btn-secondary btn-sm"
          >
            <FileText size={14} />
            <span>Open Patient 360</span>
          </button>
        </div>
      </div>

      {/* Main Clinical Consultation Workspace */}
      <div className="grid-split-1-2">
        {/* Left Column: Vitals & History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Vitals Recording Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <HeartPulse size={18} color="#ef4444" />
              <h3 className="title-md">Vitals & Physiological Metrics</h3>
            </div>

            <div className="grid-form-2">
              <div className="form-group">
                <label className="form-label">Blood Pressure (Sys / Dia)</label>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <input
                    type="number"
                    value={bpSys}
                    onChange={e => setBpSys(parseInt(e.target.value) || 0)}
                    className="input font-mono text-sm"
                    placeholder="120"
                  />
                  <span className="text-dim">/</span>
                  <input
                    type="number"
                    value={bpDia}
                    onChange={e => setBpDia(parseInt(e.target.value) || 0)}
                    className="input font-mono text-sm"
                    placeholder="80"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Heart Rate (Pulse bpm)</label>
                <input
                  type="number"
                  value={pulse}
                  onChange={e => setPulse(parseInt(e.target.value) || 0)}
                  className="input font-mono text-sm"
                />
              </div>

              <div className="form-group">
                <label className="form-label">SpO2 Oxygen Saturation</label>
                <input
                  type="number"
                  value={spO2}
                  onChange={e => setSpO2(parseInt(e.target.value) || 0)}
                  className="input font-mono text-sm"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Body Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={e => setTemp(parseFloat(e.target.value) || 36.5)}
                  className="input font-mono text-sm"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Height (cm) & Weight (kg)</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="number"
                    value={height}
                    onChange={e => setHeight(parseInt(e.target.value) || 0)}
                    className="input font-mono text-sm"
                    placeholder="175"
                  />
                  <input
                    type="number"
                    value={weight}
                    onChange={e => setWeight(parseInt(e.target.value) || 0)}
                    className="input font-mono text-sm"
                    placeholder="70"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Calculated BMI Score</label>
                <div style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span className="font-mono" style={{ fontWeight: 800, fontSize: '1rem', color: bmi > 25 ? '#fbbf24' : '#34d399' }}>
                    {bmi}
                  </span>
                  <span className={`badge ${bmi < 25 ? 'badge-success' : 'badge-warning'} text-xs`}>
                    {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chief Complaint & Clinical Notes Card */}
          <div className="card">
            <h3 className="title-md" style={{ marginBottom: '12px' }}>Subjective History & Examination</h3>

            <div className="form-group">
              <label className="form-label">Chief Complaint *</label>
              <textarea
                rows={2}
                value={chiefComplaint}
                onChange={e => setChiefComplaint(e.target.value)}
                className="textarea text-sm"
              />
            </div>

            <div className="form-group">
              <label className="form-label">History of Presenting Illness & Exam Findings</label>
              <textarea
                rows={4}
                value={history}
                onChange={e => setHistory(e.target.value)}
                className="textarea text-sm"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Diagnosis, Prescription & Electronic Sign-off */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Diagnosis Card */}
          <div className="card">
            <h3 className="title-md" style={{ marginBottom: '12px' }}>Diagnosis & Problem List (ICD-10)</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              {diagnoses.map((diag, index) => (
                <div key={diag.code + index} style={{
                  background: 'var(--bg-card-hover)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem'
                }}>
                  <div>
                    <span className="badge badge-primary font-mono text-xs" style={{ marginRight: '8px' }}>
                      {diag.code}
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{diag.description}</span>
                  </div>
                  <span className="badge badge-neutral text-xs">{diag.type}</span>
                </div>
              ))}
            </div>

            {/* Add diagnosis row */}
            <div className="grid-form-3" style={{ gap: '8px' }}>
              <input
                type="text"
                placeholder="ICD Code"
                value={newDiagCode}
                onChange={e => setNewDiagCode(e.target.value)}
                className="input text-sm font-mono"
              />
              <input
                type="text"
                placeholder="Description"
                value={newDiagDesc}
                onChange={e => setNewDiagDesc(e.target.value)}
                className="input text-sm"
              />
              <button
                type="button"
                onClick={handleAddDiagnosis}
                className="btn btn-secondary btn-sm"
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          {/* Electronic Prescription Authoring Pad */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Pill size={18} color="#38bdf8" />
                <h3 className="title-md">Electronic Prescription Pad</h3>
              </div>
              <span className="badge badge-info text-xs">{prescriptions.length} Meds</span>
            </div>

            {/* Prescriptions Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              {prescriptions.map(rx => (
                <div key={rx.id} style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.825rem'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      {rx.medicationName} ({rx.dosage})
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      Route: {rx.route} • Freq: <strong>{rx.frequency}</strong> • Duration: <strong>{rx.duration}</strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '2px' }}>
                      Instructions: {rx.instructions}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleRemoveMed(rx.id)}
                      className="btn btn-ghost btn-sm"
                      style={{ color: '#ef4444' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add medication selector */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={selectedMedId}
                onChange={e => setSelectedMedId(e.target.value)}
                className="select text-sm"
              >
                {medications.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.genericName}) - In Stock: {m.stockQuantity}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddMedication}
                className="btn btn-secondary btn-sm"
              >
                <Plus size={14} /> Add Medicine
              </button>
            </div>
          </div>

          {/* Advice & Sign Off Card */}
          <div className="card">
            <div className="form-group">
              <label className="form-label">Doctor Advice & Patient Warnings</label>
              <input
                type="text"
                value={advice}
                onChange={e => setAdvice(e.target.value)}
                className="input text-sm"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <div>
                <label className="form-label" style={{ marginBottom: '2px' }}>Next Follow-up Date:</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={e => setFollowUpDate(e.target.value)}
                  className="input font-mono text-sm"
                  style={{ width: '160px', padding: '6px 10px' }}
                />
              </div>

              <button
                type="button"
                onClick={handleSignEncounter}
                className="btn btn-primary btn-lg"
              >
                <ShieldCheck size={18} />
                <span>Finalize & Sign E-Prescription</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Print Prescription Preview Modal */}
      {showPrintModal && (
        <div className="modal-overlay" onClick={() => setShowPrintModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 className="title-md">Prescription Document Ready</h3>
              <button onClick={() => setShowPrintModal(false)} className="btn btn-ghost btn-sm">✕</button>
            </div>
            <div className="modal-body" style={{ background: '#ffffff', color: '#0f172a', padding: '24px', borderRadius: '10px' }}>
              <div style={{ borderBottom: '2px solid #0284c7', paddingBottom: '12px', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0369a1' }}>NEXORA CARE HOSPITAL</h2>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>North Campus Medical Complex • Phone: +1 (800) 555-CARE</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginTop: '6px' }}>
                  Provider: {currentUser.name} ({currentUser.department || 'Consultant'})
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '16px', background: '#f1f5f9', padding: '8px 12px', borderRadius: '6px' }}>
                <div><strong>Patient:</strong> {activePatient.name} ({activePatient.gender}, {activePatient.age} yrs)</div>
                <div><strong>MRN:</strong> {activePatient.mrn}</div>
                <div><strong>Date:</strong> {selectedDate}</div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0369a1', marginBottom: '8px' }}>Rx Prescribed Medicines:</h4>
                {prescriptions.map((p, idx) => (
                  <div key={idx} style={{ marginBottom: '8px', fontSize: '0.85rem' }}>
                    <strong>{idx + 1}. {p.medicationName}</strong> — {p.dosage}
                    <div style={{ fontSize: '0.78rem', color: '#475569', marginLeft: '14px' }}>
                      Sig: {p.frequency} x {p.duration} ({p.instructions})
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', fontSize: '0.825rem' }}>
                <div><strong>Advice:</strong> {advice}</div>
                <div><strong>Follow-up:</strong> {followUpDate}</div>
              </div>

              <div style={{ marginTop: '24px', textAlign: 'right', fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                ✓ Digitally signed by {currentUser.name} on {selectedDate}
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => window.print()} className="btn btn-primary">
                <Printer size={16} /> Print Prescription
              </button>
              <button onClick={() => setShowPrintModal(false)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
