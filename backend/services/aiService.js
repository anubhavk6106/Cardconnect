const Card = require('../models/Card');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');

/**
 * AI-Powered Card Matching Algorithm
 * Matches buyers with the best card owners based on multiple factors
 */
const matchBuyerWithCard = async (buyerPreferences) => {
  const { platform, productPrice, preferredBank, location } = buyerPreferences;

  try {
    // Find available cards for the platform
    const cards = await Card.find({
      isAvailable: true,
      'availableDiscounts.platform': platform
    }).populate('owner', 'name email phone address rating');

    // Score each card based on multiple factors
    const scoredCards = cards.map(card => {
      let score = 0;

      // Find the discount for the specific platform
      const discount = card.availableDiscounts.find(d => d.platform === platform);

      if (!discount || new Date(discount.validUntil) < new Date()) {
        return null;
      }

      // Factor 1: Discount amount (40% weight)
      const discountAmount = Math.min(
        (productPrice * discount.discountPercentage) / 100,
        discount.maxDiscount
      );
      score += (discountAmount / productPrice) * 40;

      // Factor 2: Card owner rating (25% weight)
      score += (card.rating / 5) * 25;

      // Factor 3: Transaction history (20% weight)
      const successRate = card.totalTransactions > 0 ? 
        (card.totalTransactions / (card.totalTransactions + 1)) * 20 : 10;
      score += successRate;

      // Factor 4: Availability (15% weight)
      const availabilityScore = ((card.usageLimit - card.currentUsage) / card.usageLimit) * 15;
      score += availabilityScore;

      // Bonus: Preferred bank (+5 points)
      if (preferredBank && card.bankName.toLowerCase() === preferredBank.toLowerCase()) {
        score += 5;
      }

      return {
        card,
        score,
        discountAmount,
        estimatedSavings: discountAmount
      };
    }).filter(item => item !== null);

    // Sort by score (highest first)
    scoredCards.sort((a, b) => b.score - a.score);

    return scoredCards;
  } catch (error) {
    throw new Error('Card matching failed: ' + error.message);
  }
};

/**
 * AI-Powered Product Recommendation
 * Recommends products based on user behavior and available discounts
 */
const recommendProducts = async (userId, userRole = 'buyer') => {
  try {
    // Get user's transaction history
    const userTransactions = await Transaction.find({
      $or: [{ buyer: userId }, { cardOwner: userId }],
      status: 'completed'
    });

    // Extract categories and platforms user has interacted with
    const preferredPlatforms = [...new Set(userTransactions.map(t => t.product.platform))];
    const recentProducts = userTransactions.slice(0, 10).map(t => t.product.name);

    // Get available cards with active discounts
    const cardsWithDiscounts = await Card.find({
      isAvailable: true,
      'availableDiscounts.validUntil': { $gt: new Date() }
    });

    // Get all products
    const products = await Product.find({}).populate('applicableCards');

    // Score products based on multiple factors
    const scoredProducts = products.map(product => {
      let score = 0;

      // Factor 1: Platform preference (30% weight)
      if (preferredPlatforms.includes(product.platform)) {
        score += 30;
      }

      // Factor 2: Available discount (40% weight)
      const applicableCard = cardsWithDiscounts.find(card =>
        card.availableDiscounts.some(d => 
          d.platform === product.platform && new Date(d.validUntil) > new Date()
        )
      );

      if (applicableCard) {
        const discount = applicableCard.availableDiscounts.find(d => d.platform === product.platform);
        score += (discount.discountPercentage / 100) * 40;
      }

      // Factor 3: Popularity (20% weight)
      score += (product.popularityScore / 100) * 20;

      // Factor 4: Price consideration (10% weight)
      const discountPercent = ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100;
      score += (discountPercent / 100) * 10;

      return {
        product,
        score,
        hasDiscount: !!applicableCard
      };
    });

    // Sort by score
    scoredProducts.sort((a, b) => b.score - a.score);

    // Return top 20 recommendations
    return scoredProducts.slice(0, 20);
  } catch (error) {
    throw new Error('Product recommendation failed: ' + error.message);
  }
};

/**
 * Predict transaction success rate
 * Uses historical data to predict likelihood of transaction completion
 */
const predictTransactionSuccess = async (buyerId, cardOwnerId) => {
  try {
    // Get card owner's history
    const ownerTransactions = await Transaction.find({ cardOwner: cardOwnerId });
    
    if (ownerTransactions.length === 0) {
      return 0.75; // Default 75% for new users
    }

    const completedCount = ownerTransactions.filter(t => t.status === 'completed').length;
    const successRate = completedCount / ownerTransactions.length;

    // Adjust based on volume
    const volumeBonus = Math.min(ownerTransactions.length / 100, 0.1);

    return Math.min(successRate + volumeBonus, 1.0);
  } catch (error) {
    throw new Error('Prediction failed: ' + error.message);
  }
};

module.exports = {
  matchBuyerWithCard,
  recommendProducts,
  predictTransactionSuccess
};
