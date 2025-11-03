import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Product } from '../entities/product.entity';
import { Quiz } from '../entities/quiz.entity';
import { HttpService } from '@nestjs/axios';

interface MakeupAPIProduct {
  id: number;
  brand: string;
  name: string;
  price: string;
  image_link: string;
  product_link: string;
  website_link: string;
  description: string;
  rating: number;
  category: string;
  product_type: string;
  tag_list: string[];
  created_at: string;
  updated_at: string;
  product_api_url: string;
  api_featured_image: string;
  product_colors: any[];
}

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  private readonly makeupAPIURL: string;

  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.makeupAPIURL = this.configService.get<string>('BEAUTY_API_KEY');
  }

  async fetchProductsFromAPI(category?: string): Promise<Product[]> {
    try {
      let url = `${this.makeupAPIURL}/products.json`;
      if (category) {
        url += `?product_type=${category}`;
      }

      this.logger.log(`Fetching products from API: ${url}`);
      const response = await this.httpService.get<MakeupAPIProduct[]>(url).toPromise();
      const apiProducts = response.data;

      const products: Product[] = apiProducts.map(apiProduct =>
        this.mapMakeupAPIToProduct(apiProduct)
      );

      return products;
    } catch (error) {
      this.logger.error('Error fetching products from API', error);
      throw error;
    }
  }

  async saveProducts(products: Product[]): Promise<Product[]> {
    try {
      this.logger.log(`Saving ${products.length} products to database`);
      return await this.productsRepository.save(products);
    } catch (error) {
      this.logger.error('Error saving products to database', error);
      throw error;
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await this.productsRepository.find({
      where: {
        productCategory: category as any,
        isAvailable: true
      },
      order: { rating: 'DESC' }
    });
  }

  async getProductsBySkinType(skinType: string): Promise<Product[]> {
    return await this.productsRepository.find({
      where: {
        suitableSkinTypes: { $contains: [skinType] } as any,
        isAvailable: true
      },
      order: { rating: 'DESC' }
    });
  }

  async getProductsByConcerns(concerns: string[]): Promise<Product[]> {
    return await this.productsRepository
      .createQueryBuilder('product')
      .where('product.isAvailable = :isAvailable', { isAvailable: true })
      .andWhere('product.targetConcerns && ARRAY[:...concerns]', { concerns })
      .orderBy('product.rating', 'DESC')
      .getMany();
  }

  async getProductsByBudgetRange(budgetRange: string): Promise<Product[]> {
    return await this.productsRepository.find({
      where: {
        budgetRange: budgetRange as any,
        isAvailable: true
      },
      order: { rating: 'DESC' }
    });
  }

  async searchProducts(query: string): Promise<Product[]> {
    return await this.productsRepository
      .createQueryBuilder('product')
      .where('product.isAvailable = :isAvailable', { isAvailable: true })
      .andWhere(
        '(product.name ILIKE :query OR product.brand ILIKE :query OR product.description ILIKE :query)',
        { query: `%${query}%` }
      )
      .orderBy('product.rating', 'DESC')
      .getMany();
  }

  async generateRecommendations(quiz: Quiz): Promise<Product[]> {
    this.logger.log(`Generating recommendations for quiz: ${quiz.id}`);

    let recommendedProducts: Product[] = [];

    // 1. Get products by skin type compatibility
    const skinTypeProducts = await this.getProductsBySkinType(quiz.skinType);
    recommendedProducts = [...recommendedProducts, ...skinTypeProducts];

    // 2. Get products by skin concerns
    if (quiz.skinConcerns && quiz.skinConcerns.length > 0) {
      const concernProducts = await this.getProductsByConcerns(quiz.skinConcerns);
      recommendedProducts = [...recommendedProducts, ...concernProducts];
    }

    // 3. Filter by allergies (exclude products with allergens)
    if (quiz.allergies && quiz.allergies.length > 0) {
      recommendedProducts = recommendedProducts.filter(product => {
        return !product.ingredients?.some(ingredient =>
          quiz.allergies.some(allergy =>
            ingredient.toLowerCase().includes(allergy.toLowerCase())
          )
        );
      });
    }

    // 4. Filter by budget preference if available in additional responses
    const budgetPreference = quiz.additionalResponses?.budgetRange;
    if (budgetPreference) {
      const budgetProducts = await this.getProductsByBudgetRange(budgetPreference);
      recommendedProducts = recommendedProducts.filter(product =>
        budgetProducts.some(budgetProduct => budgetProduct.id === product.id)
      );
    }

    // 5. Filter by product preference (natural, etc.) if available
    const productPreference = quiz.additionalResponses?.productPreference;
    if (productPreference === 'natural') {
      recommendedProducts = recommendedProducts.filter(product =>
        product.isOrganic ||
        product.tagList?.some(tag =>
          tag.toLowerCase().includes('natural') ||
          tag.toLowerCase().includes('organic')
        )
      );
    }

    // 6. Remove duplicates and sort by rating
    const uniqueProducts = recommendedProducts.filter((product, index, self) =>
      index === self.findIndex((p) => p.id === product.id)
    );

    // 7. Sort by rating and limit to top recommendations
    return uniqueProducts
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 12); // Return top 12 products
  }

  async getRecommendedProductsForQuiz(quizId: string): Promise<Product[]> {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['recommendedProducts']
    });

    if (!quiz) {
      throw new Error('Quiz not found');
    }

    // If recommendations already exist, return them
    if (quiz.recommendedProducts && quiz.recommendedProducts.length > 0) {
      return quiz.recommendedProducts;
    }

    // Generate new recommendations
    const recommendations = await this.generateRecommendations(quiz);

    // Save recommendations to quiz
    quiz.recommendedProducts = recommendations;
    await this.quizRepository.save(quiz);

    return recommendations;
  }

  private mapMakeupAPIToProduct(apiProduct: MakeupAPIProduct): Product {
    const product = new Product();
    product.name = apiProduct.name;
    product.brand = apiProduct.brand;
    product.price = parseFloat(apiProduct.price) || 0;
    product.imageUrl = apiProduct.image_link;
    product.productLink = apiProduct.product_link;
    product.description = apiProduct.description;
    product.rating = apiProduct.rating;
    product.productCategory = apiProduct.category as any;
    product.productType = apiProduct.product_type as any;
    product.tagList = apiProduct.tag_list;
    product.apiSourceId = apiProduct.id.toString();
    product.apiSource = 'makeup_api';
    product.lastUpdated = new Date();
    product.isAvailable = true;

    // Analyze tags to set additional properties
    this.analyzeProductTags(product);

    // Classify budget range based on price
    this.classifyBudgetRange(product);

    // Set suitable skin types based on product type and tags
    this.setSuitableSkinTypes(product);

    return product;
  }

  private analyzeProductTags(product: Product): void {
    if (!product.tagList) return;

    const tags = product.tagList.map(tag => tag.toLowerCase());

    // Check for organic/natural products
    if (tags.some(tag =>
      tag.includes('natural') ||
      tag.includes('organic') ||
      tag.includes('plant-based')
    )) {
      product.isOrganic = true;
    }

    // Check for hypoallergenic products
    if (tags.some(tag => tag.includes('hypoallergenic'))) {
      product.isHypoallergenic = true;
    }

    // Check for cruelty-free products
    if (tags.some(tag =>
      tag.includes('cruelty-free') ||
      tag.includes('vegan') ||
      tag.includes('not tested on animals')
    )) {
      product.isCrueltyFree = true;
    }

    // Check for non-comedogenic products
    if (tags.some(tag => tag.includes('non-comedogenic'))) {
      product.isNonComedogenic = true;
    }
  }

  private classifyBudgetRange(product: Product): void {
    if (!product.price) {
      product.budgetRange = 'mid';
      return;
    }

    if (product.price < 15) {
      product.budgetRange = 'budget';
    } else if (product.price > 50) {
      product.budgetRange = 'premium';
    } else {
      product.budgetRange = 'mid';
    }
  }

  private setSuitableSkinTypes(product: Product): void {
    const suitableTypes: string[] = ['normal']; // Default to normal for all products

    // Analyze product type and tags to determine suitable skin types
    if (product.productType === 'foundation' || product.productType === 'powder') {
      if (product.tagList) {
        const tags = product.tagList.map(tag => tag.toLowerCase());

        // Matte products good for oily skin
        if (tags.some(tag => tag.includes('matte'))) {
          suitableTypes.push('oily');
        }

        // Hydrating products good for dry skin
        if (tags.some(tag =>
          tag.includes('hydrating') ||
          tag.includes('moisturizing') ||
          tag.includes('dewy')
        )) {
          suitableTypes.push('dry');
        }

        // Sensitive skin products
        if (tags.some(tag =>
          tag.includes('sensitive') ||
          tag.includes('gentle') ||
          product.isHypoallergenic
        )) {
          suitableTypes.push('sensitive');
        }
      }
    }

    // Add combination skin to most products
    if (!product.tagList?.some(tag =>
      tag.toLowerCase().includes('oil-free') ||
      tag.toLowerCase().includes('heavy')
    )) {
      suitableTypes.push('combination');
    }

    product.suitableSkinTypes = suitableTypes as any;
  }

  async syncProductsFromAPI(): Promise<void> {
    this.logger.log('Starting product sync from Makeup API');

    try {
      // Fetch all products from API
      const apiProducts = await this.fetchProductsFromAPI();

      // Clear existing products from makeup_api source
      await this.productsRepository.delete({ apiSource: 'makeup_api' });

      // Save new products
      await this.saveProducts(apiProducts);

      this.logger.log(`Successfully synced ${apiProducts.length} products from Makeup API`);
    } catch (error) {
      this.logger.error('Error syncing products from API', error);
      throw error;
    }
  }

  async getProductById(id: string): Promise<Product> {
    return await this.productsRepository.findOne({
      where: { id, isAvailable: true }
    });
  }
}