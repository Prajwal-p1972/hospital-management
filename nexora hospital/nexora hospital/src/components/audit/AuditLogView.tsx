import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditEvent } from '../../types';
import { 
  ShieldCheck, Search, Filter, Lock, FileText, 
  Clock, User, CheckCircle
} from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditEvents } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredEvents = auditEvents.filter(a => {
    const matchSearch = a.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        a.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        a.entityId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchAction = actionFilter === 'ALL' || a.action === actionFilter;
    return matchSearch && matchAction;
  });

  const getActionBadge = (action: AuditEvent['action']) => {
    switch (action) {
      case 'FINALIZE': return <span className="badge badge-success font-mono text-xs">FINALIZE</span>;
      case 'CREATE': return <span className="badge badge-primary font-mono text-xs">CREATE</span>;
      case 'UPDATE': return <span className="badge badge-warning font-mono text-xs">UPDATE</span>;
      case 'VOID': return <span className="badge badge-danger font-mono text-xs">VOID</span>;
      case 'DELETE': return <span className="badge badge-danger font-mono text-xs">DELETE</span>;
      case 'VIEW': return <span className="badge badge-neutral font-mono text-xs">VIEW</span>;
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
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
          }}>
            <ShieldCheck size={22} color="#ffffff" />
          </div>
          <div>
            <h1 className="title-lg">Enterprise Audit Trail & Immutable Compliance Log</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              HIPAA / GDPR tamper-evident audit logging for all patient, clinical prescription, and financial transactions.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={15} color="#10b981" />
          <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>
            Append-Only Secure Store
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Filter audit entries by actor, entity ID, or details..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="input text-sm"
          style={{ width: '380px' }}
        />

        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'FINALIZE', 'CREATE', 'UPDATE', 'VOID'].map(act => (
            <button
              key={act}
              onClick={() => setActionFilter(act)}
              className={`btn btn-sm ${actionFilter === act ? 'btn-primary' : 'btn-secondary'}`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp (UTC)</th>
                <th>Actor Identity & Role</th>
                <th>Action</th>
                <th>Entity Type</th>
                <th>Entity Target ID</th>
                <th>Cryptographic / Audit Details</th>
                <th>Facility Context</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(evt => (
                <tr key={evt.id}>
                  <td className="font-mono text-xs">{evt.timestamp}</td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{evt.actorName}</div>
                    <span className="badge badge-neutral text-xs" style={{ fontSize: '0.65rem' }}>{evt.actorRole}</span>
                  </td>
                  <td>{getActionBadge(evt.action)}</td>
                  <td>
                    <span className="badge badge-primary font-mono text-xs">{evt.entityType}</span>
                  </td>
                  <td className="font-mono text-xs text-primary">{evt.entityId}</td>
                  <td style={{ maxWidth: '380px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {evt.details}
                  </td>
                  <td className="font-mono text-xs text-dim">{evt.facility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
