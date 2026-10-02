import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ProductMode, UserRole } from '../../types';
import { 
  Building2, Stethoscope, Calendar, QrCode, UserPlus, 
  Search, Shield, Activity, ChevronDown, Check, Sparkles, LogOut, Sun, Moon,
  Menu, X
} from 'lucide-react';

interface HeaderProps {
  onOpenRegister: () => void;
  onOpenQRScanner: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenRegister, onOpenQRScanner }) => {
  const { 
    mode, setMode, currentUser, setCurrentUser, users, 
    selectedDate, setSelectedDate, showToast, setActivePatient360Id, patients,
    isMobileNavOpen, setIsMobileNavOpen
  } = useApp();
  const { user: authUser, logout } = useAuth();
  const [isLightMode, setIsLightMode] = useState(false);

  const toggleTheme = () => {
    setIsLightMode(prev => {
      const next = !prev;
      if (next) {
        document.body.classList.add('theme-light');
      } else {
        document.body.classList.remove('theme-light');
      }
      return next;
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore errors on logout
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const modeLabels: Record<ProductMode, { label: string; icon: string; badge: string }> = {
    CLINIC: { label: 'CareOS Clinic', icon: '🩺', badge: 'Outpatient Practice' },
    HOSPITAL: { label: 'CareOS Hospital', icon: '🏥', badge: 'Full HMS Enterprise' },
    SUPER_SPECIALTY: { label: 'CareOS Super-Specialty', icon: '🏛️', badge: 'Tertiary & Multi-ICU' },
    DENTAL: { label: 'CareOS Dental', icon: '🦷', badge: 'Dental Specialty Suite' }
  };

  const filteredPatients = searchQuery.trim() 
    ? patients.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery)
      )
    : [];

  return (
    <header className="app-header">
      {/* Brand & Mode Selector */}
      <div className="header-left">
        {/* Mobile Hamburger Drawer Toggle */}
        <button
          type="button"
          className="mobile-nav-toggle"
          onClick={() => setIsMobileNavOpen(prev => !prev)}
          title="Toggle Navigation Menu"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileNavOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '5px 12px',
            borderRadius: '12px',
            background: isLightMode ? '#F5F7FA' : '#131E3A',
            border: '1px solid var(--border-medium)',
            boxShadow: '0 2px 10px rgba(0, 122, 204, 0.25)',
          }}>
            <img src="/logo-nexora.png" alt="NEXORA" style={{ height: '24px', objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em',
                background: 'linear-gradient(135deg, #00AEEF 0%, #007ACC 100%)',
                color: '#FFFFFF', padding: '1px 6px', borderRadius: '4px',
              }}>
                HMS
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                CareOS
              </span>
              <span className="live-pulse" title="System Live & Operational" />
            </div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Healthcare Platform
            </span>
          </div>
        </div>

        {/* Mode Switcher Pill */}
        {/* Mode Switcher Pill */}
        <div className="header-modes-scroll">
          {(['CLINIC', 'HOSPITAL', 'SUPER_SPECIALTY', 'DENTAL'] as ProductMode[]).map(m => {
            const isActive = mode === m;
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  background: isActive ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  border: isActive ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{modeLabels[m].icon}</span>
                <span>{m === 'SUPER_SPECIALTY' ? 'Super-Specialty' : m.charAt(0) + m.slice(1).toLowerCase()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Center Search & Global Patient Finder */}
      <div className="header-search-container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-input)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '0 12px'
        }}>
          <Search size={15} color="var(--text-dim)" />
          <input
            type="text"
            placeholder="Search patient, phone, or MRN..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '0.825rem',
              padding: '8px 10px',
              width: '100%'
            }}
          />
        </div>

        {/* Live Search Autocomplete Dropdown */}
        {showSearchResults && searchQuery.trim() && (
          <div style={{
            position: 'absolute',
            top: '42px',
            left: 0,
            right: 0,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 999,
            maxHeight: '260px',
            overflowY: 'auto'
          }}>
            {filteredPatients.length === 0 ? (
              <div style={{ padding: '12px', fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center' }}>
                No patients found matching "{searchQuery}"
              </div>
            ) : (
              filteredPatients.map(patient => (
                <div
                  key={patient.id}
                  onClick={() => {
                    setActivePatient360Id(patient.id);
                    setShowSearchResults(false);
                    setSearchQuery('');
                  }}
                  style={{
                    padding: '10px 14px',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {patient.name}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>
                      MRN: {patient.mrn} • Phone: {patient.phone}
                    </div>
                  </div>
                  <span className="badge badge-primary text-xs">Patient 360</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Date-Selectable Controller & Role Switcher */}
      <div className="header-right">
        {/* Date Selector Box */}
        <div className="header-date-box" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '6px 12px'
        }}>
          <Calendar size={15} color="#38bdf8" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
              Operating Date
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={e => {
                if (e.target.value) {
                  setSelectedDate(e.target.value);
                  showToast(`Operations view shifted to ${e.target.value}`, 'info');
                }
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#38bdf8',
                fontSize: '0.85rem',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>

        {/* Quick Date Chips (hidden on mobile) */}
        <div className="header-quick-date" style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setSelectedDate('2026-09-03')}
            style={{
              background: selectedDate === '2026-09-03' ? 'rgba(56, 189, 248, 0.25)' : 'var(--bg-subtle)',
              border: selectedDate === '2026-09-03' ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
              color: selectedDate === '2026-09-03' ? '#38bdf8' : 'var(--text-muted)',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            title="Prompt Baseline Target Date"
          >
            03-09-2026
          </button>
        </div>

        {/* QR Scanner Trigger */}
        <button
          onClick={onOpenQRScanner}
          className="btn btn-secondary btn-sm"
          title="Scan or enter Patient QR Token"
        >
          <QrCode size={15} />
          <span className="btn-text-responsive">Scan QR</span>
        </button>

        {/* Register Patient Trigger */}
        <button
          onClick={onOpenRegister}
          className="btn btn-primary btn-sm"
          title="Register new patient with duplicate verification"
        >
          <UserPlus size={15} />
          <span className="btn-text-responsive">+ Patient</span>
        </button>

        {/* User Role Switcher Dropdown */}
        <div className="header-user-badge" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '4px 8px'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#ffffff',
            flexShrink: 0
          }}>
            {currentUser.name.charAt(0)}
          </div>
          <div className="header-user-text" style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser.name.split(',')[0]}
            </span>
            <select
              value={currentUser.id}
              onChange={e => {
                const found = users.find(u => u.id === e.target.value);
                if (found) {
                  setCurrentUser(found);
                  showToast(`Role persona active: ${found.role.replace(/_/g, ' ')}`, 'info');
                }
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '0.675rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              {users.map(u => (
                <option key={u.id} value={u.id} style={{ background: '#0f172a', color: '#f8fafc' }}>
                  {u.role.replace(/_/g, ' ')} ({u.name.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Light Mode / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          title={isLightMode ? 'Switch to Dark Mode (Premium Version)' : 'Switch to Light Mode'}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '32px', height: '32px',
            borderRadius: '8px',
            background: isLightMode ? '#F5F7FA' : '#131E3A',
            border: '1px solid var(--border-medium)',
            color: isLightMode ? '#007ACC' : '#00AEEF',
            cursor: 'pointer',
            transition: 'all 0.2s',
            flexShrink: 0
          }}
        >
          {isLightMode ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title={authUser ? `Logged in as ${authUser.name}` : 'Logout'}
          className="header-logout-btn"
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '8px',
            color: '#f87171', fontSize: '12px', fontWeight: 600,
            padding: '6px 10px', cursor: 'pointer',
            transition: 'all 0.2s',
            flexShrink: 0
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.18)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)';
          }}
        >
          <LogOut size={14} />
          <span className="btn-text-responsive">{authUser?.name?.split(' ')[0] ?? 'Logout'}</span>
        </button>
      </div>
    </header>
  );
};

