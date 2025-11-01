# Quick Reference Guide - New Card Offer System

## 📚 Table of Contents
1. [API Endpoints](#api-endpoints)
2. [Data Models](#data-models)
3. [Common Use Cases](#common-use-cases)
4. [Testing](#testing)
5. [Troubleshooting](#troubleshooting)

---

## API Endpoints

### Card Management

#### Create Card
```http
POST /api/cards
Authorization: Bearer <token>

Body:
{
  "bankName": "HDFC Bank",
  "cardType": "credit",
  "cardNetwork": "Visa",
  "lastFourDigits": "1234",
  "cardImage": "/uploads/cards/image.jpg",  // optional
  "usageLimit": 5
}
```

#### Get User's Cards
```http
GET /api/cards/myCards
Authorization: Bearer <token>
```

#### Update Card
```http
PUT /api/cards/:cardId
Authorization: Bearer <token>

Body:
{
  "bankName": "SBI",
  "isAvailable": true,
  "usageLimit": 10
}
```

### Product Management (Admin)

#### Create Product with Card Offers
```http
POST /api/products
Authorization: Bearer <admin-token>

Body:
{
  "name": "iPhone 15 Pro",
  "platform": "Amazon",
  "category": "Electronics",
  "url": "https://amazon.in/...",
  "imageUrl": "https://...",
  "originalPrice": 129900,
  "currentPrice": 129900,
  "cardOffers": [
    {
      "cardNetwork": "Visa",
      "cardType": "credit",
      "bankName": null,
      "discountPercentage": 10,
      "maxDiscount": 5000,
      "minPurchase": 50000,
      "validUntil": "2025-12-31",
      "offerDescription": "10% off up to ₹5000"
    }
  ]
}
```

#### Get Products with Offers (Buyer)
```http
GET /api/products?platform=Amazon&minDiscount=10&sortBy=bestDiscount&page=1&limit=20
Authorization: Bearer <token>

Response:
{
  "products": [
    {
      "_id": "...",
      "name": "iPhone 15 Pro",
      "originalPrice": 129900,
      "bestOffer": {
        "discountPercentage": 10,
        "calculatedDiscount": 5000,
        "finalPrice": 124900,
        ...
      },
      "bestCard": {
        "_id": "...",
        "bankName": "HDFC Bank",
        "cardNetwork": "Visa",
        "lastFourDigits": "1234"
      },
      "hasOffer": true
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "total": 100,
  "userCardsCount": 3
}
```

### Transaction Management

#### Create Transaction
```http
POST /api/transactions
Authorization: Bearer <token>

Body:
{
  "cardId": "card_id_here",
  "product": {
    "name": "iPhone 15 Pro",
    "url": "https://amazon.in/...",
    "platform": "Amazon",
    "originalPrice": 129900,
    "imageUrl": "https://..."
  }
}

Note: Discount is automatically calculated from product's cardOffers
```

---

## Data Models

### Card Model (Simplified)
```javascript
{
  owner: ObjectId,
  bankName: String,
  cardType: "credit" | "debit",
  cardNetwork: "Visa" | "Mastercard" | "RuPay" | "American Express",
  lastFourDigits: String,
  cardImage: String,
  isAvailable: Boolean,
  usageLimit: Number,
  currentUsage: Number,
  rating: Number,
  totalTransactions: Number
}
```

### Product Model (with Card Offers)
```javascript
{
  name: String,
  platform: "Amazon" | "Flipkart" | "Myntra" | "Other",
  category: String,
  url: String,
  imageUrl: String,
  originalPrice: Number,
  currentPrice: Number,
  cardOffers: [
    {
      cardNetwork: "Visa" | "Mastercard" | "RuPay" | "American Express" | "All",
      cardType: "credit" | "debit" | "both",
      bankName: String | null,  // null = all banks
      discountPercentage: Number,
      maxDiscount: Number,
      minPurchase: Number,
      validUntil: Date,
      offerDescription: String
    }
  ],
  popularityScore: Number
}
```

---

## Common Use Cases

### 1. Card Owner Adds a New Card

**Frontend:**
```javascript
const addCard = async () => {
  const cardData = {
    bankName: "HDFC Bank",
    cardType: "credit",
    cardNetwork: "Visa",
    lastFourDigits: "1234",
    usageLimit: 5
  };
  
  await axios.post('/api/cards', cardData);
};
```

**What Happens:**
- Card is created with only basic details
- No discount information needed
- Card is immediately available for offer matching

### 2. Admin Adds Product with Offers

**Frontend:**
```javascript
const addProduct = async () => {
  const productData = {
    name: "Samsung Galaxy S24",
    platform: "Flipkart",
    category: "Electronics",
    originalPrice: 79999,
    currentPrice: 79999,
    cardOffers: [
      {
        cardNetwork: "Mastercard",
        cardType: "both",
        bankName: "HDFC Bank",
        discountPercentage: 12,
        maxDiscount: 8000,
        minPurchase: 40000,
        validUntil: new Date("2025-12-31"),
        offerDescription: "12% instant discount with HDFC Mastercard"
      }
    ]
  };
  
  await axios.post('/api/products', productData);
};
```

### 3. Buyer Browses Products

**Frontend:**
```javascript
const browseProducts = async () => {
  const { data } = await axios.get('/api/products', {
    params: {
      platform: 'Amazon',
      minDiscount: 10,
      sortBy: 'bestDiscount',
      page: 1
    }
  });
  
  // data.products contains products with bestOffer already matched
  data.products.forEach(product => {
    console.log(`${product.name}: Save ₹${product.bestOffer.calculatedDiscount}`);
    console.log(`Use: ${product.bestCard.bankName} ${product.bestCard.cardNetwork}`);
  });
};
```

### 4. Buyer Requests Transaction

**Frontend:**
```javascript
const requestPurchase = async (product, cardId) => {
  const transactionData = {
    cardId: cardId,
    product: {
      name: product.name,
      url: product.url,
      platform: product.platform,
      originalPrice: product.originalPrice
    }
  };
  
  await axios.post('/api/transactions', transactionData);
};
```

**What Happens:**
- Backend fetches product from DB
- Matches card with product offers
- Calculates discount automatically
- Creates transaction with correct discount

---

## Testing

### Test Card Addition
```bash
# Using curl
curl -X POST http://localhost:5000/api/cards \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bankName": "HDFC Bank",
    "cardType": "credit",
    "cardNetwork": "Visa",
    "lastFourDigits": "1234",
    "usageLimit": 5
  }'
```

### Test Product Browsing
```bash
curl -X GET "http://localhost:5000/api/products?platform=Amazon&minDiscount=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Offer Matching Logic
```javascript
// Add this test product
{
  name: "Test Product",
  originalPrice: 10000,
  cardOffers: [
    {
      cardNetwork: "Visa",
      cardType: "credit",
      discountPercentage: 15,
      maxDiscount: 1000,
      minPurchase: 5000,
      validUntil: "2025-12-31"
    }
  ]
}

// With Visa credit card:
// - Matches: ✓ (card network + type match)
// - Min purchase: ✓ (10000 >= 5000)
// - Discount: 15% of 10000 = 1500, capped at 1000
// - Final: ₹9000
```

---

## Troubleshooting

### Issue: "You need to add at least one card to browse products"
**Solution:** User must add at least one card before browsing products.
```javascript
// Check user has cards
const { data } = await axios.get('/api/cards/myCards');
if (data.length === 0) {
  // Redirect to add card page
}
```

### Issue: "No valid offer found for your card on this product"
**Reasons:**
1. Card network doesn't match any offer
2. Card type doesn't match (e.g., debit card but offer is credit-only)
3. Bank-specific offer but user has different bank
4. Product price below `minPurchase`
5. Offer has expired

**Debug:**
```javascript
// Check product offers
const product = await Product.findById(productId);
console.log('Product offers:', product.cardOffers);

// Check user's card
const card = await Card.findById(cardId);
console.log('User card:', {
  network: card.cardNetwork,
  type: card.cardType,
  bank: card.bankName
});
```

### Issue: Products showing no offers
**Check:**
1. Products have cardOffers array populated
2. Offers haven't expired (validUntil > today)
3. User's cards match offer criteria
4. minPurchase requirements are met

```javascript
// Verify product offers
db.products.find({ cardOffers: { $exists: true, $ne: [] } });

// Check offer validity
db.products.find({
  "cardOffers.validUntil": { $gt: new Date() }
});
```

### Issue: Card form still showing discount fields
**Solution:** Clear browser cache and reload, or hard refresh (Ctrl+Shift+R)

---

## Migration Checklist

- [ ] Backup database
- [ ] Run `node scripts/migrateCardDiscounts.js`
- [ ] Run `node scripts/addSampleCardOffers.js` (after customizing)
- [ ] Test card addition (should not ask for discounts)
- [ ] Test product browsing (should show matched offers)
- [ ] Test transaction creation (discount auto-calculated)
- [ ] Verify existing transactions still work
- [ ] Update frontend routing if needed

---

## Key Differences

| Feature | Old System | New System |
|---------|-----------|------------|
| **Discount Entry** | Card owner enters | Admin manages at product level |
| **Discount Source** | Card model | Product model |
| **Matching Logic** | Manual selection | Automatic matching |
| **Update Process** | Card owner updates | Admin updates product |
| **Flexibility** | Limited to platforms | Unlimited customization |
| **Integration** | Manual only | API-ready |

---

## Support Resources

- **Migration Guide:** `MIGRATION_GUIDE.md`
- **Changes Summary:** `CHANGES_SUMMARY.md`
- **API Documentation:** Check server route definitions
- **Database Scripts:** `backend/scripts/`

For issues, check:
1. Console logs (frontend & backend)
2. Database state
3. API responses
4. Network tab in browser DevTools
