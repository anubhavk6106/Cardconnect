# Card Management System - Migration Guide

## Overview
This guide explains the changes made to the card management system and how to migrate your existing data.

## What Changed?

### 🔴 **Before** (Old System)
- Card owners manually entered discount information when adding cards
- Discounts were stored in the `Card` model under `availableDiscounts` array
- Each card had platform-specific discounts (Amazon, Flipkart, etc.)
- Card owners had to maintain and update discount details

### 🟢 **After** (New System)
- Card owners only enter basic card details (bank name, card type, network, last 4 digits)
- Discounts are now stored in the `Product` model under `cardOffers` array
- Products automatically fetch live card-based offers from external sources
- System matches user's cards with product offers to show best discounts
- No manual discount management required from card owners

---

## Database Schema Changes

### Card Model
**Removed fields:**
- `availableDiscounts` (entire array)

**Retained fields:**
- `owner`
- `bankName`
- `cardType` (credit/debit)
- `cardNetwork` (Visa, Mastercard, RuPay, American Express)
- `lastFourDigits`
- `cardImage`
- `isAvailable`
- `usageLimit`
- `currentUsage`
- `rating`
- `totalTransactions`

### Product Model
**Added fields:**
- `cardOffers` array containing:
  - `cardNetwork` - Which card network (Visa, Mastercard, etc.)
  - `cardType` - credit, debit, or both
  - `bankName` - Specific bank (null = all banks)
  - `discountPercentage` - Discount percentage
  - `maxDiscount` - Maximum discount amount
  - `minPurchase` - Minimum purchase amount
  - `validUntil` - Offer expiry date
  - `offerDescription` - Offer details

---

## Migration Steps

### 1. Backup Your Database
```bash
# MongoDB backup
mongodump --uri="mongodb://localhost:27017/cardconnect" --out=./backup
```

### 2. Run Card Migration Script
This removes the `availableDiscounts` field from all cards:

```bash
cd backend
node scripts/migrateCardDiscounts.js
```

Expected output:
```
Connected to MongoDB
Migration completed successfully!
Updated X cards
Database connection closed
```

### 3. Add Card Offers to Products
Add sample card offers to your products:

```bash
node scripts/addSampleCardOffers.js
```

**Important:** Edit `scripts/addSampleCardOffers.js` to customize offers based on your actual product catalog and available card deals.

### 4. Update Frontend Dependencies
The frontend has been updated to remove discount input fields from card forms. No additional action needed.

### 5. Test the System

#### Test Card Management:
1. Login as card owner
2. Try adding a new card (should only ask for basic details)
3. Verify existing cards still display correctly

#### Test Product Browsing:
1. Login as buyer
2. Browse products
3. Verify products show applicable card offers
4. Check that discounts match your card details

#### Test Transaction Creation:
1. Select a product
2. Choose a card
3. Verify correct discount is calculated from product offers
4. Complete a test transaction

---

## API Changes

### Card Endpoints
**POST /api/cards** - Create card
- ❌ Removed: `availableDiscounts`
- ✅ Required: `bankName`, `cardType`, `cardNetwork`, `lastFourDigits`
- ✅ Optional: `cardImage`, `usageLimit`

**PUT /api/cards/:id** - Update card
- ❌ Removed: `availableDiscounts`
- ✅ Can update: basic card details only

**GET /api/cards** - List cards
- ❌ Removed query params: `platform`, `minDiscount`
- ✅ Available filters: `bankName`, `cardNetwork`, `cardType`

### New Product Endpoints
**GET /api/products** - Get products with offers
- Automatically matches user's cards with product offers
- Returns best applicable offer for each product
- Query params: `platform`, `category`, `minDiscount`, `sortBy`, `page`, `limit`

**GET /api/products/:id** - Get single product
- Returns all applicable offers for user's cards
- Shows which cards can be used for which offers

---

## Frontend Changes

### CardOwnerDashboard.jsx
- ✅ Simplified card form (basic details only)
- ❌ Removed discount input fields
- ❌ Removed platform selection
- ❌ Removed discount percentage/max discount inputs
- ✅ Added usage limit input

### Card Display
- ❌ Removed discount badges on card items
- ✅ Shows card basic info only

### Product Browsing (Future Enhancement)
You may want to create/update a product browsing component that:
- Fetches products from `/api/products`
- Displays best card offer for each product
- Shows which card gives the best discount
- Allows filtering by minimum discount

---

## Example: Adding Card Offers to Products

```javascript
// Example product with card offers
{
  name: "iPhone 15 Pro",
  platform: "Amazon",
  category: "Electronics",
  originalPrice: 129900,
  currentPrice: 129900,
  cardOffers: [
    {
      cardNetwork: "Visa",
      cardType: "credit",
      bankName: null, // All Visa credit cards
      discountPercentage: 10,
      maxDiscount: 5000,
      minPurchase: 50000,
      validUntil: new Date("2025-12-31"),
      offerDescription: "10% instant discount up to ₹5000 on Visa Credit Cards"
    },
    {
      cardNetwork: "Mastercard",
      cardType: "both",
      bankName: "HDFC Bank",
      discountPercentage: 15,
      maxDiscount: 7500,
      minPurchase: 50000,
      validUntil: new Date("2025-12-31"),
      offerDescription: "15% instant discount up to ₹7500 on HDFC Mastercard"
    }
  ]
}
```

---

## How Offer Matching Works

When a user browses products, the system:

1. Fetches all user's active cards
2. For each product, checks all `cardOffers`
3. Matches offers against user's cards based on:
   - Card network (Visa, Mastercard, etc.)
   - Card type (credit/debit)
   - Bank name (if specified)
   - Validity date
   - Minimum purchase amount
4. Calculates actual discount amount
5. Returns the best offer for each product

---

## Rollback Procedure

If you need to rollback:

1. Restore database from backup:
```bash
mongorestore --uri="mongodb://localhost:27017/cardconnect" ./backup/cardconnect
```

2. Revert code changes:
```bash
git checkout <previous-commit-hash>
```

3. Restart services:
```bash
# Backend
npm start

# Frontend
npm run dev
```

---

## Support

For issues or questions:
1. Check database migration logs
2. Verify all cards have basic required fields
3. Ensure products have at least one card offer
4. Test API endpoints using Postman/Thunder Client

---

## Benefits of New System

✅ **Simplified for Card Owners** - No need to track/update discount information  
✅ **Live Offers** - Products can have real-time card offers from external sources  
✅ **Better Matching** - System automatically finds best offer for user's cards  
✅ **Centralized Management** - Admins manage offers at product level  
✅ **Flexibility** - Easy to add bank-specific or card-specific offers  
✅ **Scalability** - Can integrate with external offer APIs in future
