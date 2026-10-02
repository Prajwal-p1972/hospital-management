import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataPipeline } from '../../types';
import { 
  Database, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, 
  GitBranch, Server, Cpu, Layers, Activity, Search
} from 'lucide-react';

export const DataEngineeringHub: React.FC = () => {
  const { pipelines, showToast } = useApp();
  const [activeLayer, setActiveLayer] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const layers = ['RAW', 'STAGING', 'CORE_WAREHOUSE', 'MARTS', 'SEMANTIC'];

  const filteredPipelines = pipelines.filter(p => {
    const matchLayer = activeLayer === 'ALL' || p.layer === activeLayer;
    const matchQuery = p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       p.owner.toLowerCase().includes(searchQuery.toLowerCase());
    return matchLayer && matchQuery;
  });

  const handleTriggerPipeline = (code: string) => {
    showToast(`Triggered on-demand idempotent run for pipeline [${code}]`, 'success');
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
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(2, 132, 199, 0.4)'
          }}>
            <Database size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 className="title-lg">Data Engineering & Lakehouse Orchestration Hub</h1>
              <span className="badge badge-primary text-xs">DE-01 to DE-12 Work Packages</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Canonical Healthcare Schema, CDC event contracts, dbt marts, surrogate keys & zero-drift idempotent pipelines.
            </p>
          </div>
        </div>

        <button
          onClick={() => showToast('Triggered full warehouse dimensional sync & SLA audit', 'info')}
          className="btn btn-secondary btn-sm"
        >
          <RefreshCw size={14} />
          <span>Sync All DAGs</span>
        </button>
      </div>

      {/* Lakehouse Architectural Topology Diagram Card */}
      <div className="card" style={{ padding: '18px 24px' }}>
        <h3 className="title-md" style={{ marginBottom: '14px' }}>
          Canonical Source-to-Analytics Architecture (Lakehouse Topology)
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          alignItems: 'stretch'
        }}>
          {/* Node 1: Ingestion */}
          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
              <Server size={14} />
              <span>1. SOURCE & CDC</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              HMS Postgres transactional OLTP, Dental module, Debezium CDC change streams, LIS/RIS APIs.
            </div>
            <span className="badge badge-info text-xs" style={{ marginTop: '10px' }}>DE-01, DE-02, DE-03</span>
          </div>

          {/* Node 2: Raw / Staging */}
          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#818cf8', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
              <Layers size={14} />
              <span>2. RAW & STAGING</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Immutable landing zone, type normalization, deduplication, schema validation & field tokenization.
            </div>
            <span className="badge badge-purple text-xs" style={{ marginTop: '10px' }}>DE-03, DE-08</span>
          </div>

          {/* Node 3: Core Lakehouse Warehouse */}
          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a855f7', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
              <Database size={14} />
              <span>3. CORE WAREHOUSE</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Conformed Star Schema: FactEncounters, FactAppointments, DimPatient, DimProvider, SCD Type 2 history.
            </div>
            <span className="badge badge-purple text-xs" style={{ marginTop: '10px' }}>DE-04, DE-09</span>
          </div>

          {/* Node 4: Data Marts */}
          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
              <Cpu size={14} />
              <span>4. DOMAIN MARTS</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Marts for Patient Ops, Dental, Financial Revenue, Pharmacy & Bed Occupancy. Modular dbt transformations.
            </div>
            <span className="badge badge-success text-xs" style={{ marginTop: '10px' }}>DE-05, DE-07</span>
          </div>

          {/* Node 5: Semantic & BI */}
          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
              <Activity size={14} />
              <span>5. SEMANTIC / AI</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Governed metrics dictionary, automated DQ rules, AI/ML feature store & de-identified research snapshots.
            </div>
            <span className="badge badge-warning text-xs" style={{ marginTop: '10px' }}>DE-06, DE-10, DE-12</span>
          </div>
        </div>
      </div>

      {/* Pipeline Work Packages Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 className="title-md">Production Work Packages Registry (DE-01 through DE-12)</h3>
            <span className="text-xs text-muted">Real-time status, latency, idempotency & records loaded</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveLayer('ALL')}
              className={`btn btn-sm ${activeLayer === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All Layers
            </button>
            {layers.map(l => (
              <button
                key={l}
                onClick={() => setActiveLayer(l)}
                className={`btn btn-sm ${activeLayer === l ? 'btn-primary' : 'btn-secondary'}`}
              >
                {l.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Package ID</th>
                <th>Work Package Name</th>
                <th>Lakehouse Layer</th>
                <th>Owner / Team</th>
                <th>Refresh Mode</th>
                <th>Latency (SLA)</th>
                <th>Records Loaded</th>
                <th>Dead Letters</th>
                <th>Idempotency</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPipelines.map(pipe => (
                <tr key={pipe.id}>
                  <td className="font-mono text-xs" style={{ fontWeight: 800, color: '#38bdf8' }}>
                    {pipe.code}
                  </td>
                  <td style={{ fontWeight: 600 }}>{pipe.name}</td>
                  <td>
                    <span className="badge badge-neutral font-mono text-xs">{pipe.layer}</span>
                  </td>
                  <td className="text-dim text-xs">{pipe.owner}</td>
                  <td className="font-mono text-xs">{pipe.refreshMode}</td>
                  <td className="font-mono text-xs" style={{ color: pipe.latencySeconds > 10 ? '#fbbf24' : '#34d399' }}>
                    {pipe.latencySeconds}s
                  </td>
                  <td className="font-mono text-xs" style={{ fontWeight: 600 }}>
                    {pipe.recordsLoaded.toLocaleString()}
                  </td>
                  <td>
                    <span className={`badge ${pipe.deadLetterCount === 0 ? 'badge-success' : 'badge-danger'} font-mono text-xs`}>
                      {pipe.deadLetterCount}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>
                      ✓ Guaranteed
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-success text-xs">
                      {pipe.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleTriggerPipeline(pipe.code)}
                      className="btn btn-secondary btn-sm"
                      title="Run Pipeline"
                    >
                      <RefreshCw size={12} /> Run
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
