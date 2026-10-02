import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TriageCase, AcuityLevel } from '../../types';
import { 
  AlertOctagon, Plus, HeartPulse, UserPlus, ArrowRight, 
  Clock, ShieldAlert, CheckCircle, Stethoscope
} from 'lucide-react';

export const EmergencyTriageView: React.FC = () => {
  const { 
    triageCases, addTriageCase, setActivePatient360Id, 
    selectedDate, showToast, updateBedStatus, beds 
  } = useApp();

  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('MALE');
  const [acuity, setAcuity] = useState<AcuityLevel>('LEVEL_2_EMERGENT');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [spO2, setSpO2] = useState(98);
  const [bp, setBp] = useState('120/80');
  const [pulse, setPulse] = useState(88);
  const [attendingDoctor, setAttendingDoctor] = useState('Dr. Priya Sharma, MS');

  const handleCreateTriage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    addTriageCase({
      patientId: `pat_er_${Date.now().toString().slice(-4)}`,
      patientName: patientName.trim(),
      patientAge: age,
      patientGender: gender,
      acuity,
      chiefComplaint: chiefComplaint.trim(),
      spO2,
      bp,
      pulse,
      attendingDoctor,
      disposition: 'TRIAGED'
    });

    setShowIntakeModal(false);
    setPatientName('');
    setChiefComplaint('');
  };

  const getAcuityColor = (lvl: AcuityLevel) => {
    switch (lvl) {
      case 'LEVEL_1_RESUSCITATION': return '#ef4444'; // Red
      case 'LEVEL_2_EMERGENT': return '#f97316';     // Orange
      case 'LEVEL_3_URGENT': return '#eab308';       // Yellow
      case 'LEVEL_4_NON_URGENT': return '#10b981';   // Green
    }
  };

  const handleAdmitToICU = (c: TriageCase) => {
    const freeIcuBed = beds.find(b => b.ward === 'ICU' && b.status === 'AVAILABLE');
    if (!freeIcuBed) {
      showToast('No ICU beds currently available', 'error');
      return;
    }
    updateBedStatus(freeIcuBed.id, 'OCCUPIED', c.patientId, c.patientName, `NX-ER-${c.patientAge}`);
    showToast(`Admitted ${c.patientName} from Trauma Bay to ${freeIcuBed.number}`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #450a0a 0%, #0f172a 100%)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
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
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)'
          }}>
            <AlertOctagon size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 className="title-lg">Emergency & Casualty Triage Command</h1>
              <span className="badge badge-danger text-xs">Acuity Level 1-4 Triage</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Rapid trauma intake, vital stabilization timeline, and fast-track transfer to ICU / OPD.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowIntakeModal(true)}
          className="btn btn-danger btn-sm"
        >
          <Plus size={15} />
          <span>+ Fast Emergency Intake</span>
        </button>
      </div>

      {/* Triage Acuity Color Legend */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {[
          { lvl: 'LEVEL_1_RESUSCITATION', label: 'Level 1: Resuscitation (Immediate)', color: '#ef4444' },
          { lvl: 'LEVEL_2_EMERGENT', label: 'Level 2: Emergent (<15 min)', color: '#f97316' },
          { lvl: 'LEVEL_3_URGENT', label: 'Level 3: Urgent (<30 min)', color: '#eab308' },
          { lvl: 'LEVEL_4_NON_URGENT', label: 'Level 4: Non-Urgent (Routine)', color: '#10b981' }
        ].map(item => (
          <div key={item.lvl} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '0.75rem'
          }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Triage Cases Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '16px'
      }}>
        {triageCases.map(c => {
          const color = getAcuityColor(c.acuity);

          return (
            <div key={c.id} className="card" style={{ borderLeft: `6px solid ${color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span className="badge text-xs" style={{ background: `${color}25`, color, border: `1px solid ${color}50` }}>
                  {c.acuity.replace(/_/g, ' ')}
                </span>
                <span className="font-mono text-dim text-xs">{c.arrivalTime}</span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                {c.patientName}
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {c.patientAge} yrs • {c.patientGender} • Attending: <strong>{c.attendingDoctor}</strong>
              </div>

              <p style={{ marginTop: '10px', fontSize: '0.825rem', color: 'var(--text-main)', background: 'var(--bg-input)', padding: '8px 12px', borderRadius: '6px' }}>
                {c.chiefComplaint}
              </p>

              {/* Vitals Snapshot */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '12px',
                fontSize: '0.75rem',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '8px'
              }}>
                <div>BP: <strong className="font-mono">{c.bp}</strong></div>
                <div>Pulse: <strong className="font-mono">{c.pulse} bpm</strong></div>
                <div>SpO2: <strong className="font-mono" style={{ color: c.spO2 < 95 ? '#ef4444' : '#10b981' }}>{c.spO2}%</strong></div>
              </div>

              {/* Triage Actions */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <button
                  onClick={() => handleAdmitToICU(c)}
                  className="btn btn-warning btn-sm"
                  style={{ flex: 1 }}
                >
                  <ArrowRight size={14} />
                  <span>Admit to ICU</span>
                </button>
                <button
                  onClick={() => setActivePatient360Id(c.patientId)}
                  className="btn btn-secondary btn-sm"
                >
                  360
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fast Intake Modal */}
      {showIntakeModal && (
        <div className="modal-overlay" onClick={() => setShowIntakeModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 className="title-md">Emergency Triage Intake (Rapid Entry)</h3>
              <button onClick={() => setShowIntakeModal(false)} className="btn btn-ghost btn-sm">✕</button>
            </div>
            <form onSubmit={handleCreateTriage}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Patient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe / Trauma Unidentified"
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    className="input"
                    autoFocus
                  />
                </div>

                <div className="grid-form-3" style={{ gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={e => setAge(parseInt(e.target.value) || 0)}
                      className="input font-mono"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value)}
                      className="select"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Triage Acuity Level *</label>
                    <select
                      value={acuity}
                      onChange={e => setAcuity(e.target.value as AcuityLevel)}
                      className="select"
                    >
                      <option value="LEVEL_1_RESUSCITATION">Level 1 - Resuscitation (Red)</option>
                      <option value="LEVEL_2_EMERGENT">Level 2 - Emergent (Orange)</option>
                      <option value="LEVEL_3_URGENT">Level 3 - Urgent (Yellow)</option>
                      <option value="LEVEL_4_NON_URGENT">Level 4 - Non-Urgent (Green)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Chief Complaint / Trauma Mechanism *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Trauma, fall, chest pain, laceration, etc."
                    value={chiefComplaint}
                    onChange={e => setChiefComplaint(e.target.value)}
                    className="textarea"
                  />
                </div>

                <div className="grid-form-3" style={{ gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">SpO2 %</label>
                    <input
                      type="number"
                      value={spO2}
                      onChange={e => setSpO2(parseInt(e.target.value) || 0)}
                      className="input font-mono"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Blood Pressure</label>
                    <input
                      type="text"
                      value={bp}
                      onChange={e => setBp(e.target.value)}
                      className="input font-mono"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Heart Rate (bpm)</label>
                    <input
                      type="number"
                      value={pulse}
                      onChange={e => setPulse(parseInt(e.target.value) || 0)}
                      className="input font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowIntakeModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-danger">Commit Emergency Triage</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
