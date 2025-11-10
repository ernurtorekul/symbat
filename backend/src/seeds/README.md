# Database Seeds

This directory contains database seeding scripts for your smart consultant platform.

## Makeup Removal Products Seed

### What's Included

12 comprehensive makeup removal products:

1. **La Roche-Posay Gentle Micellar Water** - Sensitive skin friendly
2. **DHC Perfect Cleansing Oil** - Olive oil-based, anti-aging
3. **Clinique Take The Day Off Cleansing Balm** - Melting balm formula
4. **Neutrogena Makeup Remover Wipes** - Convenient wipes
5. **Clinique Eye Makeup Remover** - Oil-free eye makeup remover
6. **Lancôme Bi-Facil** - Luxury bi-phase eye makeup remover
7. **Farmacy Vegan Milk Makeup Remover** - Natural and vegan
8. **Caudalie Foaming Cleanser** - Natural grape extract
9. **philosophy Purity Made Simple** - Multi-tasking cleanser
10. **Shiseido Pure Cotton Pads** - Essential accessory
11. **Dove Coconut Cleansing Oil** - Budget-friendly option
12. **Farmacy Green Clean** - Natural cleansing balm

### Product Features

Each product includes:
- **Complete ingredient lists** for allergy checking
- **Skin type compatibility** (dry, oily, combination, sensitive, normal)
- **Target concerns** (acne, dryness, aging, etc.)
- **Budget categories** (budget, mid, premium)
- **Special properties** (organic, cruelty-free, hypoallergenic, non-comedogenic)
- **High-quality images** and detailed descriptions
- **Tags** for filtering in frontend

### How to Run

1. Make sure your database is running and configured correctly
2. Run the seed script:

```bash
npm run seed:makeup-removers
```

### Database Integration

The products are designed to work seamlessly with your existing:
- **Quiz recommendation system** - Products will be recommended based on skin type and concerns
- **Filtering system** - Frontend can filter by category, budget, skin type, etc.
- **Search functionality** - Products are searchable by name, brand, and description
- **Allergy checking** - Ingredient lists work with your allergy filtering

### Frontend Integration

Your frontend can now:
- Filter by `productCategory: 'makeup_remover'`
- Filter by specific `productType` values: `micellar_water`, `cleansing_oil`, `cleansing_balm`, etc.
- Filter by `budgetRange`: 'budget', 'mid', 'premium'
- Filter by special properties: `isOrganic`, `isCrueltyFree`, `isHypoallergenic`, `isNonComedogenic`
- Filter by `suitableSkinTypes` for personalized recommendations

### Example Frontend Filters

```javascript
// Get all makeup removers
const makeupRemovers = await productService.getProductsByCategory('makeup_remover');

// Get budget-friendly makeup removers
const budgetRemovers = await productService.getProductsByBudgetRange('budget');

// Get makeup removers for sensitive skin
const sensitiveRemovers = await productService.getProductsBySkinType('sensitive');

// Get natural/cruelty-free makeup removers
const naturalRemovers = await productService.searchProducts('organic cruelty-free');
```