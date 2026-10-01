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
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '440px',
        margin: '0 16px',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px',
        padding: '48px 40px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}>
        {/* Logo & Brand */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            boxShadow: '0 8px 24px rgba(59,130,246,0.35)',
            marginBottom: '20px',
          }}>
            <Activity size={36} color="white" />
          </div>
          <h1 style={{
            color: 'white', fontSize: '28px', fontWeight: '700',
            letterSpacing: '-0.5px', margin: '0 0 8px 0',
          }}>Nexora HMS</h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            Hospital Management System
          </p>
        </div>

        {/* Secure Sign In label */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          marginBottom: '28px', padding: '10px 14px',
          background: 'rgba(59,130,246,0.08)',
          border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: '10px',
        }}>
          <Shield size={16} color="#3b82f6" />
          <span style={{ color: '#94a3b8', fontSize: '13px' }}>Secure Staff Sign In</span>
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
                borderColor: isEmailFocused ? '#3b82f6' : 'rgba(255,255,255,0.1)',
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
                  borderColor: isPasswordFocused ? '#3b82f6' : 'rgba(255,255,255,0.1)',
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
                ? 'rgba(59,130,246,0.4)'
                : 'linear-gradient(135deg, #3b82f6, #2563eb)',
              border: 'none', borderRadius: '12px',
              color: 'white', fontSize: '15px', fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              boxShadow: isLoading ? 'none' : '0 4px 20px rgba(59,130,246,0.4)',
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

        {/* Footer */}
        <p style={{ textAlign: 'center', color: '#334155', fontSize: '12px', marginTop: '32px', marginBottom: 0 }}>
          © 2026 Nexora Hospital Management System
        </p>
      </div>

    </div>
  );
};
