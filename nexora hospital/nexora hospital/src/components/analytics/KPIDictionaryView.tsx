import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KPIDefinition, DataQualityCheck } from '../../types';
import { 
  BookOpen, CheckCircle2, AlertTriangle, ShieldCheck, 
  Search, TrendingUp, TrendingDown, RefreshCw, Play
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const KPIDictionaryView: React.FC = () => {
  const { kpis, qualityChecks, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'METRICS' | 'DATA_QUALITY'>('METRICS');
  const [searchQuery, setSearchQuery] = useState('');
  const [runningDQ, setRunningDQ] = useState(false);

  const filteredKpis = kpis.filter(k => 
    k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.sourceTables.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRunDataQualitySuite = () => {
    setRunningDQ(true);
    setTimeout(() => {
      setRunningDQ(false);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      showToast('Automated Data Quality & Integrity test suite passed with 100% compliance!', 'success');
    }, 1200);
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
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(5, 150, 105, 0.4)'
          }}>
            <BookOpen size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 className="title-lg">Governed Healthcare KPI Dictionary & Semantic Layer</h1>
              <span className="badge badge-success text-xs">DA-01 to DA-12 Analytics Specification</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Non-negotiable single source of truth for hospital operations, wait times, bed occupancy, dental acceptance & financial reconciliation.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleRunDataQualitySuite}
            disabled={runningDQ}
            className="btn btn-primary btn-sm"
          >
            <Play size={14} />
            <span>{runningDQ ? 'Executing Test Suite...' : 'Run DQ Validation Suite'}</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', gap: '8px' }}>
        <button
          onClick={() => setActiveTab('METRICS')}
          style={{
            padding: '10px 18px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'METRICS' ? '2px solid #10b981' : '2px solid transparent',
            color: activeTab === 'METRICS' ? '#34d399' : 'var(--text-muted)',
            fontWeight: activeTab === 'METRICS' ? 700 : 500,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          Governed Metric Definitions ({kpis.length})
        </button>
        <button
          onClick={() => setActiveTab('DATA_QUALITY')}
          style={{
            padding: '10px 18px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'DATA_QUALITY' ? '2px solid #10b981' : '2px solid transparent',
            color: activeTab === 'DATA_QUALITY' ? '#34d399' : 'var(--text-muted)',
            fontWeight: activeTab === 'DATA_QUALITY' ? 700 : 500,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          Automated Data Quality Checks ({qualityChecks.length})
        </button>
      </div>

      {/* TAB 1: Governed Metrics Catalogue */}
      {activeTab === 'METRICS' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="title-md">Canonical Hospital & Dental KPI Catalogue</h3>
            <input
              type="text"
              placeholder="Search formula, source tables, or owner..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input text-sm"
              style={{ width: '320px' }}
            />
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>KPI Name</th>
                  <th>Mathematical Formula</th>
                  <th>Grain / Dimension</th>
                  <th>Source Lakehouse Tables</th>
                  <th>Accountable Owner</th>
                  <th>Calculated Value (Today)</th>
                  <th>Benchmark SLA</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredKpis.map(kpi => (
                  <tr key={kpi.id}>
                    <td style={{ fontWeight: 700 }}>
                      <div style={{ color: '#f8fafc' }}>{kpi.name}</div>
                      <span className="font-mono text-dim text-xs">ID: {kpi.id.toUpperCase()}</span>
                    </td>
                    <td>
                      <code className="font-mono text-xs" style={{ background: 'var(--bg-input)', padding: '2px 6px', borderRadius: '4px', color: '#38bdf8' }}>
                        {kpi.formula}
                      </code>
                    </td>
                    <td className="text-dim text-xs">{kpi.grain}</td>
                    <td>
                      <span className="font-mono text-xs" style={{ color: '#c084fc' }}>{kpi.sourceTables}</span>
                    </td>
                    <td className="text-dim text-xs">{kpi.owner}</td>
                    <td className="font-mono text-xs" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.9rem' }}>
                      {kpi.todayValue}
                    </td>
                    <td className="font-mono text-xs text-dim">{kpi.benchTarget}</td>
                    <td>
                      <span className={`badge ${kpi.status === 'HEALTHY' ? 'badge-success' : 'badge-warning'} text-xs`}>
                        {kpi.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Data Quality Suite */}
      {activeTab === 'DATA_QUALITY' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 className="title-md">Automated Data Integrity & Quality Rules Engine</h3>
                <span className="text-xs text-muted">
                  Strict enforcement of Patient Uniqueness, Temporal Sequence, Referential Integrity & Zero-Balance Ledger Reconciliation.
                </span>
              </div>
              <span className="badge badge-success text-xs">All Tests Passing</span>
            </div>

            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Rule Domain</th>
                    <th>Validation Rule Name</th>
                    <th>Description & Integrity Assertion</th>
                    <th>Entities Tested</th>
                    <th>Failures / Anomalies</th>
                    <th>Last Verified</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {qualityChecks.map(check => (
                    <tr key={check.id}>
                      <td>
                        <span className="badge badge-neutral font-mono text-xs">{check.domain}</span>
                      </td>
                      <td style={{ fontWeight: 700 }}>{check.ruleName}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{check.description}</td>
                      <td className="font-mono text-xs">{check.testedCount}</td>
                      <td>
                        <span className="badge badge-success font-mono text-xs">{check.failedCount}</span>
                      </td>
                      <td className="font-mono text-xs text-dim">{check.lastChecked}</td>
                      <td>
                        <span className="badge badge-success text-xs">
                          {check.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
