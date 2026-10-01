import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '420px',
      width: '100%',
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => {
        let icon = <Info size={18} color="#38bdf8" />;
        let borderCol = 'rgba(56, 189, 248, 0.3)';
        let bgGlow = 'rgba(14, 165, 233, 0.15)';

        if (toast.type === 'success') {
          icon = <CheckCircle2 size={18} color="#34d399" />;
          borderCol = 'rgba(52, 211, 153, 0.35)';
          bgGlow = 'rgba(16, 185, 129, 0.15)';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle size={18} color="#fbbf24" />;
          borderCol = 'rgba(251, 191, 36, 0.35)';
          bgGlow = 'rgba(245, 158, 11, 0.15)';
        } else if (toast.type === 'error') {
          icon = <AlertCircle size={18} color="#f87171" />;
          borderCol = 'rgba(248, 113, 113, 0.35)';
          bgGlow = 'rgba(239, 68, 68, 0.15)';
        }

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              background: '#0f172a',
              border: `1px solid ${borderCol}`,
              borderRadius: '10px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.6)',
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(10px)',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                padding: '6px',
                borderRadius: '8px',
                background: bgGlow,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {icon}
              </div>
              <span style={{ fontSize: '0.875rem', color: '#f8fafc', fontWeight: 500 }}>
                {toast.text}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
