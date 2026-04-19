import React, { useState, useEffect } from 'react';
import { budgetService } from '../services/services';
import '../styles/Transactions.css';

export const TransactionEntry = ({ budgetId }) => {
  const [lineItems, setLineItems] = useState([]);
  const [formData, setFormData] = useState({
    lineItemId: '',
    transactionId: '',
    amount: '',
    date: '',
    vendorName: '',
    invoiceNumber: '',
    purchaseOrderId: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLineItems = async () => {
      if (!budgetId) {
        setLineItems([]);
        return;
      }

      try {
        const response = await budgetService.getLineItems(budgetId);
        setLineItems(response.data || []);
      } catch (err) {
        setError('Failed to load line items for this budget');
      }
    };

    loadLineItems();
  }, [budgetId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await budgetService.recordTransaction({
        ...formData,
        budgetId,
        amount: parseFloat(formData.amount),
      });
      setSuccess('Transaction recorded successfully!');
      setFormData({
        lineItemId: '',
        transactionId: '',
        amount: '',
        date: '',
        vendorName: '',
        invoiceNumber: '',
        purchaseOrderId: '',
      });
    } catch (err) {
      setError('Failed to record transaction');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-entry">
      <h1>Record Transaction</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Line Item</label>
          <select
            name="lineItemId"
            value={formData.lineItemId}
            onChange={handleChange}
            required
          >
            <option value="">Select a line item</option>
            {lineItems.map((item) => (
              <option key={item._id} value={item._id}>
                {item.category} - {item.description || 'No description'}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Transaction ID (Unique)</label>
          <input
            type="text"
            name="transactionId"
            value={formData.transactionId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Vendor Name</label>
          <input
            type="text"
            name="vendorName"
            value={formData.vendorName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Invoice Number</label>
          <input
            type="text"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Purchase Order ID</label>
          <input
            type="text"
            name="purchaseOrderId"
            value={formData.purchaseOrderId}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Recording...' : 'Record Transaction'}
        </button>
      </form>
    </div>
  );
};
