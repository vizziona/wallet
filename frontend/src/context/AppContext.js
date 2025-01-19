import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budget, setBudget] = useState(null);
  const [user, setUser] = useState(null); 
  
  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const response = await axios.get('https://wallet-fdje.onrender.com/api/transactions');
      console.log('Fetched transactions:', response.data);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      alert('Failed to fetch transactions. Please try again.');
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://wallet-fdje.onrender.com/api/categories');
      console.log('Fetched categories:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to fetch categories. Please try again.');
    }
  };

  // Fetch budget
  const fetchBudget = async () => {
    try {
      const response = await axios.get('https://wallet-fdje.onrender.com/api/budget');
      console.log('Fetched budget:', response.data);
      setBudget(response.data);
    } catch (error) {
      console.error('Error fetching budget:', error);
      alert('Failed to fetch budget. Please try again.');
    }
  };

  // Add a new transaction
  const addTransaction = async (transaction) => {
    try {
      console.log('Sending transaction to backend:', transaction); 
      const response = await axios.post('https://wallet-fdje.onrender.com/api/transactions', transaction);
      console.log('Backend response:', response.data); 
      setTransactions([...transactions, response.data]);
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction. Please try again.');
    }
  };

  // Add a new category
  const addCategory = async (category) => {
    try {
      console.log('Sending category to backend:', category);
      const response = await axios.post('https://wallet-fdje.onrender.com/api/categories', category);
      console.log('Backend response:', response.data); 
      setCategories([...categories, response.data]);
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category. Please try again.');
    }
  };

  // Update budget
  const updateBudget = async (newBudget) => {
    try {
      console.log('Sending budget to backend:', newBudget);
      const response = await axios.post('https://wallet-fdje.onrender.com/api/budget', newBudget);
      console.log('Backend response:', response.data); 
      setBudget(response.data);
    } catch (error) {
      console.error('Error updating budget:', error);
      alert('Failed to update budget. Please try again.');
    }
  };

  // Load initial data
  useEffect(() => {
    fetchTransactions();
    fetchCategories();
    fetchBudget();
  }, []);

  return (
    <AppContext.Provider
      value={{
        transactions,
        categories,
        budget,
        user, 
        setUser, 
        addTransaction,
        addCategory,
        updateBudget,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };