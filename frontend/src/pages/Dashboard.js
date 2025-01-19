import React, { useContext, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Plus, AlertCircle, Filter, Download, Wallet, LogOut } from 'lucide-react';
import { AppContext } from '../context/AppContext'; 
import TransactionForm from '../components/TransactionForm';
import BudgetForm from '../components/BudgetForm';
import backgroundImage from '../assets/background.png';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { transactions, budget, setUser } = useContext(AppContext);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const navigate = useNavigate();

  // Memoized calculations
  const { totalIncome, totalExpenses, currentSpending, categoryData, chartData } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Calculate category totals for pie chart
    const categoryTotals = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {});

    const categoryChartData = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
    }));

    // Prepare data for line chart
    const timelineData = transactions.reduce((acc, t) => {
      const date = new Date(t.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, income: 0, expenses: 0 };
      }
      if (t.type === 'income') {
        acc[date].income += Number(t.amount);
      } else {
        acc[date].expenses += Number(t.amount);
      }
      return acc;
    }, {});

    return {
      totalIncome: income,
      totalExpenses: expenses,
      currentSpending: expenses,
      categoryData: categoryChartData,
      chartData: Object.values(timelineData).sort((a, b) => new Date(a.date) - new Date(b.date)),
    };
  }, [transactions]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF99E6', '#AF19FF'];

  console.log('Budget:', budget);
  console.log('Transactions:', transactions);

  // Logout function
  const handleLogout = () => {
    setUser(null); 
    navigate('/'); 
  };

  return (
    <div
      className="min-vh-100 p-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Semi-transparent overlay */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
          minHeight: '100vh',
          padding: '2rem',
          borderRadius: '10px', 
        }}
      >
        <div className="container-fluid">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h2 mb-0 text-black fw-bold">Transactions Dashboard</h1>
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
                onClick={() => setShowTransactionForm(true)}
              >
                <Plus size={20} />
                Add Transaction
              </button>
              <button
                className="btn btn-secondary d-flex align-items-center gap-2 shadow-sm"
                onClick={() => setShowBudgetForm(true)}
              >
                <Wallet size={20} />
                Set Budget
              </button>
              {/* Logout Button */}
              <button
                className="btn btn-danger d-flex align-items-center gap-2 shadow-sm"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>

          {/* Render the TransactionForm component */}
          {showTransactionForm && (
            <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <TransactionForm onClose={() => setShowTransactionForm(false)} />
                </div>
              </div>
            </div>
          )}

          {/* Render the BudgetForm component */}
          {showBudgetForm && (
            <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Set Budget</h5>
                    <button type="button" className="btn-close" onClick={() => setShowBudgetForm(false)}></button>
                  </div>
                  <div className="modal-body">
                    <BudgetForm onClose={() => setShowBudgetForm(false)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Budget Alert */}
          {budget && currentSpending > Number(budget.amount) && (
            <div className="alert alert-danger d-flex align-items-center mb-4 shadow-sm">
              <AlertCircle size={20} className="me-2" />
              <span>
                Budget exceeded! You're {(currentSpending - Number(budget.amount)).toFixed(2)} RWF over your {budget.period}{' '}
                budget.
              </span>
            </div>
          )}

          {/* Quick Stats */}
          <div className="row mb-4 g-3">
            <div className="col-md-3">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center text-success mb-2">
                    <Wallet size={20} className="me-2" />
                    <h5 className="card-title mb-0">Total Income</h5>
                  </div>
                  <p className="h3 mb-0 fw-bold">{totalIncome.toFixed(2)} RWF</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center text-danger mb-2">
                    <Wallet size={20} className="me-2" />
                    <h5 className="card-title mb-0">Total Expenses</h5>
                  </div>
                  <p className="h3 mb-0 fw-bold">{totalExpenses.toFixed(2)} RWF</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center text-primary mb-2">
                    <Wallet size={20} className="me-2" />
                    <h5 className="card-title mb-0">Total Balance</h5>
                  </div>
                  <p className="h3 mb-0 fw-bold">{(totalIncome - totalExpenses).toFixed(2)} RWF</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center text-secondary mb-2">
                    <Wallet size={20} className="me-2" />
                    <h5 className="card-title mb-0">Budget</h5>
                  </div>
                  <p className="h3 mb-0 fw-bold">
                    {budget ? `${budget.amount.toFixed(2)} RWF (${budget.period})` : 'No budget set'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="row mb-4 g-3">
            <div className="col-md-6">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title mb-4 text-primary fw-bold">Income vs Expenses</h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        dot={{ fill: '#82ca9d', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="expenses"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ fill: '#8884d8', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title mb-4 text-primary fw-bold">Expenses by Category</h5>
                  <PieChart width={500} height={300}>
                    <Pie
                      data={categoryData}
                      cx={250}
                      cy={150}
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-primary fw-bold">Recent Transactions</h5>
                <div className="d-flex gap-3">
                  <button className="btn btn-outline-secondary d-flex align-items-center gap-2 shadow-sm">
                    <Filter size={20} />
                    Filter
                  </button>
                  <button className="btn btn-outline-secondary d-flex align-items-center gap-2 shadow-sm">
                    <Download size={20} />
                    Download Report
                  </button>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Account</th>
                    <th>Category</th>
                    <th>Subcategory</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={index}>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td className={transaction.type === 'income' ? 'text-success' : 'text-danger'}>
                        {Number(transaction.amount).toFixed(2)} RWF
                      </td>
                      <td>{transaction.account}</td>
                      <td>{transaction.category}</td>
                      <td>{transaction.subcategory}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;