const Card = require('../models/Card');
const Transaction = require('../models/Transaction');

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

    // Return card-based recommendations instead of products
    // Map cards to recommendation format
    const recommendations = cardsWithDiscounts.map(card => {
      let score = 0;

      // Score based on available discounts
      card.availableDiscounts.forEach(discount => {
        if (preferredPlatforms.includes(discount.platform)) {
          score += 30;
        }
        if (new Date(discount.validUntil) > new Date()) {
          score += (discount.discountPercentage / 100) * 40;
        }
      });

      // Factor in card rating
      score += (card.rating / 5) * 20;

      // Factor in availability
      const availabilityScore = ((card.usageLimit - card.currentUsage) / card.usageLimit) * 10;
      score += availabilityScore;

      return {
        card,
        score,
        hasDiscount: true
      };
    });

    // Sort by score
    recommendations.sort((a, b) => b.score - a.score);

    // Return top 20 recommendations
    return recommendations.slice(0, 20);
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
