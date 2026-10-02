import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ToothChart32 } from './ToothChart32';
import { ToothSurface, ToothFindingType, TreatmentPlanItem } from '../../types';
import { 
  Sparkles, CheckCircle, Clock, AlertTriangle, Plus, 
  DollarSign, FileText, ChevronRight, Check, Send, 
  RefreshCw, User, Stethoscope, BedDouble
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DentalWorkspace: React.FC = () => {
  const { 
    teethRecords, treatmentPlans, operatoryChairs, dentalLabCases, 
    dentalRecalls, updateToothFinding, updateTreatmentPlanStatus, 
    convertPlanToInvoice, patients, showToast, setActivePatient360Id 
  } = useApp();

  const [selectedToothNum, setSelectedToothNum] = useState<number>(14); // Default to tooth #14 with active caries
  const [notation, setNotation] = useState<'UNIVERSAL' | 'FDI'>('UNIVERSAL');
  const [activeTab, setActiveTab] = useState<'CHART_PLANNER' | 'OPERATORY' | 'LAB_CASES' | 'RECALLS'>('CHART_PLANNER');

  // Surface & Finding inputs
  const [selectedSurface, setSelectedSurface] = useState<ToothSurface>('O');
  const [findingType, setFindingType] = useState<ToothFindingType>('CARIES');
  const [findingNotes, setFindingNotes] = useState('');

  const selectedTooth = teethRecords.find(t => t.toothNumber === selectedToothNum);

  const handleAddFinding = () => {
    if (!selectedToothNum) return;
    updateToothFinding(selectedToothNum, selectedSurface, findingType, findingNotes);
    setFindingNotes('');
  };

  const handleAcceptPlan = (plan: TreatmentPlanItem) => {
    updateTreatmentPlanStatus(plan.id, 'ACCEPTED');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
          }}>
            <Sparkles size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 className="title-lg">CareOS Dental Practice Suite</h1>
              <span className="badge badge-purple text-xs">First-Class Dedicated Edition</span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Tooth-by-tooth digital charting, surface findings, multi-phase treatment planning, operatory chairs & dental lab tracking.
            </p>
          </div>
        </div>

        {/* Notation switch & Tab toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '3px'
          }}>
            <button
              onClick={() => setNotation('UNIVERSAL')}
              style={{
                background: notation === 'UNIVERSAL' ? '#a855f7' : 'transparent',
                color: notation === 'UNIVERSAL' ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Universal (1-32)
            </button>
            <button
              onClick={() => setNotation('FDI')}
              style={{
                background: notation === 'FDI' ? '#a855f7' : 'transparent',
                color: notation === 'FDI' ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              FDI (11-48)
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-subtle)',
        gap: '8px'
      }}>
        {[
          { key: 'CHART_PLANNER', label: 'Dental Chart & Treatment Planner' },
          { key: 'OPERATORY', label: `Operatory Chairs (${operatoryChairs.length})` },
          { key: 'LAB_CASES', label: `Prosthesis Lab Tracking (${dentalLabCases.length})` },
          { key: 'RECALLS', label: `Hygiene & Recalls (${dentalRecalls.length})` }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid #a855f7' : '2px solid transparent',
              color: activeTab === tab.key ? '#c084fc' : 'var(--text-muted)',
              fontWeight: activeTab === tab.key ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Digital Chart & Treatment Planner */}
      {activeTab === 'CHART_PLANNER' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Visual 32-Tooth Anatomical Chart */}
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 className="title-md">Digital Dental Chart (Select any tooth to inspect / record)</h3>
              {/* Legend */}
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.725rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} /> Caries
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4' }} /> Restoration
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} /> Crown
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7' }} /> Root Canal
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#64748b' }} /> Missing
                </span>
              </div>
            </div>

            <ToothChart32
              selectedTooth={selectedToothNum}
              onSelectTooth={num => setSelectedToothNum(num)}
              notation={notation}
            />
          </div>

          {/* Bottom Grid: Tooth Findings Recorder & Treatment Plan Board */}
          <div className="grid-split-dental">
            {/* Tooth Findings Inspector & Recorder */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                <div>
                  <span className="badge badge-purple text-xs font-mono">
                    Tooth #{selectedToothNum} ({notation === 'UNIVERSAL' ? `Universal ${selectedToothNum}` : `FDI ${selectedTooth?.fdiNumber}`})
                  </span>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginTop: '4px' }}>
                    {selectedTooth?.name}
                  </h4>
                </div>
              </div>

              {/* Surface Selector Buttons */}
              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">Select Surface:</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[
                    { id: 'O', label: 'Occlusal (O)' },
                    { id: 'M', label: 'Mesial (M)' },
                    { id: 'D', label: 'Distal (D)' },
                    { id: 'B', label: 'Buccal / Facial (B)' },
                    { id: 'L', label: 'Lingual (L)' },
                    { id: 'ALL', label: 'Entire Tooth' }
                  ].map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSurface(s.id as ToothSurface)}
                      style={{
                        flex: 1,
                        padding: '6px 4px',
                        background: selectedSurface === s.id ? '#a855f7' : 'var(--bg-input)',
                        color: selectedSurface === s.id ? '#ffffff' : 'var(--text-muted)',
                        border: selectedSurface === s.id ? '1px solid #c084fc' : '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {s.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clinical Finding Palette */}
              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">Clinical Finding / Condition:</label>
                <select
                  value={findingType}
                  onChange={e => setFindingType(e.target.value as ToothFindingType)}
                  className="select"
                >
                  <option value="CARIES">Dental Caries / Cavity (Decay)</option>
                  <option value="RESTORATION">Existing Restoration (Composite/Amalgam)</option>
                  <option value="CROWN">Full Crown / Cap</option>
                  <option value="ROOT_CANAL">Root Canal Treated (Endodontic)</option>
                  <option value="MISSING">Missing Tooth (Extracted)</option>
                  <option value="IMPLANT">Implant Fixture</option>
                  <option value="FRACTURE">Tooth Fracture / Crack</option>
                  <option value="PERIODONTAL">Periodontal Pocket (&gt;4mm)</option>
                  <option value="SOUND">Sound / Healthy</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Clinical Notes & Findings:</label>
                <input
                  type="text"
                  placeholder="e.g. Cold sensitivity, deep cavitation on distal marginal ridge"
                  value={findingNotes}
                  onChange={e => setFindingNotes(e.target.value)}
                  className="input text-sm"
                />
              </div>

              <button
                type="button"
                onClick={handleAddFinding}
                className="btn btn-primary"
                style={{ width: '100%', background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)' }}
              >
                <Plus size={16} />
                <span>Record Finding & Propose Plan</span>
              </button>

              {/* Current Findings on Selected Tooth */}
              <div style={{ marginTop: '18px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Recorded Findings on Tooth #{selectedToothNum}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                  {selectedTooth?.findings.map(f => (
                    <div key={f.id} style={{
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.78rem'
                    }}>
                      <div>
                        <strong style={{ color: '#c084fc' }}>{f.findingType}</strong>
                        <span className="text-dim"> ({f.surface})</span>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{f.notes}</div>
                      </div>
                      <span className="text-dim font-mono text-xs">{f.date}</span>
                    </div>
                  ))}
                  {(!selectedTooth || selectedTooth.findings.length === 0) && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                      No pathology recorded on this tooth yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Treatment Plan & Patient Acceptance Board */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h4 className="title-md">Dental Treatment Plans & Financial Estimates</h4>
                  <span className="text-xs text-muted">Itemized procedures, patient acceptance & 1-click billing</span>
                </div>
                <span className="badge badge-success text-xs font-mono">
                  ${treatmentPlans.filter(p => p.acceptanceStatus === 'ACCEPTED').reduce((s, p) => s + p.estimatedCost, 0).toFixed(2)} Accepted
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
                {treatmentPlans.map(plan => {
                  const targetPatient = patients.find(p => p.id === plan.patientId) || patients[0];

                  return (
                    <div key={plan.id} style={{
                      background: 'var(--bg-card-hover)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="badge badge-purple font-mono text-xs">
                              {plan.toothNumber > 0 ? `Tooth #${plan.toothNumber}` : 'Full Mouth'}
                            </span>
                            <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                              {plan.procedureName}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                            Patient: <strong>{targetPatient.name}</strong> ({targetPatient.mrn}) • Code: <code className="font-mono text-primary">{plan.procedureCode}</code>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>
                            ${plan.estimatedCost.toFixed(2)}
                          </span>
                          <div>
                            <span className={`badge ${
                              plan.acceptanceStatus === 'ACCEPTED' ? 'badge-success' :
                              plan.acceptanceStatus === 'COMPLETED' ? 'badge-primary' : 'badge-warning'
                            } text-xs`}>
                              {plan.acceptanceStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px dashed var(--border-subtle)',
                        paddingTop: '8px'
                      }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                          Phase: <strong>{plan.phase}</strong> • Priority: <strong>{plan.priority}</strong>
                        </span>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          {plan.acceptanceStatus === 'PENDING' && (
                            <button
                              onClick={() => handleAcceptPlan(plan)}
                              className="btn btn-success btn-sm"
                            >
                              <Check size={14} />
                              <span>Accept Plan</span>
                            </button>
                          )}

                          {plan.acceptanceStatus === 'ACCEPTED' && (
                            <button
                              onClick={() => convertPlanToInvoice(plan)}
                              className="btn btn-primary btn-sm"
                              title="Generate Invoice & send to cashier"
                            >
                              <DollarSign size={14} />
                              <span>Convert to Invoice</span>
                            </button>
                          )}

                          {plan.acceptanceStatus === 'COMPLETED' && (
                            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                              ✓ Invoiced & Added to Ledger
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Operatory Chairs */}
      {activeTab === 'OPERATORY' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {operatoryChairs.map(chair => (
            <div key={chair.id} className="card" style={{
              borderLeft: `4px solid ${chair.status === 'OCCUPIED' ? '#ef4444' : chair.status === 'AVAILABLE' ? '#10b981' : '#fbbf24'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{chair.name}</h4>
                <span className={`badge ${
                  chair.status === 'AVAILABLE' ? 'badge-success' : chair.status === 'OCCUPIED' ? 'badge-danger' : 'badge-warning'
                } text-xs`}>
                  {chair.status}
                </span>
              </div>

              {chair.status === 'OCCUPIED' ? (
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div><strong>Attending:</strong> {chair.currentDoctor}</div>
                  <div><strong>Patient:</strong> {chair.currentPatient}</div>
                  <div><strong>Active Procedure:</strong> {chair.currentProcedure}</div>
                  <div style={{ color: '#38bdf8', marginTop: '4px' }}>Started: {chair.startTime}</div>
                </div>
              ) : (
                <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                  Chair is sanitized, equipped, and ready for next appointment.
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Dental Prosthesis Lab Cases */}
      {activeTab === 'LAB_CASES' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="title-md">Dental Laboratory & Prosthetics Tracking</h3>
            <span className="badge badge-info text-xs">Apex Ceramics & AlignTech</span>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Patient</th>
                  <th>Prosthesis Item</th>
                  <th>Tooth #</th>
                  <th>Shade Guide</th>
                  <th>Lab Partner</th>
                  <th>Sent Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dentalLabCases.map(c => (
                  <tr key={c.id}>
                    <td className="font-mono text-xs">{c.id}</td>
                    <td style={{ fontWeight: 600 }}>{c.patientName}</td>
                    <td>{c.itemType.replace(/_/g, ' ')}</td>
                    <td className="font-mono text-primary">#{c.toothNumber || 'Full'}</td>
                    <td><span className="badge badge-neutral font-mono text-xs">{c.shade}</span></td>
                    <td className="text-dim">{c.labName}</td>
                    <td className="font-mono text-xs">{c.sentDate}</td>
                    <td className="font-mono text-xs" style={{ fontWeight: 600, color: '#38bdf8' }}>{c.dueDate}</td>
                    <td>
                      <span className={`badge ${c.status === 'RECEIVED' ? 'badge-success' : 'badge-warning'} text-xs`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Recalls */}
      {activeTab === 'RECALLS' && (
        <div className="card">
          <h3 className="title-md" style={{ marginBottom: '14px' }}>Automated Recall & Hygiene Maintenance</h3>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Recall ID</th>
                  <th>Patient Name</th>
                  <th>Recall Reason</th>
                  <th>Last Visit</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dentalRecalls.map(r => (
                  <tr key={r.id}>
                    <td className="font-mono text-xs">{r.id}</td>
                    <td style={{ fontWeight: 600 }}>{r.patientName}</td>
                    <td>{r.recallReason.replace(/_/g, ' ')}</td>
                    <td className="font-mono text-xs">{r.lastVisitDate}</td>
                    <td className="font-mono text-xs" style={{ fontWeight: 700, color: r.status === 'OVERDUE' ? '#ef4444' : '#38bdf8' }}>
                      {r.dueDate}
                    </td>
                    <td>
                      <span className={`badge ${r.status === 'OVERDUE' ? 'badge-danger' : 'badge-primary'} text-xs`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => showToast(`Automated SMS / WhatsApp hygiene reminder dispatched to ${r.patientName}`, 'success')}
                        className="btn btn-secondary btn-sm"
                      >
                        <Send size={13} />
                        <span>Send Reminder</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
