import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductService } from '../products/product.service';
import { Product } from '../entities/product.entity';
import { Logger } from '@nestjs/common';

const MAKEUP_REMOVAL_PRODUCTS = [
  {
    name: "Gentle Micellar Water",
    brand: "La Roche-Posay",
    productType: "micellar_water",
    price: 15.99,
    description: "Gentle micellar water effectively removes makeup, dirt, and impurities without rubbing or rinsing. Formulated for sensitive skin with thermal spring water to soothe and calm irritation. Perfect for all skin types, including the most sensitive.",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&crop=center",
    productLink: "https://www.laroche-posay.us/micellar-water",
    rating: 4.6,
    ingredients: ["Aqua/Water", "Hexylene Glycol", "Glycerin", "Disodium Cocoamphodiacetate", "Poloxamer 184", "Disodium EDTA", "Myrtrimoyl Glycine", "Capryloyl Glycin", "Pentylene Glycol", "Citric Acid", "Polysorbate 80"],
    suitableSkinTypes: ["sensitive", "normal", "dry", "oily", "combination"],
    targetConcerns: ["redness", "irritation", "dryness"],
    tags: ["gentle", "no-rinse", "sensitive-skin", "dermatologist-tested"],
    tagList: ["Gentle", "No Rinse", "Sensitive Skin", "Hypoallergenic", "Non-Comedogenic", "Fragrance-Free"],
    isOrganic: false,
    isHypoallergenic: true,
    isCrueltyFree: true,
    isNonComedogenic: true,
    budgetRange: "mid"
  },
  {
    name: "Perfect Cleansing Oil",
    brand: "DHC",
    productType: "cleansing_oil",
    price: 28.00,
    description: "Award-winning olive oil-based cleanser that melts away makeup and impurities effortlessly. Rich in vitamins and antioxidants, this deep-cleansing oil nourishes skin while thoroughly removing waterproof makeup and sunscreen. Rinses clean without leaving greasy residue.",
    imageUrl: "https://m.media-amazon.com/images/I/71SYGhV7SQL._AC_UF350,350_QL80_.jpg",
    productLink: "https://www.dhccare.com/deep-cleansing-oil",
    rating: 4.7,
    ingredients: ["Olive Oil", "Oleic Acid", "Squalane", "Stearic Acid", "Octyldodecanol", "Tocopherol", "PEG-8 Beeswax", "Phenoxyethanol"],
    suitableSkinTypes: ["normal", "dry", "combination"],
    targetConcerns: ["dryness", "fine-lines", "makeup-removal"],
    tags: ["anti-aging", "deep-cleansing", "antioxidant", "nourishing"],
    tagList: ["Anti-Aging", "Deep Cleansing", "Antioxidant Rich", "Non-Greasy", "Waterproof Makeup Remover"],
    isOrganic: false,
    isHypoallergenic: false,
    isCrueltyFree: false,
    isNonComedogenic: false,
    budgetRange: "mid"
  },
  {
    name: "Take The Day Off Cleansing Balm",
    brand: "Clinique",
    productType: "cleansing_balm",
    price: 32.00,
    description: "Transforming balm-to-oil cleanser that melts away long-wearing makeup and sunscreen. This unique formula starts as a solid balm and transforms into a silky oil, dissolving even the most stubborn makeup. Rinses away clean, leaving skin feeling soft and smooth.",
    imageUrl: "https://m.clinique.com.au/media/export/cms/products/1200x1500/cl_sku_6CY401_1200x1500_0.png",
    productLink: "https://www.clinique.com/take-the-day-off-cleansing-balm",
    rating: 4.5,
    ingredients: ["Safflower Seed Oil", "Eggplant Fruit Extract", "Sunflower Seed Oil", "Sesame Seed Oil", "Olive Fruit Oil", "Moringa Butter", "Jojoba Seed Oil", "Vitamin E"],
    suitableSkinTypes: ["normal", "dry", "combination", "oily"],
    targetConcerns: ["heavy-makeup", "waterproof-makeup", "environmental-damage"],
    tags: ["solid-balm", "melting-formula", "anti-pollution", "nourishing"],
    tagList: ["Solid Balm", "Melting Formula", "Anti-Pollution", "Dermatologist Tested", "Allergy Tested"],
    isOrganic: false,
    isHypoallergenic: true,
    isCrueltyFree: false,
    isNonComedogenic: true,
    budgetRange: "mid"
  },
  {
    name: "Makeup Remover Cleansing Towelettes",
    brand: "Neutrogena",
    productType: "makeup_remover_wipes",
    price: 8.99,
    description: "Pre-moistened facial cleansing wipes that effectively dissolve all traces of dirt, oil, and makeup—even waterproof mascara. Soft texture cushions skin and is gentle enough for use around the delicate eye area. Leaves skin feeling clean and refreshed with no heavy residue.",
    imageUrl: "https://images.ctfassets.net/bcjr30vxh6td/3jiWrR531lbijfbfuM8JiU/33c0bcc23b6645c030b952de8b7926a3/6805105_Carousel1.webp?fm=webp&w=3840",
    productLink: "https://www.neutrogena.com/makeup-remover-wipes",
    rating: 4.3,
    ingredients: ["Water", "Cetearyl Isononanoate", "Ceteareth-20", "Caprylic/Capric Triglyceride", "Phenoxyethanol", "Tocopheryl Acetate", "Sodium Chloride", "Carbomer", "Disodium EDTA"],
    suitableSkinTypes: ["normal", "oily", "combination"],
    targetConcerns: ["convenience", "travel-friendly", "quick-cleanup"],
    tags: ["wipes", "convenient", "travel-friendly", "waterproof-makeup"],
    tagList: ["Pre-Moistened", "Convenient", "Travel Friendly", "Dermatologist Tested", "Ophthalmologist Tested"],
    isOrganic: false,
    isHypoallergenic: false,
    isCrueltyFree: false,
    isNonComedogenic: true,
    budgetRange: "budget"
  },
  {
    name: "Take The Day Off Eye Makeup Remover",
    brand: "Clinique",
    productType: "eye_makeup_remover",
    price: 21.50,
    description: "Gentle, oil-free eye makeup remover that effortlessly dissolves all eye makeup, even long-wearing and waterproof formulas. Ophthalmologist-tested formula is safe for contact lens wearers and sensitive eyes. Leaves the eye area feeling clean and fresh with no oily residue.",
    imageUrl: "https://m.clinique.com/media/export/cms/pdp/skincare/2024/ttdo_no1_m.jpg",
    productLink: "https://www.clinique.com/take-the-day-off-eye-makeup-remover",
    rating: 4.6,
    ingredients: ["Water", "Isododecane", "Cyclopentasiloxane", "Sodium Laureth Sulfate", "Poloxamer 184", "Disodium EDTA", "Sodium Chloride", "BHT"],
    suitableSkinTypes: ["sensitive", "normal", "dry", "oily", "combination"],
    targetConcerns: ["eye-makeup", "waterproof-mascara", "sensitive-eyes"],
    tags: ["oil-free", "no-rinse", "contact-lens-safe", "gentle"],
    tagList: ["Oil-Free", "No Rinse", "Contact Lens Safe", "Ophthalmologist Tested", "Allergy Tested"],
    isOrganic: false,
    isHypoallergenic: true,
    isCrueltyFree: false,
    isNonComedogenic: true,
    budgetRange: "mid"
  },
  {
    name: "Bi-Facil Double Action Eye Makeup Remover",
    brand: "Lancôme",
    productType: "dual_phase_remover",
    price: 30.00,
    description: "Luxurious bi-phase eye makeup remover that instantly dissolves all eye makeup, even long-wearing and waterproof formulas. The oil phase removes makeup while the water phase refreshes and conditions skin without leaving greasy residue. Ophthalmologist-tested for safety.",
    imageUrl: "https://www.lancome-usa.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-lancome-us-master-catalog/default/dwa9ac44b4/pdp/602581/3605970481018_Packshot.jpg",
    productLink: "https://www.lancome.com/bi-facil-eye-makeup-remover",
    rating: 4.7,
    ingredients: ["Water", "Isododecane", "Cyclopentasiloxane", "Hexylene Glycol", "Sodium Laureth-7 Carboxylate", "Sodium Laureth-4 Carboxylate", "Disodium EDTA", "Phenoxyethanol"],
    suitableSkinTypes: ["normal", "dry", "sensitive", "combination"],
    targetConcerns: ["waterproof-makeup", "eye-makeup", "anti-aging"],
    tags: ["luxury", "bi-phase", "conditioning", "effective"],
    tagList: ["Bi-Phase", "Luxury", "Instant Action", "Ophthalmologist Tested", "Fragrance-Free"],
    isOrganic: false,
    isHypoallergenic: false,
    isCrueltyFree: false,
    isNonComedogenic: true,
    budgetRange: "premium"
  },
  {
    name: "Vegan Milk Makeup Remover",
    brand: "Farmacy",
    productType: "cleanser",
    price: 26.00,
    description: "Gentle, vegan milk makeup remover that effectively lifts away makeup, dirt, and impurities while nourishing skin. Infused with papaya enzymes to gently exfoliate and oat extract to soothe skin. pH-balanced formula leaves skin feeling soft, clean, and hydrated.",
    imageUrl: "https://www.spacenk.com/on/demandware.static/-/Sites-spacenkmastercatalog/default/dwe903cb22/products/MILK_MKEUP/UK200036136_MILK_MKEUP_2.jpg",
    productLink: "https://www.farmacybeauty.com/vegan-milk",
    rating: 4.5,
    ingredients: ["Water", "Glycerin", "Papaya Fruit Extract", "Oat Kernel Extract", "Coconut Fruit Extract", "Arginine", "Citric Acid", "Leuconostoc/Radish Root Ferment Filtrate"],
    suitableSkinTypes: ["sensitive", "normal", "dry"],
    targetConcerns: ["dryness", "sensitivity", "gentle-exfoliation"],
    tags: ["vegan", "natural", "soothing", "plant-based"],
    tagList: ["Vegan", "Natural", "Soothing", "Plant-Based", "Cruelty-Free", "Clean Beauty"],
    isOrganic: true,
    isHypoallergenic: true,
    isCrueltyFree: true,
    isNonComedogenic: true,
    budgetRange: "mid"
  },
  {
    name: "Foaming Moussant Cleanser",
    brand: "Caudalie",
    productType: "cleanser",
    price: 28.00,
    description: "Refreshing foaming cleanser that removes makeup and impurities while respecting the skin's natural balance. Formulated with natural grape extracts and chamomile to cleanse and soften skin. Creates a light, airy foam that rinses clean without stripping moisture.",
    imageUrl: "https://www.spacenk.com/on/demandware.static/-/Sites-spacenkmastercatalog/default/dwe903cb22/products/MILK_MKEUP/UK200036136_MILK_MKEUP_2.jpg",
    productLink: "https://www.caudalie.com/foaming-moussant-cleanser",
    rating: 4.4,
    ingredients: ["Vitis Vinifera (Grape) Fruit Water", "Coco-Glucoside", "Glycerin", "Citric Acid", "Sodium Benzoate", "Potassium Sorbate", "Chamomilla Recutita (Matricaria) Flower Extract"],
    suitableSkinTypes: ["normal", "oily", "combination"],
    targetConcerns: ["oiliness", "daily-cleansing", "freshness"],
    tags: ["natural", "grape-extract", "foaming", "respectful-balance"],
    tagList: ["Natural", "Grape Extract", "Non-Drying", "Fragrance-Free", "Sulfate-Free"],
    isOrganic: true,
    isHypoallergenic: false,
    isCrueltyFree: true,
    isNonComedogenic: true,
    budgetRange: "mid"
  },
  {
    name: "Purity Made Simple One-Step Cleanser",
    brand: "philosophy",
    productType: "cleanser",
    price: 24.00,
    description: "Multi-tasking cleanser that melts away dirt, oil, and makeup in one simple step. This award-winning formula cleanses, tones, and lightly moisturizes the skin. Gentle enough for morning and night use, leaving skin feeling perfectly clean and comfortable.",
    imageUrl: "https://cdn.shopify.com/s/files/1/0664/5393/0238/files/PHS_PUR_24_Digital_CPS_One_Step_FC_12oz.psd-JPG-300dpi-1550px_f4873e20-5dbb-4205-a886-f37b42711235.jpg?v=1759936103",
    productLink: "https://www.philosophy.com/purity-made-simple-cleanser",
    rating: 4.5,
    ingredients: ["Water", "Aqua", "Glycerin", "Butylene Glycol", "Helianthus Annuus (Sunflower) Seed Oil", "PEG-120 Methyl Glucose Dioleate", "Sodium Cocoyl Sarcosinate", "Citric Acid", "Methylparaben", "Phenoxyethanol"],
    suitableSkinTypes: ["normal", "dry", "oily", "combination"],
    targetConcerns: ["daily-cleansing", "multi-tasking", "convenience"],
    tags: ["multi-tasking", "one-step", "award-winning", "simplified-routine"],
    tagList: ["Multi-Tasking", "One Step", "Award Winning", "3-in-1 Formula", "Time-Saving"],
    isOrganic: false,
    isHypoallergenic: false,
    isCrueltyFree: false,
    isNonComedogenic: true,
    budgetRange: "mid"
  },
  {
    name: "Pure Cotton Pads",
    brand: "Shiseido",
    productType: "accessory",
    price: 12.00,
    description: "Ultra-soft, 100% pure cotton pads designed for gentle application of makeup removers and toners. Thick, plush texture prevents tearing and ensures product doesn't absorb through to your hands. Perfect for removing eye makeup and applying liquid products without waste.",
    imageUrl: "https://www.shiseido.com/dw/image/v2/BBSK_PRD/on/demandware.static/-/Sites-itemmaster_shiseido/default/dwcc04c634/images/Shiseido2024Redesignx2/Makeup/Cotton/0729238104198/SHI-SS24_PDP_Cotton_Alt_01@2x.jpg?sw=800&sh=800&sm=fit",
    productLink: "https://www.shiseido.com/pure-cotton-pads",
    rating: 4.6,
    ingredients: ["100% Cotton"],
    suitableSkinTypes: ["sensitive", "normal", "dry", "oily", "combination"],
    targetConcerns: ["application", "sensitivity", "product-absorption"],
    tags: ["accessory", "soft", "non-abrasive", "essential-tool"],
    tagList: ["100% Cotton", "Soft", "Non-Abrasive", "Essential Tool", "Gentle Application"],
    isOrganic: true,
    isHypoallergenic: true,
    isCrueltyFree: true,
    isNonComedogenic: true,
    budgetRange: "budget"
  },
  {
    name: "Coconut Cleansing Oil",
    brand: "Dove",
    productType: "cleansing_oil",
    price: 9.99,
    description: "Affordable coconut-infused cleansing oil that dissolves tough makeup while nourishing skin. Lightweight formula transforms from oil to milk when water is added, effectively removing makeup without stripping skin's natural moisture. Perfect for double cleansing routine.",
    imageUrl: "https://pcdn.goldapple.ru/p/p/19000160541/imgmain_660140ee22ff4adeba0183d3806f98bb.jpg",
    productLink: "https://www.dove.com/coconut-cleansing-oil",
    rating: 4.2,
    ingredients: ["Caprylic/Capric Triglyceride", "Cocos Nucifera (Coconut) Oil", "Isopropyl Myristate", "Sorbeth-30 Dioleate", "Parfum", "Tocopheryl Acetate", "Helianthus Annuus Seed Oil"],
    suitableSkinTypes: ["normal", "dry", "combination"],
    targetConcerns: ["budget-friendly", "nourishing", "double-cleansing"],
    tags: ["affordable", "coconut", "transforming-formula", "nourishing"],
    tagList: ["Affordable", "Coconut Infused", "Oil to Milk", "Nourishing", "Drugstore Favorite"],
    isOrganic: false,
    isHypoallergenic: false,
    isCrueltyFree: false,
    isNonComedogenic: true,
    budgetRange: "budget"
  },
  {
    name: "Green Clean Makeup Removing Cleansing Balm",
    brand: "Farmacy",
    productType: "cleansing_balm",
    price: 34.00,
    description: "Powerful yet gentle cleansing balm that melts away makeup, dirt, and impurities. Formulated with papain enzymes and sunflower and ginger root oils to cleanse thoroughly while nourishing skin. antioxidant-rich formula helps protect skin from environmental stressors.",
    imageUrl: "https://www.farmacybeauty.com/cdn/shop/files/Farmacy_GreenCleanCleansingBalm_100ml_Hero.jpg?v=1740150005&width=1056",
    productLink: "https://www.farmacybeauty.com/green-clean",
    rating: 4.6,
    ingredients: ["Sunflower Seed Oil", "Moringa Butter", "Coconut Alkanes", "Papain", "Cetearyl Alcohol", "Ginger Root Oil", "Echinacea Purpurea Extract"],
    suitableSkinTypes: ["normal", "dry", "oily", "combination", "sensitive"],
    targetConcerns: ["makeup-removal", "environmental-protection", "gentle-cleansing"],
    tags: ["natural", "papain-enzymes", "antioxidant", "melting-balm"],
    tagList: ["Natural", "Papain Enzymes", "Antioxidant Rich", "Melting Balm", "Cruelty-Free", "Clean Beauty"],
    isOrganic: true,
    isHypoallergenic: true,
    isCrueltyFree: true,
    isNonComedogenic: true,
    budgetRange: "mid"
  }
];

