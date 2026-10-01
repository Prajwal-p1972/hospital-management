import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ToothRecord, ToothSurface, ToothFindingType } from '../../types';
import { Sparkles, Check, AlertCircle, Plus } from 'lucide-react';

interface ToothChart32Props {
  selectedTooth: number | null;
  onSelectTooth: (toothNum: number) => void;
  notation: 'UNIVERSAL' | 'FDI';
}

export const ToothChart32: React.FC<ToothChart32Props> = ({ selectedTooth, onSelectTooth, notation }) => {
  const { teethRecords } = useApp();

  // Teeth 1 to 16 are Upper Arch (Maxilla)
  // Teeth 32 down to 17 are Lower Arch (Mandible)
  const upperTeeth = teethRecords.slice(0, 16);
  // Lower teeth ordered 32 down to 17 so right is right and left is left visually
  const lowerTeethRight = teethRecords.slice(24, 32).reverse(); // 32 down to 25
  const lowerTeethLeft = teethRecords.slice(16, 24); // 17 to 24
  const lowerTeeth = [...lowerTeethRight, ...lowerTeethLeft];

  const getToothBadgeColor = (tooth: ToothRecord) => {
    if (tooth.findings.some(f => f.findingType === 'CARIES')) return '#ef4444';
    if (tooth.findings.some(f => f.findingType === 'CROWN')) return '#f59e0b';
    if (tooth.findings.some(f => f.findingType === 'RESTORATION')) return '#06b6d4';
    if (tooth.findings.some(f => f.findingType === 'ROOT_CANAL')) return '#a855f7';
    if (tooth.findings.some(f => f.findingType === 'MISSING')) return '#64748b';
    return 'transparent';
  };

  const renderToothSVG = (tooth: ToothRecord, isUpper: boolean) => {
    const isSelected = selectedTooth === tooth.toothNumber;
    const hasCaries = tooth.findings.some(f => f.findingType === 'CARIES');
    const hasRestoration = tooth.findings.some(f => f.findingType === 'RESTORATION');
    const hasCrown = tooth.findings.some(f => f.findingType === 'CROWN');
    const hasRootCanal = tooth.findings.some(f => f.findingType === 'ROOT_CANAL');
    const isMissing = tooth.findings.some(f => f.findingType === 'MISSING');

    const displayNum = notation === 'UNIVERSAL' ? tooth.toothNumber : tooth.fdiNumber;

    return (
      <div
        key={tooth.toothNumber}
        onClick={() => onSelectTooth(tooth.toothNumber)}
        className={`tooth-card ${isSelected ? 'selected' : ''}`}
        style={{
          width: '56px',
          minHeight: '86px',
          borderColor: isSelected ? '#38bdf8' : getToothBadgeColor(tooth) !== 'transparent' ? getToothBadgeColor(tooth) : undefined
        }}
        title={`${tooth.name} (Universal #${tooth.toothNumber}, FDI #${tooth.fdiNumber})`}
      >
        {/* Tooth Number Pill */}
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          color: isSelected ? '#38bdf8' : '#94a3b8',
          fontFamily: 'JetBrains Mono, monospace'
        }}>
          #{displayNum}
        </span>

        {/* Anatomical 5-Surface Interactive SVG */}
        <div style={{ position: 'relative', width: '38px', height: '38px', margin: '4px 0' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            {/* Background tooth outline */}
            <rect
              x="5"
              y="5"
              width="90"
              height="90"
              rx="18"
              fill={isMissing ? '#1e293b' : hasCrown ? '#78350f' : '#0f172a'}
              stroke={isSelected ? '#38bdf8' : hasCaries ? '#ef4444' : hasRestoration ? '#06b6d4' : '#334155'}
              strokeWidth="4"
            />

            {/* 5 Surfaces: Buccal (Top), Lingual (Bottom), Mesial (Left), Distal (Right), Occlusal (Center) */}
            {/* Occlusal Center */}
            <rect
              x="30"
              y="30"
              width="40"
              height="40"
              rx="6"
              fill={hasCaries ? '#ef4444' : hasRestoration ? '#06b6d4' : hasRootCanal ? '#a855f7' : isMissing ? '#334155' : '#1e293b'}
              stroke="#475569"
              strokeWidth="2"
            />
            {/* Buccal */}
            <polygon
              points="10,10 90,10 70,30 30,30"
              fill={hasCrown ? '#f59e0b' : '#1e293b'}
              stroke="#334155"
              strokeWidth="1.5"
            />
            {/* Lingual */}
            <polygon
              points="30,70 70,70 90,90 10,90"
              fill={hasCrown ? '#f59e0b' : '#1e293b'}
              stroke="#334155"
              strokeWidth="1.5"
            />
            {/* Mesial */}
            <polygon
              points="10,10 30,30 30,70 10,90"
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="1.5"
            />
            {/* Distal */}
            <polygon
              points="90,10 70,30 70,70 90,90"
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="1.5"
            />

            {/* Missing Cross */}
            {isMissing && (
              <line x1="15" y1="15" x2="85" y2="85" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
            )}
          </svg>
        </div>

        {/* Finding indicator badges */}
        <div style={{ display: 'flex', gap: '2px', height: '14px', alignItems: 'center' }}>
          {hasCaries && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} title="Caries" />}
          {hasRestoration && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#06b6d4' }} title="Restoration" />}
          {hasCrown && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }} title="Crown" />}
          {hasRootCanal && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a855f7' }} title="Root Canal" />}
          {isMissing && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#64748b' }} title="Missing" />}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Maxillary (Upper Arch) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Maxillary Arch (Upper Teeth 1 - 16)
          </span>
          <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
            <span>Right Quadrant (1-8)</span>
            <span>•</span>
            <span>Left Quadrant (9-16)</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(16, minmax(0, 1fr))',
          gap: '5px',
          background: 'var(--bg-input)',
          padding: '10px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          overflowX: 'auto'
        }}>
          {upperTeeth.map(t => renderToothSVG(t, true))}
        </div>
      </div>

      {/* Midline Divider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        margin: '2px 0'
      }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        <span style={{ fontSize: '0.675rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.1em' }}>
          OCCLUSAL PLANE / MIDLINE
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
      </div>

      {/* Mandibular (Lower Arch) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Mandibular Arch (Lower Teeth 32 - 17)
          </span>
          <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
            <span>Right Quadrant (32-25)</span>
            <span>•</span>
            <span>Left Quadrant (24-17)</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(16, minmax(0, 1fr))',
          gap: '5px',
          background: 'var(--bg-input)',
          padding: '10px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          overflowX: 'auto'
        }}>
          {lowerTeeth.map(t => renderToothSVG(t, false))}
        </div>
      </div>
    </div>
  );
};
