import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LabOrder } from '../../types';
import { 
  FlaskConical, Image, AlertCircle, CheckCircle2, 
  Search, Shield, Eye, Check, FileCheck
} from 'lucide-react';

export const DiagnosticsView: React.FC = () => {
  const { labOrders, updateLabResult, showToast } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const [resultInput, setResultInput] = useState('');
  const [abnormalToggle, setAbnormalToggle] = useState(false);
  const [viewingImaging, setViewingImaging] = useState<string | null>(null);

  const handleReleaseResult = (orderId: string) => {
    if (!resultInput.trim()) return;
    updateLabResult(orderId, resultInput.trim(), abnormalToggle);
    setSelectedOrder(null);
    setResultInput('');
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
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
          }}>
            <FlaskConical size={22} color="#ffffff" />
          </div>
          <div>
            <h1 className="title-lg">Diagnostic Pathology & Radiology (PACS)</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Specimen accession, automated analyzers, panic value flags & longitudinal imaging viewing.
            </p>
          </div>
        </div>
      </div>

      {/* Lab & Imaging Orders Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 className="title-md">Diagnostic Test Orders & Investigations</h3>
          <span className="badge badge-info text-xs">{labOrders.length} Total Orders</span>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Patient Details</th>
                <th>Investigation / Panel</th>
                <th>Specimen / Modality</th>
                <th>Result Summary & Reference Range</th>
                <th>Flag</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {labOrders.map(order => (
                <tr key={order.id}>
                  <td className="font-mono text-xs">{order.id}</td>
                  <td className="font-mono text-xs">{order.orderDate}</td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{order.patientName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Req by {order.doctorName}</div>
                  </td>
                  <td style={{ fontWeight: 600, maxWidth: '240px' }}>
                    {order.testName}
                  </td>
                  <td className="text-dim text-xs">{order.specimen}</td>
                  <td style={{ maxWidth: '300px', fontSize: '0.825rem' }}>
                    <div>{order.resultValue || <em className="text-dim">Awaiting verification...</em>}</div>
                    {order.referenceRange && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                        Ref: {order.referenceRange}
                      </div>
                    )}
                  </td>
                  <td>
                    {order.abnormalFlag ? (
                      <span className="badge badge-danger text-xs">CRITICAL / HIGH</span>
                    ) : order.resultValue ? (
                      <span className="badge badge-success text-xs">NORMAL</span>
                    ) : (
                      <span className="badge badge-neutral text-xs">PENDING</span>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-primary text-xs">{order.status}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {order.specimen.includes('Radiology') || order.testName.includes('CT') ? (
                        <button
                          onClick={() => setViewingImaging(order.id)}
                          className="btn btn-secondary btn-sm"
                          title="Open DICOM PACS Image Viewer"
                        >
                          <Image size={13} />
                          <span>PACS</span>
                        </button>
                      ) : null}

                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setResultInput(order.resultValue || '');
                          setAbnormalToggle(order.abnormalFlag || false);
                        }}
                        className="btn btn-primary btn-sm"
                      >
                        Enter Result
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Result Entry Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="title-md">Release Verified Lab Result</h3>
              <button onClick={() => setSelectedOrder(null)} className="btn btn-ghost btn-sm">✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <strong>Test:</strong> {selectedOrder.testName}<br />
                <strong>Patient:</strong> {selectedOrder.patientName} • Specimen: {selectedOrder.specimen}
              </div>

              <div className="form-group">
                <label className="form-label">Analyzer Result Value *</label>
                <textarea
                  rows={3}
                  value={resultInput}
                  onChange={e => setResultInput(e.target.value)}
                  className="textarea font-mono text-sm"
                  placeholder="Enter numerical values and units..."
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="abnormalFlagCheck"
                  checked={abnormalToggle}
                  onChange={e => setAbnormalToggle(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="abnormalFlagCheck" style={{ fontSize: '0.85rem', color: '#f87171', fontWeight: 600, cursor: 'pointer' }}>
                  Flag as Critical Panic Value (Breaches Clinical Threshold)
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setSelectedOrder(null)} className="btn btn-ghost">Cancel</button>
              <button onClick={() => handleReleaseResult(selectedOrder.id)} className="btn btn-primary">
                Release & Authorize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated DICOM PACS Viewer Modal */}
      {viewingImaging && (
        <div className="modal-overlay" onClick={() => setViewingImaging(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '780px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Image size={18} color="#06b6d4" />
                <h3 className="title-md">Diagnostic Imaging Workstation (DICOM PACS)</h3>
              </div>
              <button onClick={() => setViewingImaging(null)} className="btn btn-ghost btn-sm">✕</button>
            </div>
            <div className="modal-body" style={{ background: '#000000', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
              {/* Simulated high-contrast radiographic window */}
              <div style={{
                width: '100%',
                height: '380px',
                background: 'radial-gradient(circle at center, #1e293b 0%, #090d16 100%)',
                border: '1px solid #334155',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', top: '12px', left: '16px', textAlign: 'left', fontSize: '0.725rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                  <div>PATIENT: LIAM O'CONNOR (#NX-8825)</div>
                  <div>STUDY: CRANIAL CT NON-CONTRAST</div>
                  <div>ACQUISITION: 120kV / 250mAs • 1.25mm SLICES</div>
                  <div>WINDOW: BRAIN / BONE (WW 80 / WL 40)</div>
                </div>

                <div style={{ position: 'absolute', top: '12px', right: '16px', textAlign: 'right', fontSize: '0.725rem', color: '#10b981', fontFamily: 'monospace' }}>
                  <div>MODALITY: SIEMENS SOMATOM DEFINITION</div>
                  <div>STATUS: COMPLETE & APPROVED</div>
                </div>

                {/* SVG Brain Contour Simulation */}
                <svg viewBox="0 0 200 200" style={{ width: '220px', height: '220px' }}>
                  {/* Calvarium / Skull */}
                  <circle cx="100" cy="100" r="85" fill="none" stroke="#f8fafc" strokeWidth="8" opacity="0.85" />
                  {/* Brain parenchyma */}
                  <ellipse cx="100" cy="100" rx="76" ry="76" fill="#334155" opacity="0.6" />
                  {/* Lateral Ventricles */}
                  <path d="M 85 80 Q 90 100 85 120 Q 92 100 85 80" fill="#0f172a" />
                  <path d="M 115 80 Q 110 100 115 120 Q 108 100 115 80" fill="#0f172a" />
                  {/* Midline Falx Cerebri */}
                  <line x1="100" y1="20" x2="100" y2="180" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 2" />
                </svg>

                <div style={{ position: 'absolute', bottom: '12px', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600 }}>
                  ✓ Radiologist Finding: Intracranial structures symmetric. No calvarial fracture or hemorrhage.
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setViewingImaging(null)} className="btn btn-secondary">
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
