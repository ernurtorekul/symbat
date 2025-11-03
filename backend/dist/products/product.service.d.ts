import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Product } from '../entities/product.entity';
import { Quiz } from '../entities/quiz.entity';
import { HttpService } from '@nestjs/axios';
export declare class ProductService {
    private productsRepository;
    private quizRepository;
    private configService;
    private httpService;
    private readonly logger;
    private readonly makeupAPIURL;
    constructor(productsRepository: Repository<Product>, quizRepository: Repository<Quiz>, configService: ConfigService, httpService: HttpService);
    fetchProductsFromAPI(category?: string): Promise<Product[]>;
    saveProducts(products: Product[]): Promise<Product[]>;
    getProductsByCategory(category: string): Promise<Product[]>;
    getProductsBySkinType(skinType: string): Promise<Product[]>;
    getProductsByConcerns(concerns: string[]): Promise<Product[]>;
    getProductsByBudgetRange(budgetRange: string): Promise<Product[]>;
    searchProducts(query: string): Promise<Product[]>;
    generateRecommendations(quiz: Quiz): Promise<Product[]>;
    getRecommendedProductsForQuiz(quizId: string): Promise<Product[]>;
    private mapMakeupAPIToProduct;
    private analyzeProductTags;
    private classifyBudgetRange;
    private setSuitableSkinTypes;
    syncProductsFromAPI(): Promise<void>;
    getProductById(id: string): Promise<Product>;
}
