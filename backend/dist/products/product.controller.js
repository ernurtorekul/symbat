"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("./product.service");
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    async syncProducts() {
        try {
            await this.productService.syncProductsFromAPI();
            return { message: 'Products synced successfully', count: 0 };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to sync products');
        }
    }
    async searchProducts(query) {
        if (!query || query.trim().length < 2) {
            throw new common_1.BadRequestException('Search query must be at least 2 characters');
        }
        return await this.productService.searchProducts(query);
    }
    async getProductsByCategory(category) {
        return await this.productService.getProductsByCategory(category);
    }
    async getProductsByBudget(budgetRange) {
        const validRanges = ['budget', 'mid', 'premium'];
        if (!validRanges.includes(budgetRange)) {
            throw new common_1.BadRequestException('Invalid budget range. Must be: budget, mid, or premium');
        }
        return await this.productService.getProductsByBudgetRange(budgetRange);
    }
    async getRecommendations(quizId) {
        try {
            return await this.productService.getRecommendedProductsForQuiz(quizId);
        }
        catch (error) {
            if (error.message === 'Quiz not found') {
                throw new common_1.BadRequestException('Quiz not found');
            }
            throw error;
        }
    }
    async getProductById(id) {
        const product = await this.productService.getProductById(id);
        if (!product) {
            throw new common_1.BadRequestException('Product not found');
        }
        return product;
    }
    async getAllProducts() {
        return await this.productService.getProductsByCategory('foundation');
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Post)('sync'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "syncProducts", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "searchProducts", null);
__decorate([
    (0, common_1.Get)('category/:category'),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductsByCategory", null);
__decorate([
    (0, common_1.Get)('budget/:budgetRange'),
    __param(0, (0, common_1.Param)('budgetRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductsByBudget", null);
__decorate([
    (0, common_1.Get)('recommendations/:quizId'),
    __param(0, (0, common_1.Param)('quizId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getRecommendations", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductById", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAllProducts", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map