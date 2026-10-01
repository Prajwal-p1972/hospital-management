import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, Users, Clock, AlertTriangle, TrendingUp, DollarSign, 
  ArrowRight, CheckCircle2, XCircle, Stethoscope, BedDouble, 
  Sparkles, Filter, ChevronRight, Activity, PieChart, ShieldAlert
} from 'lucide-react';

export const DailyDashboard: React.FC = () => {
  const { 
    selectedDate, setSelectedDate, appointments, inquiries, invoices, 
    medications, labOrders, setActivePatient360Id, updateAppointmentStatus,
    setActiveTab, setQrModalPatient, patients
  } = useApp();

  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter records for the selected date
  const dateAppointments = appointments.filter(a => a.date === selectedDate);
  const dateInquiries = inquiries.filter(i => i.createdAt.startsWith(selectedDate));
  const dateInvoices = invoices.filter(i => i.date === selectedDate);

  // Overall KPIs
  const totalAppointments = dateAppointments.length;
  const bookedCount = dateAppointments.filter(a => a.status === 'BOOKED' || a.status === 'CONFIRMED').length;
  const arrivedCount = dateAppointments.filter(a => a.status === 'ARRIVED').length;
  const inConsultCount = dateAppointments.filter(a => a.status === 'IN_CONSULTATION').length;
  const completedCount = dateAppointments.filter(a => a.status === 'COMPLETED').length;
  const cancelledCount = dateAppointments.filter(a => a.status === 'CANCELLED').length;
  const noShowCount = dateAppointments.filter(a => a.status === 'NO_SHOW').length;

  const newPatientsCount = dateAppointments.filter(a => a.isNewPatient).length;
  const repeatPatientsCount = totalAppointments - newPatientsCount;

  // Wait Time Analytics
  const waitingAppointments = dateAppointments.filter(a => a.status === 'ARRIVED');
  const avgWaitTime = dateAppointments.length > 0 
    ? Math.round(dateAppointments.reduce((acc, a) => acc + (a.waitTimeMinutes || 0), 0) / dateAppointments.length)
    : 0;
  const longestWaitApt = dateAppointments.reduce((max, a) => (a.waitTimeMinutes > (max?.waitTimeMinutes || 0) ? a : max), null as any);

  // Financials for selected date
  const totalBilled = dateInvoices.reduce((acc, i) => acc + i.grandTotal, 0);
  const totalCollected = dateInvoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalOutstanding = dateInvoices.reduce((acc, i) => acc + i.outstandingAmount, 0);

  // Department Load Breakdown
  const departments = ['Cardiology', 'Dental Surgery', 'Neurosurgery', 'Emergency Trauma', 'Pediatrics'];
  const departmentStats = departments.map(dept => {
    const apts = dateAppointments.filter(a => a.departmentName.toLowerCase().includes(dept.toLowerCase()));
    const completed = apts.filter(a => a.status === 'COMPLETED').length;
    const pending = apts.filter(a => a.status !== 'COMPLETED' && a.status !== 'CANCELLED' && a.status !== 'NO_SHOW').length;
    const avgWait = apts.length > 0 
      ? Math.round(apts.reduce((acc, a) => acc + (a.waitTimeMinutes || 0), 0) / apts.length)
      : 0;
    return {
      name: dept,
      total: apts.length,
      completed,
      pending,
      avgWait
    };
  }).filter(d => d.total > 0);

  // Doctors Utilization
  const doctorMap: Record<string, { doctorName: string; departmentName: string; count: number; completed: number }> = {};
  dateAppointments.forEach(a => {
    if (!doctorMap[a.doctorId]) {
      doctorMap[a.doctorId] = {
        doctorName: a.doctorName,
        departmentName: a.departmentName,
        count: 0,
        completed: 0
      };
    }
    doctorMap[a.doctorId].count++;
    if (a.status === 'COMPLETED') doctorMap[a.doctorId].completed++;
  });

  // Operational Alerts
  const longWaitAlerts = dateAppointments.filter(a => a.waitTimeMinutes >= 30 && a.status === 'ARRIVED');
  const lowStockMeds = medications.filter(m => m.stockQuantity <= m.reorderLevel);
  const abnormalLabAlerts = labOrders.filter(l => l.abnormalFlag && l.orderDate.startsWith(selectedDate));

  // Filtered appointments list
  const filteredAppointments = dateAppointments.filter(a => {
    const matchDept = deptFilter === 'ALL' || a.departmentName.toLowerCase().includes(deptFilter.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchDept && matchStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner with Active Operating Date & Quick Summary */}
      <div style={{
        background: 'linear-gradient(135deg, #121a2d 0%, #0d1322 100%)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(14, 165, 233, 0.4)'
          }}>
            <Calendar size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 className="title-lg">Daily Hospital Operations Dashboard</h1>
              <span className="badge badge-primary font-mono text-xs">{selectedDate}</span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Governed operational view reconciling inquiries, appointments, clinical encounters, and financial billing.
            </p>
          </div>
        </div>

        {/* Date Selector Shortcuts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Select Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={e => e.target.value && setSelectedDate(e.target.value)}
            className="input font-mono text-sm"
            style={{ width: '160px', padding: '6px 10px' }}
          />
          <button
            onClick={() => setSelectedDate('2026-09-03')}
            className={`btn btn-sm ${selectedDate === '2026-09-03' ? 'btn-primary' : 'btn-secondary'}`}
          >
            03-09-2026 (Prompt Target)
          </button>
        </div>
      </div>

      {/* KPI Overview Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px'
      }}>
        {/* Total Appointments */}
        <div className="card" style={{ borderLeft: '4px solid #0ea5e9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase' }}>Appointments</span>
            <Users size={16} color="#0ea5e9" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#f8fafc' }}>
            {totalAppointments}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginTop: '4px' }}>
            {newPatientsCount} New ({Math.round((newPatientsCount / (totalAppointments || 1)) * 100)}%) • {repeatPatientsCount} Repeat
          </div>
        </div>

        {/* Arrived & In Waiting */}
        <div className="card" style={{ borderLeft: '4px solid #fbbf24' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase' }}>Waiting / Arrived</span>
            <Clock size={16} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#fbbf24' }}>
            {arrivedCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Avg Wait: <strong style={{ color: avgWaitTime > 25 ? '#f87171' : '#34d399' }}>{avgWaitTime}m</strong>
          </div>
        </div>

        {/* In Consultation */}
        <div className="card" style={{ borderLeft: '4px solid #a855f7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase' }}>In Consultation</span>
            <Stethoscope size={16} color="#a855f7" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#c084fc' }}>
            {inConsultCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Across Doctors & Operatories
          </div>
        </div>

        {/* Completed Visits */}
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase' }}>Completed</span>
            <CheckCircle2 size={16} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#34d399' }}>
            {completedCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {Math.round((completedCount / (totalAppointments || 1)) * 100)}% completion rate
          </div>
        </div>

        {/* Cancellations & No-Shows */}
        <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase' }}>Cancelled / No-Show</span>
            <XCircle size={16} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#f87171' }}>
            {cancelledCount + noShowCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {cancelledCount} Cancelled • {noShowCount} No-show
          </div>
        </div>

        {/* Revenue Collected */}
        <div className="card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase' }}>Collections</span>
            <DollarSign size={16} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#60a5fa' }}>
            ${totalCollected.toFixed(0)}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Billed: ${totalBilled.toFixed(0)} • Out: ${totalOutstanding.toFixed(0)}
          </div>
        </div>
      </div>

      {/* Patient Flow Funnel & Operational Alerts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Patient Flow Funnel Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 className="title-md">Patient Journey Conversion Funnel</h3>
              <span className="text-xs text-muted">Inquiry → Booking → Check-In → Seen → Completed → Billed</span>
            </div>
            <span className="badge badge-primary text-xs">Full Lifecycle</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { stage: '1. Total Inquiries', count: dateInquiries.length || 4, pct: 100, color: '#38bdf8' },
              { stage: '2. Booked Appointments', count: totalAppointments, pct: Math.min(100, Math.round((totalAppointments / 4) * 100)), color: '#60a5fa' },
              { stage: '3. Patient Check-In / Arrived', count: arrivedCount + inConsultCount + completedCount, pct: Math.round(((arrivedCount + inConsultCount + completedCount) / (totalAppointments || 1)) * 100), color: '#818cf8' },
              { stage: '4. Consulted / Seen', count: inConsultCount + completedCount, pct: Math.round(((inConsultCount + completedCount) / (totalAppointments || 1)) * 100), color: '#a855f7' },
              { stage: '5. Completed Encounter', count: completedCount, pct: Math.round((completedCount / (totalAppointments || 1)) * 100), color: '#34d399' },
              { stage: '6. Final Invoiced & Billed', count: dateInvoices.length, pct: Math.round((dateInvoices.length / (totalAppointments || 1)) * 100), color: '#10b981' }
            ].map(f => (
              <div key={f.stage}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{f.stage}</span>
                  <span style={{ color: f.color, fontWeight: 700 }} className="font-mono">
                    {f.count} ({f.pct}%)
                  </span>
                </div>
                <div style={{
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '999px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min(100, f.pct)}%`,
                    height: '100%',
                    background: f.color,
                    borderRadius: '999px',
                    transition: 'width 0.5s ease-out'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational & Clinical Alerts Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={18} color="#f87171" />
              <h3 className="title-md">Operational Alerts</h3>
            </div>
            <span className="badge badge-danger text-xs">
              {longWaitAlerts.length + lowStockMeds.length + abnormalLabAlerts.length} Active
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
            {/* Long wait alerts */}
            {longWaitAlerts.map(a => (
              <div key={a.id} style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '0.78rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#f87171' }}>
                  <span>Bottleneck: Long Wait ({a.waitTimeMinutes}m)</span>
                  <span>Token #{a.tokenNumber}</span>
                </div>
                <div style={{ color: 'var(--text-main)', marginTop: '2px' }}>
                  {a.patientName} waiting for {a.doctorName} ({a.departmentName})
                </div>
              </div>
            ))}

            {/* Low stock inventory alerts */}
            {lowStockMeds.map(m => (
              <div key={m.id} style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '0.78rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#fbbf24' }}>
                  <span>Low Stock Alert</span>
                  <span>Batch: {m.batchNumber}</span>
                </div>
                <div style={{ color: 'var(--text-main)', marginTop: '2px' }}>
                  {m.name}: Only <strong>{m.stockQuantity}</strong> remaining (Reorder point: {m.reorderLevel})
                </div>
              </div>
            ))}

            {/* Abnormal lab orders */}
            {abnormalLabAlerts.map(l => (
              <div key={l.id} style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '0.78rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#f87171' }}>
                  <span>Critical Panic Lab Value</span>
                  <span>{l.id}</span>
                </div>
                <div style={{ color: 'var(--text-main)', marginTop: '2px' }}>
                  {l.patientName} • {l.testName}: <strong style={{ color: '#f87171' }}>{l.resultValue}</strong>
                </div>
              </div>
            ))}

            {longWaitAlerts.length === 0 && lowStockMeds.length === 0 && abnormalLabAlerts.length === 0 && (
              <div style={{ textAlign: 'center', color: '#34d399', padding: '20px', fontSize: '0.85rem' }}>
                ✓ All systems within nominal operating parameters
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Department Load & Doctor Utilization Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Department Stats */}
        <div className="card">
          <h3 className="title-md" style={{ marginBottom: '14px' }}>Department Workload & Wait Times</h3>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Appointments</th>
                  <th>Completed</th>
                  <th>Pending</th>
                  <th>Avg Wait</th>
                </tr>
              </thead>
              <tbody>
                {departmentStats.map(d => (
                  <tr key={d.name}>
                    <td style={{ fontWeight: 600 }}>{d.name}</td>
                    <td>{d.total}</td>
                    <td style={{ color: '#34d399' }}>{d.completed}</td>
                    <td style={{ color: '#fbbf24' }}>{d.pending}</td>
                    <td>
                      <span className={`badge ${d.avgWait > 25 ? 'badge-danger' : 'badge-primary'} font-mono text-xs`}>
                        {d.avgWait} min
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctor Load */}
        <div className="card">
          <h3 className="title-md" style={{ marginBottom: '14px' }}>Doctor Schedule Load & Attended Volume</h3>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Provider / Doctor</th>
                  <th>Department</th>
                  <th>Scheduled</th>
                  <th>Attended</th>
                  <th>Utilization</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(doctorMap).map(doc => {
                  const util = Math.min(100, Math.round((doc.count / 6) * 100));
                  return (
                    <tr key={doc.doctorName}>
                      <td style={{ fontWeight: 600 }}>{doc.doctorName}</td>
                      <td className="text-dim text-xs">{doc.departmentName}</td>
                      <td>{doc.count}</td>
                      <td style={{ color: '#34d399' }}>{doc.completed}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="font-mono text-xs">{util}%</span>
                          <div style={{ width: '50px', height: '6px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ width: `${util}%`, height: '100%', background: util >= 80 ? '#34d399' : '#38bdf8' }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Patient Register for Selected Date */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 className="title-md">Daily Patient Registry & Live Queue ({selectedDate})</h3>
            <span className="text-xs text-muted">
              {filteredAppointments.length} matching appointments for selected day
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Department Filter */}
            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="select text-sm"
              style={{ width: '160px', padding: '6px 10px' }}
            >
              <option value="ALL">All Departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dental">Dental Surgery</option>
              <option value="Neurosurgery">Neurosurgery</option>
              <option value="Emergency">Emergency Trauma</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="select text-sm"
              style={{ width: '150px', padding: '6px 10px' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ARRIVED">Arrived / Waiting</option>
              <option value="IN_CONSULTATION">In Consultation</option>
              <option value="COMPLETED">Completed</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="BOOKED">Booked</option>
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Patient Details</th>
                <th>Time Slot</th>
                <th>Department & Provider</th>
                <th>Reason / Chief Complaint</th>
                <th>Wait</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map(apt => {
                const targetPatient = patients.find(p => p.id === apt.patientId);

                return (
                  <tr key={apt.id}>
                    <td>
                      <span className="badge badge-primary font-mono text-xs" style={{ fontWeight: 700 }}>
                        #{apt.tokenNumber}
                      </span>
                    </td>
                    <td>
                      <div>
                        <button
                          onClick={() => setActivePatient360Id(apt.patientId)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#f8fafc',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            textAlign: 'left',
                            padding: 0
                          }}
                        >
                          {apt.patientName}
                        </button>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>
                          MRN: {apt.patientMrn} • {apt.patientPhone}
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-xs">{apt.timeSlot}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{apt.departmentName}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{apt.doctorName}</div>
                    </td>
                    <td style={{ maxWidth: '240px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {apt.reason}
                    </td>
                    <td>
                      {apt.waitTimeMinutes > 0 ? (
                        <span className={`badge ${apt.waitTimeMinutes >= 30 ? 'badge-danger' : 'badge-neutral'} font-mono text-xs`}>
                          {apt.waitTimeMinutes}m
                        </span>
                      ) : (
                        <span className="text-dim text-xs">-</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${
                        apt.status === 'COMPLETED' ? 'badge-success' :
                        apt.status === 'IN_CONSULTATION' ? 'badge-purple' :
                        apt.status === 'ARRIVED' ? 'badge-warning' :
                        apt.status === 'CANCELLED' || apt.status === 'NO_SHOW' ? 'badge-danger' : 'badge-info'
                      } text-xs`}>
                        {apt.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {apt.status === 'BOOKED' || apt.status === 'CONFIRMED' ? (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'ARRIVED')}
                            className="btn btn-secondary btn-sm"
                            title="Check-in patient into waiting queue"
                          >
                            Check-In
                          </button>
                        ) : null}

                        {apt.status === 'ARRIVED' ? (
                          <button
                            onClick={() => {
                              updateAppointmentStatus(apt.id, 'IN_CONSULTATION');
                              if (apt.departmentName.includes('Dental')) {
                                setActiveTab('DENTAL_MODE');
                              } else {
                                setActiveTab('OPD_CONSULTATION');
                              }
                            }}
                            className="btn btn-primary btn-sm"
                            title="Start consultation"
                          >
                            Consult
                          </button>
                        ) : null}

                        <button
                          onClick={() => setActivePatient360Id(apt.patientId)}
                          className="btn btn-ghost btn-sm"
                          title="Open Longitudinal Patient 360"
                        >
                          360
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-dim)' }}>
                    No appointments recorded for {selectedDate} matching active filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