async function seedMakeupRemovalProducts() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productService = app.get(ProductService);
  const logger = new Logger('MakeupRemovalSeeder');

  try {
    logger.log('Starting to seed makeup removal products...');

    for (const productData of MAKEUP_REMOVAL_PRODUCTS) {
      // Create new product instance
      const product = new Product();

      // Map all properties according to your entity structure
      product.name = productData.name;
      product.brand = productData.brand;
      product.price = productData.price;
      product.description = productData.description;
      product.imageUrl = productData.imageUrl;
      product.productLink = productData.productLink;
      product.rating = productData.rating;
      product.ingredients = productData.ingredients;
      product.suitableSkinTypes = productData.suitableSkinTypes as any;
      product.targetConcerns = productData.targetConcerns;
      product.tags = productData.tags;
      product.tagList = productData.tagList;
      product.productCategory = 'makeup_remover' as any;
      product.productType = productData.productType as any;
      product.budgetRange = productData.budgetRange as any;
      product.isOrganic = productData.isOrganic;
      product.isHypoallergenic = productData.isHypoallergenic;
      product.isCrueltyFree = productData.isCrueltyFree;
      product.isNonComedogenic = productData.isNonComedogenic;
      product.apiSource = 'manual_seed';
      product.apiSourceId = `manual_${productData.name.replace(/\s+/g, '_').toLowerCase()}`;
      product.lastUpdated = new Date();
      product.isAvailable = true;

      // Save the product
      await productService.saveProducts([product]);
      logger.log(`✅ Created product: ${product.name}`);
    }

    logger.log(`✨ Successfully seeded ${MAKEUP_REMOVAL_PRODUCTS.length} makeup removal products!`);
  } catch (error) {
    logger.error('❌ Error seeding makeup removal products:', error);
    throw error;
  } finally {
    await app.close();
  }
}

// Run the seed function
if (require.main === module) {
  seedMakeupRemovalProducts()
    .then(() => {
      console.log('🎉 Makeup removal products seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Makeup removal products seeding failed:', error);
      process.exit(1);
    });
}

export { seedMakeupRemovalProducts, MAKEUP_REMOVAL_PRODUCTS };