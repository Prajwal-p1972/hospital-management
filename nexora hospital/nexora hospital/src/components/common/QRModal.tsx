import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../../context/AppContext';
import { Patient } from '../../types';
import { X, Printer, Shield, CheckCircle, Search, QrCode as QrIcon } from 'lucide-react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
}

export const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose, patient }) => {
  const { patients, setActivePatient360Id, showToast } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanInput, setScanInput] = useState('');
  const [activeTab, setActiveTab] = useState<'CARD' | 'SCANNER'>('CARD');

  // If a patient is provided, render QR on canvas
  useEffect(() => {
    if (patient && canvasRef.current && activeTab === 'CARD') {
      QRCode.toCanvas(
        canvasRef.current,
        patient.qrToken,
        {
          width: 180,
          margin: 1,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        },
        (error) => {
          if (error) console.error(error);
        }
      );
    }
  }, [patient, activeTab]);

  if (!isOpen) return null;

  const handleScanLookup = () => {
    const trimmed = scanInput.trim();
    if (!trimmed) return;

    // Search by QR token or MRN
    const matched = patients.find(p => 
      p.qrToken.toLowerCase() === trimmed.toLowerCase() || 
      p.mrn.toLowerCase() === trimmed.toLowerCase()
    );

    if (matched) {
      showToast(`QR Token Verified: Authorized lookup for ${matched.name}`, 'success');
      setActivePatient360Id(matched.id);
      onClose();
    } else {
      showToast(`No registered patient matches token "${trimmed}"`, 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <QrIcon size={20} color="#38bdf8" />
            <h3 className="title-md">
              {activeTab === 'CARD' ? 'Patient QR Identity Card' : 'QR Token Scanner & Lookup'}
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <X size={18} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 24px'
        }}>
          <button
            onClick={() => setActiveTab('CARD')}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'CARD' ? '2px solid #38bdf8' : '2px solid transparent',
              color: activeTab === 'CARD' ? '#38bdf8' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Digital QR Pass
          </button>
          <button
            onClick={() => setActiveTab('SCANNER')}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'SCANNER' ? '2px solid #38bdf8' : '2px solid transparent',
              color: activeTab === 'SCANNER' ? '#38bdf8' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Scanner Simulator
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'CARD' ? (
            patient ? (
              <div style={{
                background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '20px',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
                color: '#ffffff'
              }}>
                {/* Card Top */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontSize: '0.675rem', textTransform: 'uppercase', color: '#38bdf8', letterSpacing: '0.08em', fontWeight: 700 }}>
                      NEXORA CareOS • Patient Health Pass
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                      {patient.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      MRN: <span className="font-mono" style={{ color: '#f8fafc', fontWeight: 600 }}>{patient.mrn}</span>
                    </div>
                  </div>
                  <span className="badge badge-success text-xs">VERIFIED</span>
                </div>

                {/* Card Middle: QR Code & Key Facts */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{
                    background: '#ffffff',
                    padding: '8px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                  }}>
                    <canvas ref={canvasRef} style={{ width: '150px', height: '150px' }} />
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>DATE OF BIRTH / AGE</span>
                      <span style={{ fontWeight: 600 }}>{patient.dob} ({patient.age} yrs, {patient.gender})</span>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>BLOOD GROUP</span>
                      <span className="badge badge-danger text-xs font-mono">{patient.bloodGroup}</span>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>EMERGENCY CONTACT</span>
                      <span style={{ fontWeight: 500 }}>{patient.emergencyContact.name} ({patient.emergencyContact.relationship})</span>
                      <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>{patient.emergencyContact.phone}</div>
                    </div>
                  </div>
                </div>

                {/* Privacy Badge */}
                <div style={{
                  marginTop: '16px',
                  padding: '8px 12px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.72rem',
                  color: '#94a3b8'
                }}>
                  <Shield size={14} color="#10b981" />
                  <span>
                    Privacy Shield: Encodes token <code style={{ color: '#38bdf8' }}>{patient.qrToken}</code>. Medical data is securely fetched only upon authorized staff authentication.
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                No patient currently selected.
              </div>
            )
          ) : (
            /* Scanner Simulator */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: 'var(--bg-input)',
                border: '1px dashed var(--border-bright)',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <QrIcon size={48} color="#38bdf8" style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '6px' }}>
                  Simulate QR Scanner / Optical Gun
                </h4>
                <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Scan the physical barcode or paste a privacy token / MRN to instantly open Patient 360 records.
                </p>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Enter QR token (e.g. nxp_tok_8821_jm84) or MRN..."
                    value={scanInput}
                    onChange={e => setScanInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleScanLookup()}
                    className="input font-mono"
                    autoFocus
                  />
                  <button onClick={handleScanLookup} className="btn btn-primary">
                    <Search size={16} />
                    <span>Lookup</span>
                  </button>
                </div>
              </div>

              {/* Fast Test Chips */}
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>
                  Quick Test Demo Tokens:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {patients.slice(0, 4).map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setScanInput(p.qrToken);
                      }}
                      className="btn btn-secondary btn-sm font-mono"
                      style={{ fontSize: '0.7rem' }}
                    >
                      {p.name.split(' ')[0]}: {p.qrToken}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {activeTab === 'CARD' && patient && (
            <button onClick={handlePrint} className="btn btn-secondary">
              <Printer size={16} />
              <span>Print Health Pass</span>
            </button>
          )}
          <button onClick={onClose} className="btn btn-ghost">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
