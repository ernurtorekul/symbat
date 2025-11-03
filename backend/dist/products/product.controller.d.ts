import { ProductService } from './product.service';
import { Product } from '../entities/product.entity';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    syncProducts(): Promise<{
        message: string;
        count: number;
    }>;
    searchProducts(query: string): Promise<Product[]>;
    getProductsByCategory(category: string): Promise<Product[]>;
    getProductsByBudget(budgetRange: string): Promise<Product[]>;
    getRecommendations(quizId: string): Promise<Product[]>;
    getProductById(id: string): Promise<Product>;
    getAllProducts(): Promise<Product[]>;
}
