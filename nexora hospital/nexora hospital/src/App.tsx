import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { NotificationToast } from './components/common/NotificationToast';
import { QRModal } from './components/common/QRModal';
import { PatientRegisterModal } from './components/patient/PatientRegisterModal';
import { Patient360Modal } from './components/patient/Patient360Modal';
import LoginPage from './components/auth/LoginPage';

// Views
import { DailyDashboard } from './components/dashboard/DailyDashboard';
import { PatientList } from './components/patient/PatientList';
import { InquiriesQueueView } from './components/queue/InquiriesQueueView';
import { OPDConsultationView } from './components/opd/OPDConsultationView';
import { BedBoardView } from './components/ipd/BedBoardView';
import { EmergencyTriageView } from './components/emergency/EmergencyTriageView';
import { DentalWorkspace } from './components/dental/DentalWorkspace';
import { PharmacyView } from './components/pharmacy/PharmacyView';
import { DiagnosticsView } from './components/diagnostics/DiagnosticsView';
import { BillingView } from './components/billing/BillingView';
import { DataEngineeringHub } from './components/analytics/DataEngineeringHub';
import { KPIDictionaryView } from './components/analytics/KPIDictionaryView';
import { AuditLogView } from './components/audit/AuditLogView';

// Loading spinner shown while stored token is being verified
const AuthLoadingScreen: React.FC = () => (
  <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a, #1e293b)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: '16px',
  }}>
    <div style={{
      width: '48px', height: '48px', borderRadius: '50%',
      border: '3px solid rgba(59,130,246,0.2)',
      borderTopColor: '#3b82f6',
      animation: 'spin 0.8s linear infinite',
    }} />
    <p style={{ color: '#64748b', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>
      Verifying session…
    </p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export const App: React.FC = () => {
  const { activeTab, qrModalPatient, setQrModalPatient } = useApp();
  const { isAuthenticated, isLoading } = useAuth();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  // 1. Still verifying stored token against /me
  if (isLoading) return <AuthLoadingScreen />;

  // 2. Not authenticated — show login page
  if (!isAuthenticated) return <LoginPage />;

  const renderActiveView = () => {
    switch (activeTab) {
      case 'DASHBOARD':
        return <DailyDashboard />;
      case 'PATIENTS':
        return <PatientList onOpenRegister={() => setIsRegisterOpen(true)} />;
      case 'INQUIRIES_QUEUE':
        return <InquiriesQueueView />;
      case 'OPD_CONSULTATION':
        return <OPDConsultationView />;
      case 'BED_BOARD':
        return <BedBoardView />;
      case 'EMERGENCY_TRIAGE':
        return <EmergencyTriageView />;
      case 'DENTAL_MODE':
        return <DentalWorkspace />;
      case 'PHARMACY':
        return <PharmacyView />;
      case 'LAB_DIAGNOSTICS':
        return <DiagnosticsView />;
      case 'BILLING':
        return <BillingView />;
      case 'DATA_ENGINEERING':
        return <DataEngineeringHub />;
      case 'KPI_CATALOGUE':
        return <KPIDictionaryView />;
      case 'AUDIT_LOGS':
        return <AuditLogView />;
      default:
        return <DailyDashboard />;
    }
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <Header
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
      />

      {/* Main Workspace Layout */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Dynamic Nav Sidebar */}
        <Sidebar />

        {/* Scrollable Main Content */}
        <main className="main-content">
          <div className="content-body">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <NotificationToast />

      {/* Patient Registration with Duplicate Detection Engine */}
      <PatientRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

      {/* Scannable / Printable QR Card & Scanner Simulator */}
      <QRModal
        isOpen={isQRScannerOpen || qrModalPatient !== null}
        onClose={() => {
          setIsQRScannerOpen(false);
          setQrModalPatient(null);
        }}
        patient={qrModalPatient}
      />

      {/* Longitudinal Patient 360 View */}
      <Patient360Modal />
    </div>
  );
};

export default App;
