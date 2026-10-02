import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, QrCode, Calendar, Clock, HeartPulse, FileText, 
  Sparkles, FlaskConical, Receipt, Shield, AlertCircle, 
  CheckCircle2, Pill, Stethoscope, BedDouble
} from 'lucide-react';

export const Patient360Modal: React.FC = () => {
  const { 
    activePatient360Id, setActivePatient360Id, patients, appointments, 
    encounters, invoices, labOrders, treatmentPlans, teethRecords, 
    admissions, auditEvents, setQrModalPatient, setActiveTab
  } = useApp();

  const [currentTab, setCurrentTab] = useState<'TIMELINE' | 'CLINICAL' | 'VITALS' | 'DENTAL' | 'LABS' | 'FINANCE' | 'AUDIT'>('TIMELINE');

  if (!activePatient360Id) return null;

  const patient = patients.find(p => p.id === activePatient360Id);
  if (!patient) return null;

  // Filter longitudinal patient history
  const patientAppointments = appointments.filter(a => a.patientId === patient.id);
  const patientEncounters = encounters.filter(e => e.patientId === patient.id);
  const patientInvoices = invoices.filter(i => i.patientId === patient.id);
  const patientLabs = labOrders.filter(l => l.patientId === patient.id);
  const patientPlans = treatmentPlans.filter(tp => tp.patientId === patient.id);
  const patientAdmissions = admissions.filter(a => a.patientId === patient.id);
  const patientAudits = auditEvents.filter(a => a.entityId === patient.id || a.details.includes(patient.name) || a.details.includes(patient.mrn));

  // Collect dental findings across teeth
  const teethWithFindings = teethRecords.filter(t => t.findings.length > 0);

  return (
    <div className="modal-overlay" onClick={() => setActivePatient360Id(null)}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '980px', width: '95%' }}>
        {/* Header Bar */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderBottom: '1px solid var(--border-medium)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {/* Avatar Initials */}
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              fontSize: '1.4rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(2, 132, 199, 0.4)',
              border: '2px solid rgba(56, 189, 248, 0.4)'
            }}>
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
                  {patient.name}
                </h2>
                <span className="badge badge-primary font-mono text-xs">
                  {patient.mrn}
                </span>
                <span className="badge badge-neutral text-xs">
                  {patient.patientType}
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '6px', fontSize: '0.8rem', color: '#94a3b8' }}>
                <span><strong>DOB:</strong> {patient.dob} ({patient.age} yrs, {patient.gender})</span>
                <span>•</span>
                <span><strong>Phone:</strong> {patient.phone}</span>
                <span>•</span>
                <span><strong>Blood:</strong> <span className="font-mono text-danger" style={{ color: '#f87171', fontWeight: 700 }}>{patient.bloodGroup}</span></span>
                <span>•</span>
                <span><strong>City:</strong> {patient.city}</span>
              </div>

              {/* Allergy Banner */}
              {patient.allergies.length > 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                  <AlertCircle size={14} color="#f87171" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f87171' }}>
                    ALLERGIES / PRECAUTIONS:
                  </span>
                  {patient.allergies.map(a => (
                    <span key={a} className="badge badge-danger text-xs" style={{ padding: '1px 6px' }}>
                      {a}
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.725rem', color: '#34d399', marginTop: '6px' }}>
                  ✓ No known drug allergies documented
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setQrModalPatient(patient)}
              className="btn btn-secondary btn-sm"
              title="View & Print Scannable Patient QR Card"
            >
              <QrCode size={15} color="#38bdf8" />
              <span>QR Pass</span>
            </button>
            <button onClick={() => setActivePatient360Id(null)} className="btn btn-ghost btn-sm">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-input)',
          padding: '0 16px',
          overflowX: 'auto'
        }}>
          {[
            { key: 'TIMELINE', label: 'Longitudinal Timeline', icon: <Clock size={14} />, count: patientAppointments.length + patientEncounters.length },
            { key: 'CLINICAL', label: 'Doctor EMR & Prescriptions', icon: <Stethoscope size={14} />, count: patientEncounters.length },
            { key: 'VITALS', label: 'Vitals & BMI Trend', icon: <HeartPulse size={14} /> },
            { key: 'DENTAL', label: 'Dental Chart & Plans', icon: <Sparkles size={14} />, count: patientPlans.length },
            { key: 'LABS', label: 'Diagnostic Orders', icon: <FlaskConical size={14} />, count: patientLabs.length },
            { key: 'FINANCE', label: 'Billing & Ledger', icon: <Receipt size={14} />, count: patientInvoices.length },
            { key: 'AUDIT', label: 'Audit Trail', icon: <Shield size={14} />, count: patientAudits.length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setCurrentTab(tab.key as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 14px',
                background: 'transparent',
                border: 'none',
                borderBottom: currentTab === tab.key ? '2px solid #38bdf8' : '2px solid transparent',
                color: currentTab === tab.key ? '#38bdf8' : 'var(--text-muted)',
                fontWeight: currentTab === tab.key ? 700 : 500,
                fontSize: '0.8rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="badge badge-neutral text-xs" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Modal Body Panels */}
        <div className="modal-body" style={{ minHeight: '380px', maxHeight: '65vh', overflowY: 'auto' }}>
          {/* TAB 1: Longitudinal Timeline */}
          {currentTab === 'TIMELINE' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 className="title-sm" style={{ color: 'var(--text-main)' }}>
                  Chronological Healthcare Journey
                </h4>
                <span className="text-xs text-muted">
                  Privacy Token: <code className="font-mono text-primary">{patient.qrToken}</code>
                </span>
              </div>

              {/* Admissions if any */}
              {patientAdmissions.map(adm => (
                <div key={adm.id} style={{
                  borderLeft: '3px solid #f59e0b',
                  background: 'rgba(245, 158, 11, 0.06)',
                  borderRadius: '0 8px 8px 0',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <BedDouble size={16} color="#fbbf24" />
                      <strong style={{ color: '#fbbf24', fontSize: '0.9rem' }}>
                        Inpatient Hospital Admission ({adm.ward} - Bed {adm.bedNumber})
                      </strong>
                      <span className="badge badge-warning text-xs">{adm.status}</span>
                    </div>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {adm.initialDiagnosis}
                    </p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '6px' }}>
                      Admitted: {adm.admissionDate.substring(0, 10)} by {adm.admittingDoctor}
                    </div>
                  </div>
                </div>
              ))}

              {/* Appointments & Encounters Timeline */}
              {patientAppointments.map(apt => {
                const linkedEncounter = patientEncounters.find(e => e.appointmentId === apt.id);
                return (
                  <div key={apt.id} style={{
                    borderLeft: '3px solid #0284c7',
                    background: 'var(--bg-card-hover)',
                    borderRadius: '0 8px 8px 0',
                    padding: '14px 16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="badge badge-primary text-xs">{apt.appointmentType}</span>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                            {apt.departmentName} Consultation
                          </strong>
                          <span className={`badge ${apt.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'} text-xs`}>
                            {apt.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Doctor: <strong>{apt.doctorName}</strong> • Date: <strong>{apt.date} ({apt.timeSlot})</strong> • Token #{apt.tokenNumber}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                          Reason: {apt.reason}
                        </div>
                      </div>

                      {apt.waitTimeMinutes > 0 && (
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>Wait Time:</span>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: apt.waitTimeMinutes > 30 ? '#ef4444' : '#10b981' }}>
                            {apt.waitTimeMinutes} mins
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Linked Encounter details */}
                    {linkedEncounter && (
                      <div style={{
                        marginTop: '12px',
                        paddingTop: '10px',
                        borderTop: '1px dashed var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        fontSize: '0.8rem'
                      }}>
                        <div>
                          <strong style={{ color: 'var(--text-muted)' }}>Diagnoses: </strong>
                          {linkedEncounter.diagnoses.map(d => (
                            <span key={d.code} className="badge badge-neutral font-mono text-xs" style={{ marginRight: '6px' }}>
                              [{d.code}] {d.description}
                            </span>
                          ))}
                        </div>
                        <div>
                          <strong style={{ color: 'var(--text-muted)' }}>Prescriptions: </strong>
                          <span style={{ color: 'var(--text-main)' }}>
                            {linkedEncounter.prescriptions.map(p => `${p.medicationName} (${p.dosage}, ${p.frequency})`).join('; ')}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={13} />
                          <span>{linkedEncounter.signedBy}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {patientAppointments.length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-dim)' }}>
                  No prior consultations or appointments logged for this patient.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Clinical Encounters & Prescriptions */}
          {currentTab === 'CLINICAL' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {patientEncounters.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-dim)' }}>
                  No formal signed clinical encounters recorded yet.
                </div>
              ) : (
                patientEncounters.map(enc => (
                  <div key={enc.id} className="card" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px', marginBottom: '12px' }}>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Encounter on {enc.date}</h4>
                        <span style={{ fontSize: '0.78rem', color: '#38bdf8' }}>Attending: {enc.doctorName}</span>
                      </div>
                      <span className="badge badge-success text-xs">E-SIGN VERIFIED</span>
                    </div>

                    <div style={{ marginBottom: '12px', fontSize: '0.85rem' }}>
                      <strong style={{ color: 'var(--text-muted)' }}>Chief Complaint:</strong>
                      <p style={{ marginTop: '2px', color: 'var(--text-main)' }}>{enc.chiefComplaint}</p>
                    </div>

                    <div style={{ marginBottom: '12px', fontSize: '0.85rem' }}>
                      <strong style={{ color: 'var(--text-muted)' }}>Medical History & Findings:</strong>
                      <p style={{ marginTop: '2px', color: 'var(--text-main)' }}>{enc.history}</p>
                    </div>

                    {/* Vitals */}
                    <div style={{
                      background: 'var(--bg-input)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '16px',
                      fontSize: '0.78rem',
                      marginBottom: '14px'
                    }}>
                      <div><span className="text-dim">BP:</span> <strong>{enc.vitals.bpSystolic}/{enc.vitals.bpDiastolic} mmHg</strong></div>
                      <div><span className="text-dim">HR:</span> <strong>{enc.vitals.heartRate} bpm</strong></div>
                      <div><span className="text-dim">SpO2:</span> <strong>{enc.vitals.spO2}%</strong></div>
                      <div><span className="text-dim">Temp:</span> <strong>{enc.vitals.tempCelsius}°C</strong></div>
                      <div><span className="text-dim">BMI:</span> <strong>{enc.vitals.bmi}</strong></div>
                    </div>

                    {/* Prescriptions */}
                    <div style={{ marginBottom: '12px' }}>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                        Prescribed Medications ({enc.prescriptions.length})
                      </strong>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {enc.prescriptions.map((rx, idx) => (
                          <div key={rx.id || idx} style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '0.825rem'
                          }}>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                                {rx.medicationName} ({rx.dosage})
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                                Route: {rx.route} • Frequency: {rx.frequency} • Duration: {rx.duration}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '2px' }}>
                                Instruction: {rx.instructions}
                              </div>
                            </div>
                            <div>
                              <span className={`badge ${rx.substitutionAllowed ? 'badge-primary' : 'badge-neutral'} text-xs`}>
                                {rx.substitutionAllowed ? 'Generic Sub Allowed' : 'Dispense as Written'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                      <strong>Advice: </strong> {enc.advice}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Vitals History */}
          {currentTab === 'VITALS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 className="title-sm">Physiological Vitals Track Record</h4>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Recorded Date</th>
                      <th>Blood Pressure</th>
                      <th>Pulse (HR)</th>
                      <th>SpO2</th>
                      <th>Temperature</th>
                      <th>Height / Weight</th>
                      <th>BMI Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientEncounters.map(enc => (
                      <tr key={enc.id}>
                        <td className="font-mono">{enc.date}</td>
                        <td className="font-mono" style={{ fontWeight: 600 }}>
                          {enc.vitals.bpSystolic}/{enc.vitals.bpDiastolic} mmHg
                        </td>
                        <td>{enc.vitals.heartRate} bpm</td>
                        <td>
                          <span className={`badge ${enc.vitals.spO2 >= 95 ? 'badge-success' : 'badge-danger'} text-xs`}>
                            {enc.vitals.spO2}%
                          </span>
                        </td>
                        <td>{enc.vitals.tempCelsius}°C</td>
                        <td>{enc.vitals.heightCm} cm / {enc.vitals.weightKg} kg</td>
                        <td>
                          <span className={`badge ${enc.vitals.bmi > 25 ? 'badge-warning' : 'badge-success'} font-mono text-xs`}>
                            {enc.vitals.bmi}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {patientEncounters.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '20px' }}>
                          No recorded vital sessions available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Dental & Periodontal */}
          {currentTab === 'DENTAL' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 className="title-sm">Dental Treatment Plans & Tooth Findings</h4>
                <button
                  onClick={() => {
                    setActiveTab('DENTAL_MODE');
                    setActivePatient360Id(null);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  <Sparkles size={14} />
                  <span>Open Dental Charting Suite</span>
                </button>
              </div>

              {/* Treatment Plans */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {patientPlans.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-dim)' }}>
                    No planned dental procedures for this patient.
                  </div>
                ) : (
                  patientPlans.map(tp => (
                    <div key={tp.id} style={{
                      background: 'var(--bg-card-hover)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="badge badge-purple text-xs font-mono">Tooth #{tp.toothNumber}</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{tp.procedureName}</span>
                          <span className="text-dim text-xs">({tp.procedureCode})</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Surface: {tp.surface} • Priority: {tp.priority} • Phase: {tp.phase}
                          {tp.notes && ` • Notes: ${tp.notes}`}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8' }}>
                            ${tp.estimatedCost.toFixed(2)}
                          </span>
                        </div>
                        <span className={`badge ${tp.acceptanceStatus === 'ACCEPTED' ? 'badge-success' : 'badge-warning'} text-xs`}>
                          {tp.acceptanceStatus}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: Labs */}
          {currentTab === 'LABS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 className="title-sm">Laboratory & Diagnostic Investigations</h4>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Test Name</th>
                      <th>Specimen / Modality</th>
                      <th>Result Summary</th>
                      <th>Flag</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientLabs.map(lab => (
                      <tr key={lab.id}>
                        <td className="font-mono text-xs">{lab.id}</td>
                        <td className="text-xs">{lab.orderDate}</td>
                        <td style={{ fontWeight: 600 }}>{lab.testName}</td>
                        <td className="text-dim text-xs">{lab.specimen}</td>
                        <td style={{ maxWidth: '280px', fontSize: '0.8rem' }}>
                          {lab.resultValue || 'Pending verification'}
                        </td>
                        <td>
                          {lab.abnormalFlag ? (
                            <span className="badge badge-danger text-xs">ABNORMAL</span>
                          ) : (
                            <span className="badge badge-success text-xs">NORMAL</span>
                          )}
                        </td>
                        <td>
                          <span className="badge badge-primary text-xs">{lab.status}</span>
                        </td>
                      </tr>
                    ))}
                    {patientLabs.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '20px' }}>
                          No lab tests or radiology investigations recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: Finance & Invoices */}
          {currentTab === 'FINANCE' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 className="title-sm">Invoices & Payment History</h4>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Invoice #</th>
                      <th>Date</th>
                      <th>Billed Amount</th>
                      <th>Paid</th>
                      <th>Outstanding</th>
                      <th>Payment Method</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientInvoices.map(inv => (
                      <tr key={inv.id}>
                        <td className="font-mono" style={{ fontWeight: 600, color: '#38bdf8' }}>
                          {inv.invoiceNumber}
                        </td>
                        <td>{inv.date}</td>
                        <td>${inv.grandTotal.toFixed(2)}</td>
                        <td style={{ color: '#10b981', fontWeight: 600 }}>${inv.paidAmount.toFixed(2)}</td>
                        <td style={{ color: inv.outstandingAmount > 0 ? '#f87171' : 'var(--text-dim)' }}>
                          ${inv.outstandingAmount.toFixed(2)}
                        </td>
                        <td>
                          <span className="badge badge-neutral text-xs">{inv.paymentMethod}</span>
                        </td>
                        <td>
                          <span className={`badge ${inv.status === 'PAID' ? 'badge-success' : inv.status === 'PARTIALLY_PAID' ? 'badge-warning' : 'badge-danger'} text-xs`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {patientInvoices.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '20px' }}>
                          No billing statements created for this patient yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: Audit */}
          {currentTab === 'AUDIT' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 className="title-sm">Access & Compliance Audit Trail</h4>
              {patientAudits.map(aud => (
                <div key={aud.id} style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.8rem'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="badge badge-info text-xs font-mono">{aud.action}</span>
                      <strong style={{ color: 'var(--text-main)' }}>{aud.entityType}</strong>
                      <span className="text-dim font-mono text-xs">({aud.timestamp})</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', marginTop: '3px' }}>
                      {aud.details}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {aud.actorName}
                    </div>
                    <span className="badge badge-neutral text-xs">{aud.actorRole}</span>
                  </div>
                </div>
              ))}
              {patientAudits.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-dim)' }}>
                  No historical mutations recorded for this patient.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={() => setActivePatient360Id(null)} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
