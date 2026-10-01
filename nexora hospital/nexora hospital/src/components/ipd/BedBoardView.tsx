import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bed, WardType, BedStatus } from '../../types';
import { 
  BedDouble, ArrowRightLeft, LogOut, CheckCircle2, 
  Sparkles, AlertCircle, Clock, Shield, Plus
} from 'lucide-react';

export const BedBoardView: React.FC = () => {
  const { 
    beds, updateBedStatus, transferPatientBed, dischargePatientFromBed, 
    patients, setActivePatient360Id, showToast 
  } = useApp();

  const [selectedWard, setSelectedWard] = useState<string>('ALL');
  const [transferSourceBed, setTransferSourceBed] = useState<Bed | null>(null);
  const [targetBedId, setTargetBedId] = useState<string>('');

  const wardTypes: { key: WardType; label: string }[] = [
    { key: 'ICU', label: 'Intensive Care Unit (ICU)' },
    { key: 'EMERGENCY_TRAUMA', label: 'Emergency Trauma Bays' },
    { key: 'GENERAL_MALE', label: 'General Ward - Male' },
    { key: 'GENERAL_FEMALE', label: 'General Ward - Female' },
    { key: 'DELUXE', label: 'Deluxe Private Suites' },
    { key: 'DAY_CARE', label: 'Day Care Observation' }
  ];

  const filteredBeds = selectedWard === 'ALL' 
    ? beds 
    : beds.filter(b => b.ward === selectedWard);

  const occupiedCount = beds.filter(b => b.status === 'OCCUPIED').length;
  const availableCount = beds.filter(b => b.status === 'AVAILABLE').length;
  const cleaningCount = beds.filter(b => b.status === 'CLEANING').length;
  const maintenanceCount = beds.filter(b => b.status === 'MAINTENANCE' || b.status === 'RESERVED').length;

  const handleExecuteTransfer = () => {
    if (!transferSourceBed || !targetBedId) return;
    transferPatientBed(transferSourceBed.id, targetBedId);
    setTransferSourceBed(null);
    setTargetBedId('');
  };

  const getStatusBadge = (status: BedStatus) => {
    switch (status) {
      case 'AVAILABLE': return <span className="badge badge-success text-xs">AVAILABLE</span>;
      case 'OCCUPIED': return <span className="badge badge-danger text-xs">OCCUPIED</span>;
      case 'CLEANING': return <span className="badge badge-warning text-xs">CLEANING</span>;
      case 'MAINTENANCE': return <span className="badge badge-neutral text-xs">MAINTENANCE</span>;
      case 'RESERVED': return <span className="badge badge-info text-xs">RESERVED</span>;
    }
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
            background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BedDouble size={22} color="#ffffff" />
          </div>
          <div>
            <h1 className="title-lg">IPD Inpatient Census & Visual Bed Board</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Total Capacity: <strong>{beds.length} Beds</strong> • Occupancy: <strong>{Math.round((occupiedCount / beds.length) * 100)}%</strong>
            </p>
          </div>
        </div>

        {/* Quick Census Metrics */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <div className="badge badge-danger text-xs">{occupiedCount} Occupied</div>
          <div className="badge badge-success text-xs">{availableCount} Available</div>
          <div className="badge badge-warning text-xs">{cleaningCount} In Sanitation</div>
          {maintenanceCount > 0 && <div className="badge badge-neutral text-xs">{maintenanceCount} Maintenance</div>}
        </div>
      </div>

      {/* Ward Filter Bar */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          onClick={() => setSelectedWard('ALL')}
          className={`btn btn-sm ${selectedWard === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
        >
          All Wards ({beds.length})
        </button>
        {wardTypes.map(w => {
          const count = beds.filter(b => b.ward === w.key).length;
          return (
            <button
              key={w.key}
              onClick={() => setSelectedWard(w.key)}
              className={`btn btn-sm ${selectedWard === w.key ? 'btn-primary' : 'btn-secondary'}`}
            >
              {w.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Bed Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {filteredBeds.map(bed => {
          const isOccupied = bed.status === 'OCCUPIED';
          const isAvailable = bed.status === 'AVAILABLE';
          const isCleaning = bed.status === 'CLEANING';

          return (
            <div
              key={bed.id}
              className="card"
              style={{
                borderLeft: `5px solid ${
                  isOccupied ? '#ef4444' : isAvailable ? '#10b981' : isCleaning ? '#fbbf24' : '#64748b'
                }`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '170px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BedDouble size={16} color={isOccupied ? '#f87171' : '#38bdf8'} />
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: '#f8fafc' }} className="font-mono">
                      {bed.number}
                    </span>
                  </div>
                  {getStatusBadge(bed.status)}
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {bed.ward.replace(/_/g, ' ')}
                </div>

                {isOccupied ? (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                      {bed.currentPatientName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#38bdf8' }} className="font-mono">
                      MRN: {bed.currentPatientMrn}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                      Admitted: {bed.admittedAt?.substring(0, 10) || '2026-09-01'}
                    </div>
                  </div>
                ) : isCleaning ? (
                  <div style={{ marginTop: '16px', fontSize: '0.8rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} />
                    <span>Housekeeping active: Terminal sterilization in progress</span>
                  </div>
                ) : (
                  <div style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    Ready for new inpatient admission.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '16px',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '10px'
              }}>
                {isOccupied && (
                  <>
                    <button
                      onClick={() => setTransferSourceBed(bed)}
                      className="btn btn-secondary btn-sm"
                      title="Transfer patient to another bed / ward"
                    >
                      <ArrowRightLeft size={13} />
                      <span>Transfer</span>
                    </button>
                    <button
                      onClick={() => dischargePatientFromBed(bed.id)}
                      className="btn btn-danger btn-sm"
                      title="Discharge patient"
                    >
                      <LogOut size={13} />
                      <span>Discharge</span>
                    </button>
                    {bed.currentPatientId && (
                      <button
                        onClick={() => setActivePatient360Id(bed.currentPatientId!)}
                        className="btn btn-ghost btn-sm"
                      >
                        360
                      </button>
                    )}
                  </>
                )}

                {isCleaning && (
                  <button
                    onClick={() => updateBedStatus(bed.id, 'AVAILABLE')}
                    className="btn btn-success btn-sm"
                    style={{ width: '100%' }}
                  >
                    <CheckCircle2 size={14} />
                    <span>Sanitation Completed → Set Available</span>
                  </button>
                )}

                {isAvailable && (
                  <button
                    onClick={() => {
                      const candidate = patients.find(p => p.patientType === 'IPD' || p.patientType === 'EMERGENCY');
                      if (candidate) {
                        updateBedStatus(bed.id, 'OCCUPIED', candidate.id, candidate.name, candidate.mrn);
                      }
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                  >
                    <span>Allocate Patient</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Transfer Bed Modal */}
      {transferSourceBed && (
        <div className="modal-overlay" onClick={() => setTransferSourceBed(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 className="title-md">Transfer Patient Location</h3>
              <button onClick={() => setTransferSourceBed(null)} className="btn btn-ghost btn-sm">✕</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '16px' }}>
                <strong>Patient:</strong> {transferSourceBed.currentPatientName} ({transferSourceBed.currentPatientMrn})<br />
                <strong>Current Bed:</strong> {transferSourceBed.number} ({transferSourceBed.ward})
              </div>

              <div className="form-group">
                <label className="form-label">Select Target Available Bed:</label>
                <select
                  value={targetBedId}
                  onChange={e => setTargetBedId(e.target.value)}
                  className="select font-mono"
                >
                  <option value="">-- Choose Target Bed --</option>
                  {beds.filter(b => b.status === 'AVAILABLE').map(b => (
                    <option key={b.id} value={b.id}>
                      {b.number} - {b.ward.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setTransferSourceBed(null)} className="btn btn-ghost">Cancel</button>
              <button
                disabled={!targetBedId}
                onClick={handleExecuteTransfer}
                className="btn btn-primary"
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
