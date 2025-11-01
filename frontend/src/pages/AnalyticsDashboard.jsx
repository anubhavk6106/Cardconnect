import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import '../styles/AnalyticsDashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);


const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [transactionTrends, setTransactionTrends] = useState([]);
  const [revenueByPlatform, setRevenueByPlatform] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [topCards, setTopCards] = useState([]);
  const [topOwners, setTopOwners] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    fetchAllAnalytics();
  }, [timeRange]);

  const fetchAllAnalytics = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        trendsRes,
        platformRes,
        growthRes,
        cardsRes,
        ownersRes,
        productsRes,
        statusRes
      ] = await Promise.all([
        axios.get('/api/analytics/dashboard-stats'),
        axios.get(`/api/analytics/transaction-trends?days=${timeRange}`),
        axios.get('/api/analytics/revenue-by-platform'),
        axios.get(`/api/analytics/user-growth?days=${timeRange}`),
        axios.get('/api/analytics/top-cards?limit=5'),
        axios.get('/api/analytics/top-card-owners?limit=5'),
        axios.get('/api/analytics/popular-products?limit=5'),
        axios.get('/api/analytics/transaction-status')
      ]);

      setDashboardStats(statsRes.data.data);
      setTransactionTrends(trendsRes.data.data || []);
      setRevenueByPlatform(platformRes.data.data || []);
      setUserGrowth(growthRes.data.data || []);
      setTopCards(cardsRes.data.data || []);
      setTopOwners(ownersRes.data.data || []);
      setPopularProducts(productsRes.data.data || []);
      setStatusDistribution(statusRes.data.data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const transactionTrendChartData = {
    labels: (transactionTrends || []).map(t => {
      if (t._id.day) return `${t._id.day}/${t._id.month}`;
      if (t._id.week) return `W${t._id.week}`;
      return `${t._id.month}/${t._id.year}`;
    }),
    datasets: [
      {
        label: 'Transactions',
        data: (transactionTrends || []).map(t => t.count),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Revenue (₹)',
        data: (transactionTrends || []).map(t => t.revenue),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y1'
      }
    ]
  };

  const platformRevenueChartData = {
    labels: (revenueByPlatform || []).map(p => p._id),
    datasets: [{
      label: 'Revenue by Platform (₹)',
      data: (revenueByPlatform || []).map(p => p.revenue),
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)'
      ]
    }]
  };

  const userGrowthChartData = {
    labels: (userGrowth || []).map(u => {
      const date = u.date;
      return `${date.day}/${date.month}`;
    }),
    datasets: [
      {
        label: 'Total Users',
        data: (userGrowth || []).map(u => u.total),
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.4
      },
      {
        label: 'Buyers',
        data: (userGrowth || []).map(u => u.buyers),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4
      },
      {
        label: 'Card Owners',
        data: (userGrowth || []).map(u => u.cardOwners),
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        tension: 0.4
      }
    ]
  };

  const statusDistributionChartData = {
    labels: (statusDistribution || []).map(s => s._id),
    datasets: [{
      data: (statusDistribution || []).map(s => s.count),
      backgroundColor: [
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(201, 203, 207, 0.8)'
      ]
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const multiAxisOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="analytics-dashboard">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h1>📊 Analytics Dashboard</h1>
        <div className="time-range-selector">
          <label>Time Range:</label>
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-info">
            <h3>Total Users</h3>
            <p className="metric-value">{dashboardStats?.totalUsers || 0}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💳</div>
          <div className="metric-info">
            <h3>Total Cards</h3>
            <p className="metric-value">{dashboardStats?.totalCards || 0}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🔄</div>
          <div className="metric-info">
            <h3>Total Transactions</h3>
            <p className="metric-value">{dashboardStats?.totalTransactions || 0}</p>
            <p className={`metric-growth ${dashboardStats?.transactionGrowth >= 0 ? 'positive' : 'negative'}`}>
              {dashboardStats?.transactionGrowth >= 0 ? '↑' : '↓'} {Math.abs(dashboardStats?.transactionGrowth || 0)}%
            </p>
          </div>
        </div>

        <div className="metric-card highlight">
          <div className="metric-icon">💰</div>
          <div className="metric-info">
            <h3>Total Revenue</h3>
            <p className="metric-value">₹{dashboardStats?.totalRevenue?.toFixed(2) || 0}</p>
            <p className={`metric-growth ${dashboardStats?.revenueGrowth >= 0 ? 'positive' : 'negative'}`}>
              {dashboardStats?.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(dashboardStats?.revenueGrowth || 0)}%
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🎁</div>
          <div className="metric-info">
            <h3>Total Discounts Given</h3>
            <p className="metric-value">₹{dashboardStats?.totalDiscounts?.toFixed(2) || 0}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💸</div>
          <div className="metric-info">
            <h3>Owner Earnings</h3>
            <p className="metric-value">₹{dashboardStats?.totalOwnerEarnings?.toFixed(2) || 0}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Transaction Trends */}
        <div className="chart-card large">
          <h2>Transaction & Revenue Trends</h2>
          <div className="chart-container">
            {transactionTrends.length > 0 ? (
              <Line data={transactionTrendChartData} options={multiAxisOptions} />
            ) : (
              <p className="no-data">No transaction data available</p>
            )}
          </div>
        </div>

        {/* Revenue by Platform */}
        <div className="chart-card">
          <h2>Revenue by Platform</h2>
          <div className="chart-container">
            {revenueByPlatform.length > 0 ? (
              <Bar data={platformRevenueChartData} options={chartOptions} />
            ) : (
              <p className="no-data">No platform data available</p>
            )}
          </div>
        </div>

        {/* Transaction Status */}
        <div className="chart-card">
          <h2>Transaction Status Distribution</h2>
          <div className="chart-container">
            {statusDistribution.length > 0 ? (
              <Doughnut data={statusDistributionChartData} options={{...chartOptions, scales: undefined}} />
            ) : (
              <p className="no-data">No status data available</p>
            )}
          </div>
        </div>

        {/* User Growth */}
        <div className="chart-card large">
          <h2>User Growth Over Time</h2>
          <div className="chart-container">
            {userGrowth.length > 0 ? (
              <Line data={userGrowthChartData} options={chartOptions} />
            ) : (
              <p className="no-data">No user growth data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="top-performers-section">
        <div className="performers-card">
          <h2>🏆 Top Performing Cards</h2>
          <div className="performers-list">
            {topCards.length > 0 ? (
              topCards.map((card, index) => (
                <div key={card._id} className="performer-item">
                  <span className="rank">#{index + 1}</span>
                  <div className="performer-info">
                    <strong>{card.bankName}</strong>
                    <small>{card.cardType} - {card.cardNetwork}</small>
                  </div>
                  <div className="performer-stats">
                    <span className="transactions">{card.totalTransactions} txns</span>
                    <span className="rating">⭐ {card.rating?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No card data available</p>
            )}
          </div>
        </div>

        <div className="performers-card">
          <h2>👤 Top Card Owners</h2>
          <div className="performers-list">
            {topOwners.length > 0 ? (
              topOwners.map((owner, index) => (
                <div key={owner._id} className="performer-item">
                  <span className="rank">#{index + 1}</span>
                  <div className="performer-info">
                    <strong>{owner.name}</strong>
                    <small>{owner.email}</small>
                  </div>
                  <div className="performer-stats">
                    <span className="earnings">₹{owner.stats?.totalEarnings?.toFixed(2) || 0}</span>
                    <span className="transactions">{owner.stats?.totalTransactions || 0} txns</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No owner data available</p>
            )}
          </div>
        </div>

        <div className="performers-card">
          <h2>🎯 Popular Products</h2>
          <div className="performers-list">
            {popularProducts.length > 0 ? (
              popularProducts.map((product, index) => (
                <div key={index} className="performer-item">
                  <span className="rank">#{index + 1}</span>
                  <div className="performer-info">
                    <strong>{product._id.name}</strong>
                    <small>{product._id.platform}</small>
                  </div>
                  <div className="performer-stats">
                    <span className="transactions">{product.purchaseCount} purchases</span>
                    <span className="discount">₹{product.avgDiscount?.toFixed(2)} avg</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No product data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
