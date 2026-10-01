import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient } from '../../types';
import { searchPatients } from '../../services/patientService';
import { 
  Users, Search, QrCode, FileText, UserPlus, 
  Calendar, Phone, ShieldCheck, HeartPulse
} from 'lucide-react';

interface PatientListProps {
  onOpenRegister: () => void;
}

export const PatientList: React.FC<PatientListProps> = ({ onOpenRegister }) => {
  const { patients, setActivePatient360Id, setQrModalPatient } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchResults, setSearchResults] = useState<Patient[] | null>(null);

  useEffect(() => {
    if (!search.trim()) {
      setSearchResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const results = await searchPatients({
          // Trying different matching logic or just letting the backend handle general search
          first_name: search.trim().split(' ')[0], 
          // Note: A robust backend would have a general query param `q`, but based on our api we'll just try phone or name.
        });
        setSearchResults(results);
      } catch (err) {
        console.error('Search error', err);
      }
    }, 500); // debounce 500ms
    return () => clearTimeout(timer);
  }, [search]);

  const basePatients = searchResults !== null ? searchResults : patients;

  const filteredPatients = basePatients.filter(p => {
    // If we're using local patients, we still do local filtering for MRN/City since the backend search params are limited.
    if (searchResults === null) {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.mrn.toLowerCase().includes(search.toLowerCase()) ||
                          p.phone.includes(search) ||
                          p.city.toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;
    }
    const matchType = typeFilter === 'ALL' || p.patientType === typeFilter;
    return matchType;
  });

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
            justifyContent: 'center'
          }}>
            <Users size={22} color="#ffffff" />
          </div>
          <div>
            <h1 className="title-lg">Enterprise Patient Master Registry</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Canonical identity, privacy QR token mapping, longitudinal history & demographic deduplication.
            </p>
          </div>
        </div>

        <button onClick={onOpenRegister} className="btn btn-primary btn-sm">
          <UserPlus size={15} />
          <span>+ Register New Patient</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, maxWidth: '480px' }}>
          <Search size={16} color="var(--text-dim)" />
          <input
            type="text"
            placeholder="Filter by patient name, MRN, phone number, city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input text-sm"
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'NEW', 'REPEAT', 'IPD', 'EMERGENCY'].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`btn btn-sm ${typeFilter === type ? 'btn-primary' : 'btn-secondary'}`}
            >
              {type === 'ALL' ? 'All Cohorts' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: '16px'
      }}>
        {filteredPatients.map(patient => (
          <div
            key={patient.id}
            className="card card-interactive"
            onClick={() => setActivePatient360Id(patient.id)}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem'
                  }}>
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {patient.name}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#38bdf8' }} className="font-mono">
                      {patient.mrn}
                    </div>
                  </div>
                </div>

                <span className="badge badge-neutral text-xs">{patient.patientType}</span>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', margin: '10px 0' }}>
                <div><strong>DOB:</strong> {patient.dob} ({patient.age} yrs, {patient.gender})</div>
                <div><strong>Phone:</strong> {patient.phone}</div>
                <div><strong>Address:</strong> {patient.address}, {patient.city}</div>
                <div><strong>Blood:</strong> <span className="font-mono text-danger" style={{ color: '#f87171', fontWeight: 700 }}>{patient.bloodGroup}</span></div>
              </div>

              {patient.allergies.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                  {patient.allergies.map(a => (
                    <span key={a} className="badge badge-danger text-xs" style={{ fontSize: '0.675rem', padding: '1px 5px' }}>
                      {a}
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.725rem', color: '#34d399', marginTop: '4px' }}>
                  ✓ No known allergies
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '10px',
              marginTop: '14px'
            }} onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setQrModalPatient(patient)}
                className="btn btn-secondary btn-sm"
              >
                <QrCode size={13} color="#38bdf8" />
                <span>QR Token</span>
              </button>

              <button
                onClick={() => setActivePatient360Id(patient.id)}
                className="btn btn-primary btn-sm"
              >
                <FileText size={13} />
                <span>Patient 360</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
