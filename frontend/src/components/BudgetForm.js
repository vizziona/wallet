import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

const BudgetForm = ({ onClose }) => {
  const { budget, updateBudget } = useContext(AppContext);
  const [formData, setFormData] = useState({ amount: '', period: 'monthly' });
  const [showConfirmModal, setShowConfirmModal] = useState(false); 
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  useEffect(() => {
    if (budget) {
      setFormData(budget);
    }
  }, [budget]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true); 
  };

  const handleAgree = () => {
    updateBudget(formData);
    setShowConfirmModal(false);
    setShowSuccessModal(true); 
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
        <input
          type="number"
          name="amount"
          placeholder="Budget Amount"
          value={formData.amount}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <select name="period" value={formData.period} onChange={handleChange} style={styles.select}>
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
        <button 
          type="submit" 
          style={styles.button}
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
        >
          Confirm
        </button>
      </form>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Are you sure?</h2>
            <p>Do you want to update your budget?</p>
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
            <p>Your budget has been updated successfully.</p>
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

export default BudgetForm;