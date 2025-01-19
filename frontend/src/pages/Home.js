import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../Home.module.css';
import PinComponent from '../components/PinComponent';

const Home = () => {
  const [showPin, setShowPin] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if PIN is already set
  useEffect(() => {
    checkPinStatus();
  }, []);

  const checkPinStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/check-pin-status');
      setIsFirstTime(!response.data.pinSet);
    } catch (error) {
      console.error('Error checking PIN status:', error);
      setError('Failed to check PIN status');
    }
  };

  const handleUnlockClick = () => {
    setShowPin(true); // Show the PIN modal
  };

  const handlePinSubmit = async (name, pin) => {
    try {
      const endpoint = isFirstTime ? 'set-pin' : 'verify-pin';
      const response = await axios.post(
        `http://localhost:5000/api/user/${endpoint}`,
        { name, pin }
      );

      if (response.status === 200 || response.status === 201) {
        setError('');
        setShowPin(false);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Failed to process request');
    }
  };

  const handleClosePinModal = () => {
    setShowPin(false); // Close the PIN modal
    setError(''); // Clear any errors
  };

  const features = [
    {
      title: 'Smart Wallet Management',
      description: 'Keep track of your money with our wallet system'
    },
    {
      title: 'Visual Analytics',
      description: 'Understand your spending and income patterns with beautiful charts'
    },
    {
      title: 'Budget Planning',
      description: 'Set and achieve your financial goals with ease'
    },
    {
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and protected'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Dear Eric Get Access to your{' '}
            <span className={styles.gradientText}>Smart Wallet</span>
          </h1>
          <p className={styles.subtitle}>
            Track your income, expenses, and budgets effortlessly with intelligent finance management platform.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.buttonWrapper}>
          <button onClick={handleUnlockClick} className={styles.ctaButton}>
            Unlock
          </button>
        </div>
      </div>

      {/* PIN Modal */}
      {showPin && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <button
              onClick={handleClosePinModal}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
            <PinComponent onPinSubmit={handlePinSubmit} isFirstTime={isFirstTime} />
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;