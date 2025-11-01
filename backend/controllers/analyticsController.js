const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Card = require('../models/Card');

// Get dashboard overview stats
exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Total stats
    const totalUsers = await User.countDocuments();
    const totalCards = await Card.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    
    // Revenue stats
    const revenueStats = await Transaction.aggregate([
      { $match: { status: 'completed', paymentStatus: 'paid' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$serviceFee' },
          totalDiscounts: { $sum: '$discountAmount' },
          totalOwnerEarnings: { $sum: '$ownerEarnings' }
        }
      }
    ]);

    // This month stats
    const thisMonthTransactions = await Transaction.countDocuments({
      createdAt: { $gte: firstDayOfMonth }
    });

    const thisMonthRevenue = await Transaction.aggregate([
      { 
        $match: { 
          createdAt: { $gte: firstDayOfMonth },
          status: 'completed',
          paymentStatus: 'paid'
        } 
      },
      { $group: { _id: null, revenue: { $sum: '$serviceFee' } } }
    ]);

    // Last month stats for comparison
    const lastMonthTransactions = await Transaction.countDocuments({
      createdAt: { $gte: firstDayOfLastMonth, $lt: firstDayOfMonth }
    });

    const lastMonthRevenue = await Transaction.aggregate([
      { 
        $match: { 
          createdAt: { $gte: firstDayOfLastMonth, $lt: firstDayOfMonth },
          status: 'completed',
          paymentStatus: 'paid'
        } 
      },
      { $group: { _id: null, revenue: { $sum: '$serviceFee' } } }
    ]);

    // Calculate growth percentages
    const transactionGrowth = lastMonthTransactions > 0 
      ? ((thisMonthTransactions - lastMonthTransactions) / lastMonthTransactions * 100).toFixed(2)
      : 0;

    const revenueGrowth = lastMonthRevenue.length > 0 && thisMonthRevenue.length > 0
      ? ((thisMonthRevenue[0].revenue - lastMonthRevenue[0].revenue) / lastMonthRevenue[0].revenue * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalCards,
        totalTransactions,
        totalRevenue: revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0,
        totalDiscounts: revenueStats.length > 0 ? revenueStats[0].totalDiscounts : 0,
        totalOwnerEarnings: revenueStats.length > 0 ? revenueStats[0].totalOwnerEarnings : 0,
        thisMonthTransactions,
        thisMonthRevenue: thisMonthRevenue.length > 0 ? thisMonthRevenue[0].revenue : 0,
        transactionGrowth: parseFloat(transactionGrowth),
        revenueGrowth: parseFloat(revenueGrowth)
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching dashboard statistics',
      error: error.message 
    });
  }
};

// Get transaction trends (daily/weekly/monthly)
exports.getTransactionTrends = async (req, res) => {
  try {
    const { period = 'daily', days = 30 } = req.query;
    
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    let groupBy;
    if (period === 'daily') {
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      };
    } else if (period === 'weekly') {
      groupBy = {
        year: { $year: '$createdAt' },
        week: { $week: '$createdAt' }
      };
    } else if (period === 'monthly') {
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      };
    }

    const trends = await Transaction.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 },
          revenue: { 
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$status', 'completed'] },
                  { $eq: ['$paymentStatus', 'paid'] }
                ]},
                '$serviceFee',
                0
              ]
            }
          },
          totalDiscount: { $sum: '$discountAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Error fetching transaction trends:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching transaction trends',
      error: error.message 
    });
  }
};

// Get revenue breakdown by platform
exports.getRevenueByPlatform = async (req, res) => {
  try {
    const revenueByPlatform = await Transaction.aggregate([
      { 
        $match: { 
          status: 'completed',
          paymentStatus: 'paid'
        } 
      },
      {
        $group: {
          _id: '$product.platform',
          revenue: { $sum: '$serviceFee' },
          transactions: { $sum: 1 },
          totalDiscount: { $sum: '$discountAmount' }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.json({
      success: true,
      data: revenueByPlatform
    });
  } catch (error) {
    console.error('Error fetching revenue by platform:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching revenue by platform',
      error: error.message 
    });
  }
};

// Get user growth over time
exports.getUserGrowth = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          buyers: { 
            $sum: { $cond: [{ $eq: ['$role', 'buyer'] }, 1, 0] }
          },
          cardOwners: { 
            $sum: { $cond: [{ $eq: ['$role', 'card_owner'] }, 1, 0] }
          },
          total: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Calculate cumulative counts
    let cumulativeBuyers = 0;
    let cumulativeCardOwners = 0;
    let cumulativeTotal = 0;

    const cumulativeGrowth = userGrowth.map(day => {
      cumulativeBuyers += day.buyers;
      cumulativeCardOwners += day.cardOwners;
      cumulativeTotal += day.total;

      return {
        date: day._id,
        buyers: cumulativeBuyers,
        cardOwners: cumulativeCardOwners,
        total: cumulativeTotal
      };
    });

    res.json({
      success: true,
      data: cumulativeGrowth
    });
  } catch (error) {
    console.error('Error fetching user growth:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching user growth',
      error: error.message 
    });
  }
};

// Get top performing cards
exports.getTopCards = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topCards = await Card.find()
      .populate('owner', 'name email')
      .sort({ totalTransactions: -1, rating: -1 })
      .limit(parseInt(limit))
      .select('bankName cardType cardNetwork totalTransactions rating owner');

    res.json({
      success: true,
      data: topCards
    });
  } catch (error) {
    console.error('Error fetching top cards:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching top performing cards',
      error: error.message 
    });
  }
};

// Get top card owners by earnings
exports.getTopCardOwners = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topOwners = await User.find({ role: 'card_owner' })
      .sort({ 'stats.totalEarnings': -1 })
      .limit(parseInt(limit))
      .select('name email stats.totalEarnings stats.totalTransactions');

    res.json({
      success: true,
      data: topOwners
    });
  } catch (error) {
    console.error('Error fetching top card owners:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching top card owners',
      error: error.message 
    });
  }
};

// Get transaction status distribution
exports.getTransactionStatusDistribution = async (req, res) => {
  try {
    const statusDistribution = await Transaction.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: statusDistribution
    });
  } catch (error) {
    console.error('Error fetching transaction status distribution:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching transaction status distribution',
      error: error.message 
    });
  }
};

// Get popular products
exports.getPopularProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const popularProducts = await Transaction.aggregate([
      {
        $group: {
          _id: {
            name: '$product.name',
            platform: '$product.platform'
          },
          purchaseCount: { $sum: 1 },
          totalRevenue: { $sum: '$serviceFee' },
          avgDiscount: { $avg: '$discountAmount' }
        }
      },
      { $sort: { purchaseCount: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      success: true,
      data: popularProducts
    });
  } catch (error) {
    console.error('Error fetching popular products:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching popular products',
      error: error.message 
    });
  }
};
