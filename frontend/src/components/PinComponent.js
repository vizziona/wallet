import React, { useState } from 'react';

const PinComponent = ({ onPinSubmit, isFirstTime }) => {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const containerStyle = {
    padding: '2rem',
    maxWidth: '400px',
    margin: '2rem auto',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const titleStyle = {
    fontSize: '1.5rem',
    color: '#2d3748',
    marginBottom: '1.5rem',
    fontWeight: '600'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    margin: '0.5rem 0',
    border: '1px solid #e2e8f0',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    transition: 'border-color 0.2s ease',
    outline: 'none'
  };

  const buttonStyle = {
    backgroundColor: '#4299e1',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.375rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
    marginTop: '1rem',
    transition: 'background-color 0.2s ease'
  };

  const errorStyle = {
    color: '#e53e3e',
    marginTop: '0.5rem',
    fontSize: '0.875rem'
  };

  const validatePin = (pin) => {
    return /^\d{5}$/.test(pin);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedPin = pin.trim();

    if (!trimmedName) {
      setError('Name is required');
      return;
    }

    if (!validatePin(trimmedPin)) {
      setError('PIN must be exactly 5 digits');
      return;
    }

    if (isFirstTime) {
      if (!validatePin(confirmPin)) {
        setError('Confirmation PIN must be exactly 5 digits');
        return;
      }
      
      if (trimmedPin !== confirmPin) {
        setError('PINs do not match');
        return;
      }
    }

    onPinSubmit(trimmedName, trimmedPin);
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>
        {isFirstTime ? 'Set Your Name and PIN' : 'Enter Your Name and PIN'}
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Name"
          style={inputStyle}
        />
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength="5"
          placeholder="Enter PIN"
          style={inputStyle}
        />
        {isFirstTime && (
          <input
            type="password"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
            maxLength="5"
            placeholder="Confirm PIN"
            style={inputStyle}
          />
        )}
        <button 
          type="submit" 
          style={buttonStyle}
          onMouseOver={e => e.target.style.backgroundColor = '#3182ce'}
          onMouseOut={e => e.target.style.backgroundColor = '#4299e1'}
        >
          Submit
        </button>
      </form>
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
};

export default PinComponent;