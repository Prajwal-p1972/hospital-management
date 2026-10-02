import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Activity, Eye, EyeOff, LogIn, Shield } from 'lucide-react';
import './LoginPage.css';
export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Clean state for focus handling
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!email || !password) {
      setLocalError('Please enter your email and password.');
      return;
    }
    try {
      await login({ email, password });
    } catch {
      // error is shown from AuthContext
    }
  };

  const displayError = localError || error;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f2744 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background glows */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
        animation: 'pulse 4s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
        animation: 'pulse 5s ease-in-out infinite reverse',
      }} />

      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Login Card */}
      <div className="login-card-container">
        {/* Logo & Brand */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '14px 28px',
            borderRadius: '20px',
            background: 'rgba(11, 60, 93, 0.35)',
            border: '1px solid rgba(0, 174, 239, 0.4)',
            boxShadow: '0 8px 30px rgba(0, 122, 204, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            marginBottom: '18px',
          }}>
            <img 
              src="/logo-nexora.png" 
              alt="NEXORA" 
              style={{ height: '42px', objectFit: 'contain' }} 
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              color: '#FFFFFF', fontSize: '20px', fontWeight: '800', letterSpacing: '-0.3px'
            }}>CAREOS</span>
            <span style={{
              background: '#1E3A8A', color: '#00AEEF', padding: '2px 8px', borderRadius: '6px',
              fontSize: '11px', fontWeight: '700', border: '1px solid rgba(0, 174, 239, 0.4)',
              letterSpacing: '0.08em'
            }}>HMS</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
            Enterprise Hospital Management System
          </p>
        </div>

        {/* Secure Sign In label */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          marginBottom: '28px', padding: '10px 14px',
          background: 'rgba(0, 122, 204, 0.1)',
          border: '1px solid rgba(0, 174, 239, 0.3)',
          borderRadius: '10px',
        }}>
          <Shield size={16} color="#00AEEF" />
          <span style={{ color: '#E6E8EB', fontSize: '13px' }}>Secure Staff Sign In</span>
        </div>

        {/* Error message */}
        {displayError && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
            color: '#fca5a5', fontSize: '13px',
          }}>
            {displayError}
          </div>
        )}

        <div onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e as any)}>
          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@hospital.com"
              autoComplete="email"
              disabled={isLoading}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '12px 16px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid',
                borderColor: isEmailFocused ? '#00AEEF' : 'rgba(0, 174, 239, 0.2)',
                color: 'white', fontSize: '15px',
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoading}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '12px 48px 12px 16px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid',
                  borderColor: isPasswordFocused ? '#00AEEF' : 'rgba(0, 174, 239, 0.2)',
                  color: 'white', fontSize: '15px',
                  outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '2px',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            id="login-submit"
            type="button"
            onClick={handleSubmit as any}
            disabled={isLoading}
            style={{
              width: '100%', padding: '14px',
              background: isLoading
                ? 'rgba(0, 122, 204, 0.4)'
                : 'linear-gradient(135deg, #007ACC 0%, #1E3A8A 100%)',
              border: '1px solid rgba(0, 174, 239, 0.4)',
              borderRadius: '12px',
              color: 'white', fontSize: '15px', fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              boxShadow: isLoading ? 'none' : '0 4px 20px rgba(0, 122, 204, 0.4)',
              transition: 'all 0.2s',
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Sign In to HMS
              </>
            )}
          </button>
        </div>

        {/* Quick Demo Access */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Demo Access
            </span>
            <span style={{ fontSize: '11px', color: '#00AEEF' }}>
              Password: <code style={{ background: 'rgba(0,174,239,0.15)', padding: '2px 6px', borderRadius: '4px', color: '#38bdf8' }}>password123</code>
            </span>
          </div>

          <div className="login-demo-grid">
            {[
              { role: 'Admin', email: 'admin@hospital.com', icon: '👑' },
              { role: 'Doctor', email: 'doctor@hospital.com', icon: '🩺' },
              { role: 'Nurse', email: 'nurse@hospital.com', icon: '💉' },
              { role: 'Receptionist', email: 'receptionist@hospital.com', icon: '📋' },
              { role: 'Pharmacist', email: 'pharmacist@hospital.com', icon: '💊' },
            ].map((item) => (
              <button
                key={item.email}
                id={`demo-btn-${item.role.toLowerCase()}`}
                type="button"
                onClick={() => {
                  setEmail(item.email);
                  setPassword('password123');
                  setLocalError(null);
                }}
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#e2e8f0',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#00AEEF';
                  e.currentTarget.style.background = 'rgba(0, 174, 239, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }}
              >
                <span style={{ fontSize: '14px' }}>{item.icon}</span>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: '600', fontSize: '11px', color: '#FFFFFF' }}>{item.role}</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.email}</div>
                </div>
              </button>
            ))}
          </div>

          <p style={{
            marginTop: '12px',
            fontSize: '11px',
            color: '#64748b',
            textAlign: 'center',
            lineHeight: '1.4',
            marginBottom: 0,
          }}>
            💡 Click any demo card above to auto-fill credentials. Note: This is your hospital website login, not your MySQL database password.
          </p>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', color: '#334155', fontSize: '12px', marginTop: '24px', marginBottom: 0 }}>
          © 2026 Nexora Hospital Management System
        </p>
      </div>

    </div>
  );
};
