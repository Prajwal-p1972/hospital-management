import React from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import { 
  LayoutDashboard, Users, Clock, Stethoscope, BedDouble, 
  AlertOctagon, Sparkles, Pill, FlaskConical, Receipt, 
  Database, BookOpen, ShieldCheck, ChevronRight, Building
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { mode, currentUser, activeTab, setActiveTab } = useApp();

  interface NavItem {
    tab: NavigationTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    badgeColor?: string;
    visible: boolean;
  }

  const isDentalMode = mode === 'DENTAL';
  const isClinicMode = mode === 'CLINIC';

  const navItems: NavItem[] = [
    {
      tab: 'DASHBOARD',
      label: 'Daily Operations',
      icon: <LayoutDashboard size={18} />,
      badge: 'Live',
      badgeColor: 'badge-primary',
      visible: true
    },
    {
      tab: 'PATIENTS',
      label: 'Patient Directory',
      icon: <Users size={18} />,
      visible: true
    },
    {
      tab: 'INQUIRIES_QUEUE',
      label: 'Inquiries & Queue',
      icon: <Clock size={18} />,
      badge: 'Tokens',
      badgeColor: 'badge-warning',
      visible: true
    },
    {
      tab: 'OPD_CONSULTATION',
      label: 'OPD & Doctor EMR',
      icon: <Stethoscope size={18} />,
      visible: !isDentalMode
    },
    {
      tab: 'DENTAL_MODE',
      label: 'Dental Practice Suite',
      icon: <Sparkles size={18} />,
      badge: isDentalMode ? 'Active Mode' : 'Dental',
      badgeColor: 'badge-purple',
      visible: true
    },
    {
      tab: 'BED_BOARD',
      label: 'IPD & Bed Board',
      icon: <BedDouble size={18} />,
      visible: !isClinicMode && !isDentalMode
    },
    {
      tab: 'EMERGENCY_TRIAGE',
      label: 'Emergency / Triage',
      icon: <AlertOctagon size={18} />,
      badge: 'Acuity',
      badgeColor: 'badge-danger',
      visible: !isClinicMode && !isDentalMode
    },
    {
      tab: 'PHARMACY',
      label: 'Pharmacy & Stock',
      icon: <Pill size={18} />,
      visible: true
    },
    {
      tab: 'LAB_DIAGNOSTICS',
      label: 'Lab & Diagnostics',
      icon: <FlaskConical size={18} />,
      visible: true
    },
    {
      tab: 'BILLING',
      label: 'Billing & Cashier',
      icon: <Receipt size={18} />,
      visible: true
    },
    {
      tab: 'DATA_ENGINEERING',
      label: 'Data Engineering Hub',
      icon: <Database size={18} />,
      badge: 'DE-01..12',
      badgeColor: 'badge-info',
      visible: true
    },
    {
      tab: 'KPI_CATALOGUE',
      label: 'Governed KPI Dictionary',
      icon: <BookOpen size={18} />,
      badge: 'DA-01..12',
      badgeColor: 'badge-success',
      visible: true
    },
    {
      tab: 'AUDIT_LOGS',
      label: 'Audit & Compliance',
      icon: <ShieldCheck size={18} />,
      visible: true
    }
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 61px)',
      position: 'sticky',
      top: '61px',
      flexShrink: 0
    }}>
      {/* Navigation Links */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <div style={{
          fontSize: '0.675rem',
          fontWeight: 700,
          color: 'var(--text-dim)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          padding: '4px 10px 8px 10px'
        }}>
          Healthcare Workflows
        </div>

        {navItems.filter(item => item.visible).map(item => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'linear-gradient(90deg, rgba(14, 165, 233, 0.18) 0%, rgba(14, 165, 233, 0.04) 100%)' : 'transparent',
                border: isActive ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent',
                color: isActive ? '#38bdf8' : 'var(--text-muted)',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.15s ease',
                fontFamily: 'inherit'
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--bg-subtle)';
                  e.currentTarget.style.color = 'var(--text-main)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: isActive ? '#38bdf8' : 'var(--text-dim)' }}>
                  {item.icon}
                </span>
                <span style={{ fontSize: '0.825rem', fontWeight: isActive ? 700 : 500 }}>
                  {item.label}
                </span>
              </div>
              {item.badge && (
                <span className={`badge ${item.badgeColor || 'badge-neutral'}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Facility & Compliance Footer */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Building size={14} color="#38bdf8" />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>
            North Campus Facility
          </span>
        </div>
        <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Tenant: NX-TENANT-01</span>
          <span style={{ color: '#34d399', fontWeight: 600 }}>v2.4 LTS</span>
        </div>
      </div>
    </aside>
  );
};
