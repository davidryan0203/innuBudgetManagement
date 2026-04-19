import React, { useContext, useState, useEffect } from 'react';
import { budgetService } from '../services/services';
import { AuthContext } from '../context/AuthContext';
import '../styles/BudgetManagement.css';

export const BudgetManagement = ({ onBudgetSelect, selectedBudgetId }) => {
  const { user } = useContext(AuthContext);
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(selectedBudgetId || null);
  const [lineItems, setLineItems] = useState([]);
  const [lineItemSearch, setLineItemSearch] = useState('');
  const [lineItemsPage, setLineItemsPage] = useState(1);
  const [lineItemsPerPage, setLineItemsPerPage] = useState(8);
  const [selectedLineItem, setSelectedLineItem] = useState(null);
  const [lineItemTransactions, setLineItemTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState('');
  const [transactionSearch, setTransactionSearch] = useState('');
  const [transactionPage, setTransactionPage] = useState(1);
  const [transactionsPerPage, setTransactionsPerPage] = useState(8);
  const [formData, setFormData] = useState({
    fiscalYear: '',
    studentEnrollment: '',
    school: '',
    department: '',
  });
  const [lineItemForm, setLineItemForm] = useState({
    category: '',
    description: '',
    allocatedAmount: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBudgets();
  }, []);

  useEffect(() => {
    if (selectedBudgetId) {
      setSelectedBudget(selectedBudgetId);
      fetchLineItems(selectedBudgetId);
    }
  }, [selectedBudgetId]);

  const fetchBudgets = async () => {
    try {
      const response = await budgetService.getBudgets();
      setBudgets(response.data);
    } catch (err) {
      setError('Failed to fetch budgets');
    }
  };

  const fetchLineItems = async (budgetId) => {
    try {
      const response = await budgetService.getLineItems(budgetId);
      setLineItems(response.data);
      setLineItemsPage(1);
      setSelectedLineItem(null);
      setLineItemTransactions([]);
      setTransactionsError('');
    } catch (err) {
      setError('Failed to fetch line items');
    }
  };

  const fetchLineItemTransactions = async (lineItem) => {
    if (!selectedBudget || !lineItem?._id) {
      return;
    }

    setSelectedLineItem(lineItem);
    setTransactionsLoading(true);
    setTransactionsError('');
    setTransactionSearch('');
    setTransactionPage(1);

    try {
      const response = await budgetService.getTransactions(selectedBudget, lineItem._id);
      setLineItemTransactions(response.data || []);
    } catch (err) {
      setTransactionsError('Failed to fetch transactions for this line item');
      setLineItemTransactions([]);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const closeTransactionsModal = () => {
    setSelectedLineItem(null);
    setLineItemTransactions([]);
    setTransactionsError('');
    setTransactionSearch('');
    setTransactionPage(1);
  };

  const normalizedSearch = lineItemSearch.trim().toLowerCase();
  const filteredLineItems = lineItems.filter((item) => {
    if (!normalizedSearch) {
      return true;
    }

    return [
      item.category,
      item.description,
      item.budget?.department,
      String(item.allocatedAmount),
      String(item.spentAmount),
      String(item.committedAmount),
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalizedSearch));
  });

  const totalLineItemPages = Math.max(1, Math.ceil(filteredLineItems.length / lineItemsPerPage));
  const safeCurrentPage = Math.min(lineItemsPage, totalLineItemPages);
  const pagedLineItems = filteredLineItems.slice(
    (safeCurrentPage - 1) * lineItemsPerPage,
    safeCurrentPage * lineItemsPerPage
  );

  const normalizedTransactionSearch = transactionSearch.trim().toLowerCase();
  const filteredModalTransactions = lineItemTransactions.filter((tx) => {
    if (!normalizedTransactionSearch) {
      return true;
    }

    return [
      tx.transactionId,
      tx.vendorName,
      tx.invoiceNumber,
      tx.purchaseOrderId,
      tx.paymentStatus,
      tx.amount,
      tx.date,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalizedTransactionSearch));
  });

  const totalTransactionPages = Math.max(1, Math.ceil(filteredModalTransactions.length / transactionsPerPage));
  const safeTransactionPage = Math.min(transactionPage, totalTransactionPages);
  const pagedModalTransactions = filteredModalTransactions.slice(
    (safeTransactionPage - 1) * transactionsPerPage,
    safeTransactionPage * transactionsPerPage
  );

  const handleCreateBudget = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await budgetService.createBudget(formData);
      setFormData({ fiscalYear: '', studentEnrollment: '', school: '', department: '' });
      fetchBudgets();
      setError('');
    } catch (err) {
      setError('Failed to create budget');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLineItem = async (e) => {
    e.preventDefault();
    if (!selectedBudget) {
      setError('Please select a budget first');
      return;
    }
    setLoading(true);
    try {
      await budgetService.addLineItem({
        budgetId: selectedBudget,
        ...lineItemForm,
        allocatedAmount: parseFloat(lineItemForm.allocatedAmount),
      });
      setLineItemForm({ category: '', description: '', allocatedAmount: '' });
      fetchLineItems(selectedBudget);
      setError('');
    } catch (err) {
      setError('Failed to add line item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="budget-management">
      <h1>Budget Management</h1>

      <div className="management-grid">
        {/* Create Budget Form */}
        <div className="form-section">
          <h2>Create New Budget</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleCreateBudget}>
            <div className="form-group">
              <label>Fiscal Year</label>
              <input
                type="text"
                placeholder="e.g., 2026-2027"
                value={formData.fiscalYear}
                onChange={(e) => setFormData({ ...formData, fiscalYear: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Student Enrollment</label>
              <input
                type="number"
                value={formData.studentEnrollment}
                onChange={(e) => setFormData({ ...formData, studentEnrollment: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>School</label>
              <input
                type="text"
                placeholder="e.g., SIS, NIMS"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                required
              />
            </div>
            {user?.role === 'admin' && (
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  placeholder="e.g., IT Department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                />
              </div>
            )}
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Budget'}
            </button>
          </form>
        </div>

        {/* Budgets List */}
        <div className="budgets-section">
          <h2>Existing Budgets</h2>
          <div className="budgets-list">
            {budgets.map((budget) => (
              <div
                key={budget._id}
                className={`budget-item ${selectedBudget === budget._id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedBudget(budget._id);
                  if (onBudgetSelect) {
                    onBudgetSelect(budget._id);
                  }
                  fetchLineItems(budget._id);
                }}
              >
                <h3>{budget.fiscalYear}</h3>
                <p>School: {budget.school}</p>
                <p>Department: {budget.department}</p>
                <p>Status: <span className={`status-${budget.status}`}>{budget.status}</span></p>
                <p>Total Budget: ${budget.totalBudget?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Line Item Form */}
      {selectedBudget && (
        <div className="form-section">
          <h2>Add Line Item</h2>
          <form onSubmit={handleAddLineItem}>
            <div className="form-group">
              <label>Category</label>
              <select
                value={lineItemForm.category}
                onChange={(e) => setLineItemForm({ ...lineItemForm, category: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                <option value="Hardware-SIS">Hardware - SIS</option>
                <option value="Software-SIS">Software - SIS</option>
                <option value="Hardware-NIMS">Hardware - NIMS</option>
                <option value="Software-NIMS">Software - NIMS</option>
                <option value="Telecommunications">Telecommunications / Network</option>
                <option value="IT-Support">IT Support / Outsourcing</option>
                <option value="Training">Training and Development</option>
                <option value="Copier-SIS">Copier - SIS</option>
                <option value="Copier-NIMS">Copier - NIMS</option>
                <option value="Copier-Board">Copier - Board</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                value={lineItemForm.description}
                onChange={(e) => setLineItemForm({ ...lineItemForm, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Allocated Amount</label>
              <input
                type="number"
                value={lineItemForm.allocatedAmount}
                onChange={(e) => setLineItemForm({ ...lineItemForm, allocatedAmount: e.target.value })}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Line Item'}
            </button>
          </form>
        </div>
      )}

      {/* Line Items Table */}
      {lineItems.length > 0 && (
        <div className="line-items-section">
          <h2>Line Items</h2>

          <div className="line-items-toolbar">
            <input
              type="text"
              className="line-items-search"
              placeholder="Search by category, description, or department"
              value={lineItemSearch}
              onChange={(e) => {
                setLineItemSearch(e.target.value);
                setLineItemsPage(1);
              }}
            />

            <div className="line-items-toolbar-right">
              <label htmlFor="line-items-page-size">Rows</label>
              <select
                id="line-items-page-size"
                value={lineItemsPerPage}
                onChange={(e) => {
                  setLineItemsPerPage(Number(e.target.value));
                  setLineItemsPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          <div className="line-items-table-wrapper">
            <table className="line-items-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Department</th>
                  <th>Allocated</th>
                  <th>Spent</th>
                  <th>Committed</th>
                  <th>Remaining</th>
                  <th>Transactions</th>
                </tr>
              </thead>
              <tbody>
                {pagedLineItems.map((item) => (
                  <tr key={item._id}>
                    <td>{item.category}</td>
                    <td className="line-item-description" title={item.description || ''}>{item.description || 'N/A'}</td>
                    <td>{item.budget?.department || 'N/A'}</td>
                    <td>${item.allocatedAmount?.toLocaleString()}</td>
                    <td>${item.spentAmount?.toLocaleString()}</td>
                    <td>${item.committedAmount?.toLocaleString()}</td>
                    <td>${(item.allocatedAmount - item.spentAmount - item.committedAmount)?.toLocaleString()}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => fetchLineItemTransactions(item)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {pagedLineItems.length === 0 && (
                  <tr>
                    <td colSpan={8}>No line items match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="line-items-pagination">
            <p>
              Showing {pagedLineItems.length === 0 ? 0 : (safeCurrentPage - 1) * lineItemsPerPage + 1}
              -{Math.min(safeCurrentPage * lineItemsPerPage, filteredLineItems.length)} of {filteredLineItems.length}
            </p>

            <div className="line-items-pagination-buttons">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setLineItemsPage((prev) => Math.max(1, prev - 1))}
                disabled={safeCurrentPage === 1}
              >
                Previous
              </button>
              <span>Page {safeCurrentPage} of {totalLineItemPages}</span>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setLineItemsPage((prev) => Math.min(totalLineItemPages, prev + 1))}
                disabled={safeCurrentPage === totalLineItemPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedLineItem && (
        <div className="transactions-modal-overlay" onClick={closeTransactionsModal}>
          <div
            className="transactions-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Line item transactions"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="transactions-modal-header">
              <div>
                <h3>Transactions for {selectedLineItem.category}</h3>
                <p className="line-item-meta">{selectedLineItem.description || 'No description provided'}</p>
              </div>
              <button type="button" className="btn-secondary" onClick={closeTransactionsModal}>
                Close
              </button>
            </div>

            {transactionsError && <div className="error-message">{transactionsError}</div>}
            {transactionsLoading && <p>Loading transactions...</p>}

            {!transactionsLoading && !transactionsError && lineItemTransactions.length === 0 && (
              <p>No transactions found for this line item.</p>
            )}

            {!transactionsLoading && lineItemTransactions.length > 0 && (
              <>
                <div className="line-items-toolbar modal-toolbar">
                  <input
                    type="text"
                    className="line-items-search"
                    placeholder="Search transactions by ID, vendor, invoice, PO ID, or status"
                    value={transactionSearch}
                    onChange={(e) => {
                      setTransactionSearch(e.target.value);
                      setTransactionPage(1);
                    }}
                  />

                  <div className="line-items-toolbar-right">
                    <label htmlFor="transactions-page-size">Rows</label>
                    <select
                      id="transactions-page-size"
                      value={transactionsPerPage}
                      onChange={(e) => {
                        setTransactionsPerPage(Number(e.target.value));
                        setTransactionPage(1);
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={8}>8</option>
                      <option value={12}>12</option>
                      <option value={20}>20</option>
                    </select>
                  </div>
                </div>

                <div className="line-items-table-wrapper">
                  <table className="line-items-table transactions-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Transaction ID</th>
                        <th>Amount</th>
                        <th>Vendor</th>
                        <th>Invoice</th>
                        <th>PO ID</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedModalTransactions.map((tx) => (
                        <tr key={tx._id}>
                          <td>{new Date(tx.date).toLocaleDateString()}</td>
                          <td className="line-item-id" title={tx.transactionId}>{tx.transactionId}</td>
                          <td>${tx.amount?.toLocaleString()}</td>
                          <td>{tx.vendorName || 'N/A'}</td>
                          <td>{tx.invoiceNumber || 'N/A'}</td>
                          <td>{tx.purchaseOrderId || 'N/A'}</td>
                          <td>{tx.paymentStatus || 'N/A'}</td>
                        </tr>
                      ))}
                      {pagedModalTransactions.length === 0 && (
                        <tr>
                          <td colSpan={7}>No transactions match your search.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="line-items-pagination">
                  <p>
                    Showing {pagedModalTransactions.length === 0 ? 0 : (safeTransactionPage - 1) * transactionsPerPage + 1}
                    -{Math.min(safeTransactionPage * transactionsPerPage, filteredModalTransactions.length)} of {filteredModalTransactions.length}
                  </p>

                  <div className="line-items-pagination-buttons">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setTransactionPage((prev) => Math.max(1, prev - 1))}
                      disabled={safeTransactionPage === 1}
                    >
                      Previous
                    </button>
                    <span>Page {safeTransactionPage} of {totalTransactionPages}</span>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setTransactionPage((prev) => Math.min(totalTransactionPages, prev + 1))}
                      disabled={safeTransactionPage === totalTransactionPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
