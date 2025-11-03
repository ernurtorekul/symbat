import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  BadRequestException
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '../entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('sync')
  async syncProducts(): Promise<{ message: string; count: number }> {
    try {
      await this.productService.syncProductsFromAPI();
      return { message: 'Products synced successfully', count: 0 };
    } catch (error) {
      throw new BadRequestException('Failed to sync products');
    }
  }

  @Get('search')
  async searchProducts(@Query('q') query: string): Promise<Product[]> {
    if (!query || query.trim().length < 2) {
      throw new BadRequestException('Search query must be at least 2 characters');
    }
    return await this.productService.searchProducts(query);
  }

  @Get('category/:category')
  async getProductsByCategory(@Param('category') category: string): Promise<Product[]> {
    return await this.productService.getProductsByCategory(category);
  }

  @Get('budget/:budgetRange')
  async getProductsByBudget(@Param('budgetRange') budgetRange: string): Promise<Product[]> {
    const validRanges = ['budget', 'mid', 'premium'];
    if (!validRanges.includes(budgetRange)) {
      throw new BadRequestException('Invalid budget range. Must be: budget, mid, or premium');
    }
    return await this.productService.getProductsByBudgetRange(budgetRange);
  }

  @Get('recommendations/:quizId')
  async getRecommendations(@Param('quizId') quizId: string): Promise<Product[]> {
    try {
      return await this.productService.getRecommendedProductsForQuiz(quizId);
    } catch (error) {
      if (error.message === 'Quiz not found') {
        throw new BadRequestException('Quiz not found');
      }
      throw error;
    }
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    const product = await this.productService.getProductById(id);
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    return product;
  }

  @Get()
  async getAllProducts(): Promise<Product[]> {
    // Return a limited set of popular products
    return await this.productService.getProductsByCategory('foundation');
  }
}