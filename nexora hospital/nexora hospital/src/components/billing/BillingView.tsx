import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice, PaymentMethod } from '../../types';
import { 
  Receipt, DollarSign, CreditCard, Shield, CheckCircle2, 
  Printer, AlertCircle, Plus, FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BillingView: React.FC = () => {
  const { invoices, payInvoice, showToast } = useApp();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CREDIT_CARD');
  const [showReceiptModal, setShowReceiptModal] = useState<Invoice | null>(null);

  const totalBilled = invoices.reduce((s, i) => s + i.grandTotal, 0);
  const totalPaid = invoices.reduce((s, i) => s + i.paidAmount, 0);
  const totalOutstanding = invoices.reduce((s, i) => s + i.outstandingAmount, 0);

  const handleOpenPayment = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setPaymentAmount(inv.outstandingAmount);
  };

  const handleConfirmPayment = () => {
    if (!selectedInvoice || paymentAmount <= 0) return;
    payInvoice(selectedInvoice.id, paymentAmount, paymentMethod);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
    setShowReceiptModal({ ...selectedInvoice, paidAmount: selectedInvoice.paidAmount + paymentAmount, outstandingAmount: Math.max(0, selectedInvoice.grandTotal - (selectedInvoice.paidAmount + paymentAmount)) });
    setSelectedInvoice(null);
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
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
          }}>
            <Receipt size={22} color="#ffffff" />
          </div>
          <div>
            <h1 className="title-lg">Billing, Cashier & Insurance / TPA Ledger</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Charge capture, cashless TPA insurance claims, multi-tender payments & immutable audit trail.
            </p>
          </div>
        </div>

        {/* Financial Summary Badges */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="card" style={{ padding: '8px 14px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>TOTAL BILLED</span>
            <strong style={{ fontSize: '1.1rem', color: '#f8fafc' }}>${totalBilled.toFixed(2)}</strong>
          </div>
          <div className="card" style={{ padding: '8px 14px', borderLeft: '3px solid #10b981' }}>
            <span style={{ fontSize: '0.7rem', color: '#34d399', display: 'block' }}>COLLECTED</span>
            <strong style={{ fontSize: '1.1rem', color: '#34d399' }}>${totalPaid.toFixed(2)}</strong>
          </div>
          <div className="card" style={{ padding: '8px 14px', borderLeft: '3px solid #f87171' }}>
            <span style={{ fontSize: '0.7rem', color: '#f87171', display: 'block' }}>OUTSTANDING / TPA</span>
            <strong style={{ fontSize: '1.1rem', color: '#f87171' }}>${totalOutstanding.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 className="title-md">Institutional Financial Ledger</h3>
          <span className="badge badge-primary text-xs">{invoices.length} Invoices</span>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Patient Details</th>
                <th>Date</th>
                <th>Line Items & Charge Breakdown</th>
                <th>Grand Total</th>
                <th>Paid</th>
                <th>Outstanding</th>
                <th>Payment Mode</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td className="font-mono" style={{ fontWeight: 700, color: '#38bdf8' }}>
                    {inv.invoiceNumber}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{inv.patientName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>MRN: {inv.patientMrn}</div>
                  </td>
                  <td className="font-mono text-xs">{inv.date}</td>
                  <td style={{ maxWidth: '280px', fontSize: '0.78rem' }}>
                    {inv.items.map((it, idx) => (
                      <div key={idx} style={{ color: 'var(--text-muted)' }}>
                        • {it.description} (${it.total.toFixed(2)})
                      </div>
                    ))}
                  </td>
                  <td className="font-mono text-xs" style={{ fontWeight: 800 }}>
                    ${inv.grandTotal.toFixed(2)}
                  </td>
                  <td className="font-mono text-xs" style={{ color: '#10b981', fontWeight: 700 }}>
                    ${inv.paidAmount.toFixed(2)}
                  </td>
                  <td className="font-mono text-xs" style={{ color: inv.outstandingAmount > 0 ? '#ef4444' : 'var(--text-dim)', fontWeight: 700 }}>
                    ${inv.outstandingAmount.toFixed(2)}
                  </td>
                  <td>
                    <span className="badge badge-neutral text-xs font-mono">{inv.paymentMethod}</span>
                    {inv.insuranceClaimNumber && (
                      <div style={{ fontSize: '0.65rem', color: '#60a5fa', marginTop: '2px' }}>
                        {inv.insuranceClaimNumber}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${
                      inv.status === 'PAID' ? 'badge-success' :
                      inv.status === 'PARTIALLY_PAID' ? 'badge-warning' : 'badge-danger'
                    } text-xs`}>
                      {inv.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {inv.outstandingAmount > 0 ? (
                        <button
                          onClick={() => handleOpenPayment(inv)}
                          className="btn btn-primary btn-sm"
                        >
                          <DollarSign size={13} /> Pay
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowReceiptModal(inv)}
                          className="btn btn-secondary btn-sm"
                          title="Print Receipt"
                        >
                          <Printer size={13} /> Receipt
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Processing Modal */}
      {selectedInvoice && (
        <div className="modal-overlay" onClick={() => setSelectedInvoice(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 className="title-md">Collect Payment & Settle Invoice</h3>
              <button onClick={() => setSelectedInvoice(null)} className="btn btn-ghost btn-sm">✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <strong>Invoice:</strong> {selectedInvoice.invoiceNumber}<br />
                <strong>Patient:</strong> {selectedInvoice.patientName} ({selectedInvoice.patientMrn})<br />
                <strong>Total Outstanding:</strong> <span style={{ color: '#ef4444', fontWeight: 800 }}>${selectedInvoice.outstandingAmount.toFixed(2)}</span>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Amount ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  max={selectedInvoice.outstandingAmount}
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="input font-mono text-sm"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method Tender *</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="select"
                >
                  <option value="CREDIT_CARD">Credit / Debit Card (EMV Chip / Contactless)</option>
                  <option value="UPI">UPI / Digital QR Instant Payment</option>
                  <option value="CASH">Cash Drawer Counter</option>
                  <option value="INSURANCE_TPA">Cashless TPA Health Insurance Claim</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setSelectedInvoice(null)} className="btn btn-ghost">Cancel</button>
              <button onClick={handleConfirmPayment} className="btn btn-primary">
                Process Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {showReceiptModal && (
        <div className="modal-overlay" onClick={() => setShowReceiptModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="title-md">Official Hospital Payment Receipt</h3>
              <button onClick={() => setShowReceiptModal(null)} className="btn btn-ghost btn-sm">✕</button>
            </div>
            <div className="modal-body" style={{ background: '#ffffff', color: '#0f172a', padding: '24px', borderRadius: '8px' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0284c7', paddingBottom: '10px', marginBottom: '14px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0369a1' }}>NEXORA HEALTHCARE GROUP</h2>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>North Campus Medical District • GSTIN: 29AABCN8891Z1Z0</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '4px' }}>RECEIPT / BILL OF SUPPLY</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '12px' }}>
                <div><strong>Receipt #:</strong> {showReceiptModal.invoiceNumber}</div>
                <div><strong>Date:</strong> {showReceiptModal.date}</div>
              </div>

              <div style={{ fontSize: '0.8rem', marginBottom: '14px', background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
                <strong>Patient:</strong> {showReceiptModal.patientName} ({showReceiptModal.patientMrn})
              </div>

              <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse', marginBottom: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                    <th style={{ textAlign: 'left', padding: '4px 0' }}>Item Description</th>
                    <th style={{ textAlign: 'right', padding: '4px 0' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {showReceiptModal.items.map((it, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '6px 0' }}>{it.description}</td>
                      <td style={{ textAlign: 'right', padding: '6px 0' }}>${it.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ borderTop: '2px solid #0f172a', paddingTop: '8px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Amount Paid:</span>
                  <strong style={{ color: '#059669', fontSize: '1rem' }}>${showReceiptModal.paidAmount.toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                  <span>Tender Mode:</span>
                  <span>{showReceiptModal.paymentMethod}</span>
                </div>
              </div>

              <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.7rem', color: '#64748b' }}>
                ✓ System-generated computer receipt. No signature required.
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => window.print()} className="btn btn-primary">
                <Printer size={16} /> Print Receipt
              </button>
              <button onClick={() => setShowReceiptModal(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
