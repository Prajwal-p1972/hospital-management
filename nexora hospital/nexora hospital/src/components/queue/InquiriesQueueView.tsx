import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment, Inquiry, AppointmentStatus } from '../../types';
import { 
  Clock, Plus, CheckCircle2, UserCheck, PhoneCall, 
  ArrowRight, Search, Filter, AlertTriangle, Calendar
} from 'lucide-react';

export const InquiriesQueueView: React.FC = () => {
  const { 
    inquiries, appointments, selectedDate, updateAppointmentStatus, 
    convertInquiryToAppointment, addInquiry, patients, addAppointment, 
    setActivePatient360Id, showToast 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'QUEUE' | 'INQUIRIES'>('QUEUE');
  const [showAddInquiryModal, setShowAddInquiryModal] = useState(false);

  // New Inquiry form
  const [inqName, setInqName] = useState('');
  const [inqPhone, setInqPhone] = useState('');
  const [inqEmail, setInqEmail] = useState('');
  const [inqDept, setInqDept] = useState('Dental Surgery');
  const [inqDoctor, setInqDoctor] = useState('Dr. Marcus Vance, DDS');
  const [inqSource, setInqSource] = useState<'PHONE' | 'WALK_IN' | 'WEBSITE' | 'REFERRAL'>('PHONE');
  const [inqNotes, setInqNotes] = useState('');

  // Filter appointments for selected date
  const dateAppointments = appointments.filter(a => a.date === selectedDate);
  const queueList = dateAppointments.sort((a, b) => a.tokenNumber - b.tokenNumber);

  const handleCreateInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inqName.trim() || !inqPhone.trim()) return;

    try {
      await addInquiry({
        name: inqName.trim(),
        phone: inqPhone.trim(),
        email: inqEmail.trim(),
        source: inqSource,
        department: inqDept,
        preferredDoctor: inqDoctor,
        preferredDate: selectedDate,
        notes: inqNotes.trim(),
        followUpOwner: 'Front Desk'
      });

      setShowAddInquiryModal(false);
      setInqName('');
      setInqPhone('');
      setInqNotes('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickConvert = async (inq: Inquiry) => {
    const matchedPat = patients.find(p => p.phone === inq.phone) || patients[0];
    await convertInquiryToAppointment(
      inq.id,
      matchedPat.id,
      'usr_dentist',
      inq.preferredDoctor || 'Dr. Marcus Vance, DDS',
      'dept_dental',
      inq.department || 'Dental Surgery',
      '11:30 - 12:00'
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Bar */}
      <div className="banner-responsive" style={{
        background: 'linear-gradient(135deg, #121a2d 0%, #0d1322 100%)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 24px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Clock size={22} color="#ffffff" />
          </div>
          <div>
            <h1 className="title-lg">Inquiries & Live Waiting Queue</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Real-time token management, check-in tracking & intake inquiry conversions for {selectedDate}.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowAddInquiryModal(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={15} />
            <span>+ New Inquiry Lead</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', gap: '8px' }}>
        <button
          onClick={() => setActiveSubTab('QUEUE')}
          style={{
            padding: '10px 18px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeSubTab === 'QUEUE' ? '2px solid #f59e0b' : '2px solid transparent',
            color: activeSubTab === 'QUEUE' ? '#fbbf24' : 'var(--text-muted)',
            fontWeight: activeSubTab === 'QUEUE' ? 700 : 500,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          Live Token Queue ({queueList.length})
        </button>
        <button
          onClick={() => setActiveSubTab('INQUIRIES')}
          style={{
            padding: '10px 18px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeSubTab === 'INQUIRIES' ? '2px solid #f59e0b' : '2px solid transparent',
            color: activeSubTab === 'INQUIRIES' ? '#fbbf24' : 'var(--text-muted)',
            fontWeight: activeSubTab === 'INQUIRIES' ? 700 : 500,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          Inquiry Intake Board ({inquiries.length})
        </button>
      </div>

      {/* TAB 1: Live Waiting Queue */}
      {activeSubTab === 'QUEUE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Waiting Room Big Display Screen Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {queueList.map(apt => {
              const isWaiting = apt.status === 'ARRIVED';
              const isInConsult = apt.status === 'IN_CONSULTATION';
              const isCompleted = apt.status === 'COMPLETED';

              return (
                <div key={apt.id} className="card" style={{
                  borderLeft: `5px solid ${
                    isInConsult ? '#a855f7' : isWaiting ? '#fbbf24' : isCompleted ? '#10b981' : '#64748b'
                  }`,
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-primary font-mono text-sm" style={{ fontSize: '0.9rem', padding: '3px 8px' }}>
                        #{apt.tokenNumber}
                      </span>
                      <span className={`badge ${
                        isInConsult ? 'badge-purple' : isWaiting ? 'badge-warning' : isCompleted ? 'badge-success' : 'badge-neutral'
                      } text-xs`}>
                        {apt.status}
                      </span>
                    </div>

                    {apt.waitTimeMinutes > 0 && (
                      <span className={`badge ${apt.waitTimeMinutes >= 30 ? 'badge-danger' : 'badge-neutral'} font-mono text-xs`}>
                        Wait: {apt.waitTimeMinutes}m
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                    {apt.patientName}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    MRN: <span className="font-mono text-primary">{apt.patientMrn}</span> • Slot: {apt.timeSlot}
                  </div>

                  <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-dim)', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                    <div><strong>Department:</strong> {apt.departmentName}</div>
                    <div><strong>Doctor:</strong> {apt.doctorName}</div>
                    <div style={{ marginTop: '2px', color: 'var(--text-muted)' }}>{apt.reason}</div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '14px', borderTop: '1px dashed var(--border-subtle)', paddingTop: '10px' }}>
                    {(apt.status === 'BOOKED' || apt.status === 'CONFIRMED') && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'ARRIVED')}
                        className="btn btn-warning btn-sm"
                        style={{ flex: 1 }}
                      >
                        <UserCheck size={14} /> Check In
                      </button>
                    )}

                    {apt.status === 'ARRIVED' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'IN_CONSULTATION')}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1 }}
                      >
                        Call into Room
                      </button>
                    )}

                    {apt.status === 'IN_CONSULTATION' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'COMPLETED')}
                        className="btn btn-success btn-sm"
                        style={{ flex: 1 }}
                      >
                        <CheckCircle2 size={14} /> Complete
                      </button>
                    )}

                    <button
                      onClick={() => setActivePatient360Id(apt.patientId)}
                      className="btn btn-secondary btn-sm"
                    >
                      360
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Inquiries Board */}
      {activeSubTab === 'INQUIRIES' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="title-md">Inquiry Leads & Patient Intake Funnel</h3>
            <span className="badge badge-info text-xs">{inquiries.length} Inquiries Logged</span>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Lead Name</th>
                  <th>Contact</th>
                  <th>Source</th>
                  <th>Department & Doctor</th>
                  <th>Preferred Date</th>
                  <th>Inquiry Details / Notes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map(inq => (
                  <tr key={inq.id}>
                    <td style={{ fontWeight: 700 }}>{inq.name}</td>
                    <td>
                      <div className="font-mono text-xs">{inq.phone}</div>
                      <div className="text-dim text-xs">{inq.email}</div>
                    </td>
                    <td>
                      <span className="badge badge-neutral text-xs">{inq.source}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{inq.department}</div>
                      <div className="text-dim text-xs">{inq.preferredDoctor}</div>
                    </td>
                    <td className="font-mono text-xs">{inq.preferredDate}</td>
                    <td style={{ maxWidth: '280px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {inq.notes}
                    </td>
                    <td>
                      <span className={`badge ${inq.status === 'BOOKED' ? 'badge-success' : 'badge-warning'} text-xs`}>
                        {inq.status}
                      </span>
                    </td>
                    <td>
                      {inq.status !== 'BOOKED' ? (
                        <button
                          onClick={() => handleQuickConvert(inq)}
                          className="btn btn-primary btn-sm"
                        >
                          <ArrowRight size={13} />
                          <span>Convert to Apt</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                          ✓ Converted
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Inquiry Modal */}
      {showAddInquiryModal && (
        <div className="modal-overlay" onClick={() => setShowAddInquiryModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h3 className="title-md">Log Prospective Patient Inquiry</h3>
              <button onClick={() => setShowAddInquiryModal(false)} className="btn btn-ghost btn-sm">✕</button>
            </div>
            <form onSubmit={handleCreateInquiry}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Prospect Name *</label>
                  <input
                    type="text"
                    required
                    value={inqName}
                    onChange={e => setInqName(e.target.value)}
                    className="input"
                    placeholder="e.g. David Hasselhoff"
                  />
                </div>
                <div className="grid-form-2">
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={inqPhone}
                      onChange={e => setInqPhone(e.target.value)}
                      className="input"
                      placeholder="+1 555-..."
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      value={inqEmail}
                      onChange={e => setInqEmail(e.target.value)}
                      className="input"
                      placeholder="user@example.com"
                    />
                  </div>
                </div>
                <div className="grid-form-2">
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select
                      value={inqDept}
                      onChange={e => setInqDept(e.target.value)}
                      className="select"
                    >
                      <option value="Cardiology">Cardiology</option>
                      <option value="Dental Surgery">Dental Surgery</option>
                      <option value="Neurosurgery">Neurosurgery</option>
                      <option value="Pediatrics">Pediatrics</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Inquiry Channel Source</label>
                    <select
                      value={inqSource}
                      onChange={e => setInqSource(e.target.value as any)}
                      className="select"
                    >
                      <option value="PHONE">Phone Call</option>
                      <option value="WEBSITE">Website Portal</option>
                      <option value="WALK_IN">Walk-in Reception</option>
                      <option value="REFERRAL">Doctor Referral</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Inquiry Notes & Medical Requirement</label>
                  <textarea
                    rows={3}
                    value={inqNotes}
                    onChange={e => setInqNotes(e.target.value)}
                    className="textarea"
                    placeholder="Describe patient query or requested procedure..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddInquiryModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
