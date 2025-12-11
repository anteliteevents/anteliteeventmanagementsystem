/**
 * Payments Department View Component
 * 
 * Enhanced payments department view with modern UI, skeleton loaders, and full CRUD operations.
 * 
 * @component
 */

import React, { useState } from 'react';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import api from '../../../services/api';

interface PaymentsDepartmentViewProps {
  data: any;
  loading?: boolean;
  error?: string | null;
  onRefresh: () => void;
}

const PaymentsDepartmentView: React.FC<PaymentsDepartmentViewProps> = ({ data, loading = false, error = null, onRefresh }) => {
  const [showEditInvoiceModal, setShowEditInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [invoiceForm, setInvoiceForm] = useState({
    amount: '',
    taxAmount: '',
    status: '',
    dueDate: ''
  });

  const handleUpdateInvoice = async () => {
    if (!selectedInvoice) return;
    try {
      await api.put(`/invoices/${selectedInvoice.id}`, {
        amount: invoiceForm.amount ? parseFloat(invoiceForm.amount) : undefined,
        taxAmount: invoiceForm.taxAmount ? parseFloat(invoiceForm.taxAmount) : undefined,
        status: invoiceForm.status || undefined,
        dueDate: invoiceForm.dueDate ? new Date(invoiceForm.dueDate).toISOString() : undefined
      });
      setShowEditInvoiceModal(false);
      setSelectedInvoice(null);
      onRefresh();
      alert('Invoice updated successfully!');
    } catch (error: any) {
      alert('Error updating invoice: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!window.confirm('Are you sure you want to delete this invoice? Only draft/cancelled invoices can be deleted.')) return;
    try {
      await api.delete(`/invoices/${invoiceId}`);
      onRefresh();
      alert('Invoice deleted successfully!');
    } catch (error: any) {
      alert('Error deleting invoice: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const handleDuplicateInvoice = async (invoiceId: string) => {
    try {
      await api.post(`/invoices/${invoiceId}/duplicate`);
      onRefresh();
      alert('Invoice duplicated successfully!');
    } catch (error: any) {
      alert('Error duplicating invoice: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  const openEditInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setInvoiceForm({
      amount: invoice.amount?.toString() || '',
      taxAmount: invoice.taxAmount?.toString() || '',
      status: invoice.status || '',
      dueDate: invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : ''
    });
    setShowEditInvoiceModal(true);
  };
  if (loading || !data) {
    return (
      <div className="payments-view enhanced-view">
        <div className="loading-skeleton">
          <div className="skeleton-stats">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-stat-card">
                <SkeletonLoader width={60} height={60} variant="circular" />
                <div className="skeleton-stat-content">
                  <SkeletonLoader width={120} height={24} />
                  <SkeletonLoader width={80} height={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payments-view enhanced-view">
        <div className="error-message enhanced-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>⚠️ Error Loading Payments Data</h3>
          <p>{error}</p>
          <button onClick={onRefresh} className="btn-primary enhanced-btn" style={{ marginTop: '1rem' }}>
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payments-view enhanced-view">
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>💳 Payments & Invoices Management</h2>
      </div>

      <div className="sales-overview">
        <div className="sales-card revenue-card enhanced-card">
          <div className="card-header">
            <h3>💳 Total Revenue</h3>
            <button onClick={onRefresh} className="btn-refresh-small" aria-label="Refresh data">
              🔄
            </button>
          </div>
          <div className="card-value">${data.totalRevenue?.toLocaleString() || '0'}</div>
          <div className="card-footer">From all transactions</div>
        </div>

        <div className="sales-card enhanced-card">
          <div className="card-header">
            <h3>✅ Completed Payments</h3>
          </div>
          <div className="card-value">{data.completedPayments || 0}</div>
          <div className="card-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-label">Pending:</span>
              <span className="breakdown-value">{data.pendingPayments || 0}</span>
            </div>
          </div>
        </div>

        <div className="sales-card enhanced-card">
          <div className="card-header">
            <h3>📄 Invoices</h3>
          </div>
          <div className="card-value">{data.totalInvoices || 0}</div>
          <div className="card-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-label">Paid:</span>
              <span className="breakdown-value available">{data.paidInvoices || 0}</span>
            </div>
          </div>
        </div>

        <div className="sales-card enhanced-card">
          <div className="card-header">
            <h3>📊 Total Transactions</h3>
          </div>
          <div className="card-value">{data.totalTransactions || 0}</div>
        </div>
      </div>

      <div className="sales-section enhanced-section">
        <h2>💳 Recent Transactions</h2>
        <div className="events-sales-list">
          {data.transactions?.slice(0, 10).map((transaction: any) => (
            <div key={transaction.id} className="event-sales-item enhanced-item">
              <div className="event-sales-header">
                <h4>Transaction {transaction.id.slice(0, 8)}</h4>
                <span className={`event-status status-${transaction.status}`}>{transaction.status}</span>
              </div>
              <div className="event-sales-stats">
                <div className="stat-mini">
                  <span className="stat-mini-label">Amount:</span>
                  <span className="stat-mini-value">${parseFloat(transaction.amount || 0).toLocaleString()}</span>
                </div>
                <div className="stat-mini">
                  <span className="stat-mini-label">Method:</span>
                  <span className="stat-mini-value">{transaction.paymentMethod || 'N/A'}</span>
                </div>
                <div className="stat-mini">
                  <span className="stat-mini-label">Date:</span>
                  <span className="stat-mini-value">{new Date(transaction.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
          {(!data.transactions || data.transactions.length === 0) && (
            <div className="no-stats">No transactions yet</div>
          )}
        </div>
      </div>

      <div className="sales-section enhanced-section">
        <h2>📄 Recent Invoices</h2>
        <div className="events-sales-list">
          {data.invoices?.slice(0, 10).map((invoice: any) => (
            <div key={invoice.id} className="event-sales-item enhanced-item">
              <div className="event-sales-header">
                <h4>{invoice.invoice_number}</h4>
                <span className={`event-status status-${invoice.status}`}>{invoice.status}</span>
              </div>
              <div className="event-sales-stats">
                <div className="stat-mini">
                  <span className="stat-mini-label">Amount:</span>
                  <span className="stat-mini-value">${parseFloat(invoice.total_amount || 0).toLocaleString()}</span>
                </div>
                <div className="stat-mini">
                  <span className="stat-mini-label">Event:</span>
                  <span className="stat-mini-value">{invoice.event_name || 'N/A'}</span>
                </div>
                <div className="stat-mini">
                  <span className="stat-mini-label">Booth:</span>
                  <span className="stat-mini-value">{invoice.booth_number || 'N/A'}</span>
                </div>
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => openEditInvoice(invoice)}
                  className="btn-action-small"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDuplicateInvoice(invoice.id)}
                  className="btn-action-small"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', backgroundColor: '#FF9800' }}
                >
                  📋 Duplicate
                </button>
                {(invoice.status === 'draft' || invoice.status === 'cancelled') && (
                  <button
                    onClick={() => handleDeleteInvoice(invoice.id)}
                    className="btn-action-small"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', backgroundColor: '#f44336' }}
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            </div>
          ))}
          {(!data.invoices || data.invoices.length === 0) && (
            <div className="no-stats">No invoices yet</div>
          )}
        </div>
      </div>

      {/* Edit Invoice Modal */}
      {showEditInvoiceModal && selectedInvoice && (
        <div className="modal-overlay" onClick={() => setShowEditInvoiceModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Invoice</h2>
              <button className="btn-close" onClick={() => setShowEditInvoiceModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={invoiceForm.amount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Tax Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={invoiceForm.taxAmount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, taxAmount: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={invoiceForm.status}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, status: e.target.value })}
                >
                  <option value="">Select Status</option>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowEditInvoiceModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleUpdateInvoice}>Update Invoice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsDepartmentView;

