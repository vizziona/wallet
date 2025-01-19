import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const TransactionForm = ({ onClose }) => {
  const { addTransaction } = useContext(AppContext);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    account: 'Cash',
    category: '',
    subcategory: '',
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) {
      alert('Please fill out all required fields.');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleAgree = async () => {
    try {
      await addTransaction(formData);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      setFormData({
        amount: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        account: 'Cash',
        category: '',
        subcategory: '',
      });
    } catch (error) {
      alert('Failed to add transaction. Please try again.');
      console.error('Error:', error);
    }
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onClose();
  };

  const styles = {
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#f9f9f9',
    },
    input: {
      padding: '0.75rem',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '1rem',
    },
    select: {
      padding: '0.75rem',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '1rem',
      backgroundColor: '#fff',
    },
    button: {
      padding: '0.75rem',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#007bff',
      color: '#fff',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    modal: {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
    },
    modalButton: {
      margin: '0.5rem',
      padding: '0.75rem 1.5rem',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'background-color 0.3s ease',
    },
    agreeButton: {
      backgroundColor: '#28a745',
      color: '#fff',
    },
    cancelButton: {
      backgroundColor: '#dc3545',
      color: '#fff',
    },
    successMessage: {
      color: '#28a745',
      fontSize: '1.5rem',
      marginBottom: '1rem',
    },
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div className="form-container">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <h5 className="mb-0">New Transaction</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleChange} style={styles.select}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required style={styles.input} />
            </div>
            <div className="form-group">
              <label>Account</label>
              <select name="account" value={formData.account} onChange={handleChange} style={styles.select}>
                <option value="Bank Account">Bank Account</option>
                <option value="Mobile Money Account">Mobile Money</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div className="form-group">
              <label>Subcategory</label>
              <input
                type="text"
                name="subcategory"
                placeholder="Subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          <button 
            type="submit" 
            style={styles.button}
            onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          >
            Add Transaction
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Are you sure?</h2>
            <p>Do you want to add this transaction?</p>
            <button 
              style={{ ...styles.modalButton, ...styles.agreeButton }} 
              onClick={handleAgree}
            >
              Agree
            </button>
            <button 
              style={{ ...styles.modalButton, ...styles.cancelButton }} 
              onClick={handleCloseConfirmModal}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Success Message Modal */}
      {showSuccessModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={styles.successMessage}>Success!</h2>
            <p>Your transaction has been added successfully.</p>
            <button 
              style={{ ...styles.modalButton, ...styles.agreeButton }} 
              onClick={handleCloseSuccessModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionForm;