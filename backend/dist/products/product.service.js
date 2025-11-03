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
var ProductService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const product_entity_1 = require("../entities/product.entity");
const quiz_entity_1 = require("../entities/quiz.entity");
const axios_1 = require("@nestjs/axios");
let ProductService = ProductService_1 = class ProductService {
    constructor(productsRepository, quizRepository, configService, httpService) {
        this.productsRepository = productsRepository;
        this.quizRepository = quizRepository;
        this.configService = configService;
        this.httpService = httpService;
        this.logger = new common_1.Logger(ProductService_1.name);
        this.makeupAPIURL = this.configService.get('BEAUTY_API_KEY');
    }
    async fetchProductsFromAPI(category) {
        try {
            let url = `${this.makeupAPIURL}/products.json`;
            if (category) {
                url += `?product_type=${category}`;
            }
            this.logger.log(`Fetching products from API: ${url}`);
            const response = await this.httpService.get(url).toPromise();
            const apiProducts = response.data;
            const products = apiProducts.map(apiProduct => this.mapMakeupAPIToProduct(apiProduct));
            return products;
        }
        catch (error) {
            this.logger.error('Error fetching products from API', error);
            throw error;
        }
    }
    async saveProducts(products) {
        try {
            this.logger.log(`Saving ${products.length} products to database`);
            return await this.productsRepository.save(products);
        }
        catch (error) {
            this.logger.error('Error saving products to database', error);
            throw error;
        }
    }
    async getProductsByCategory(category) {
        return await this.productsRepository.find({
            where: {
                productCategory: category,
                isAvailable: true
            },
            order: { rating: 'DESC' }
        });
    }
    async getProductsBySkinType(skinType) {
        return await this.productsRepository.find({
            where: {
                suitableSkinTypes: { $contains: [skinType] },
                isAvailable: true
            },
            order: { rating: 'DESC' }
        });
    }
    async getProductsByConcerns(concerns) {
        return await this.productsRepository
            .createQueryBuilder('product')
            .where('product.isAvailable = :isAvailable', { isAvailable: true })
            .andWhere('product.targetConcerns && ARRAY[:...concerns]', { concerns })
            .orderBy('product.rating', 'DESC')
            .getMany();
    }
    async getProductsByBudgetRange(budgetRange) {
        return await this.productsRepository.find({
            where: {
                budgetRange: budgetRange,
                isAvailable: true
            },
            order: { rating: 'DESC' }
        });
    }
    async searchProducts(query) {
        return await this.productsRepository
            .createQueryBuilder('product')
            .where('product.isAvailable = :isAvailable', { isAvailable: true })
            .andWhere('(product.name ILIKE :query OR product.brand ILIKE :query OR product.description ILIKE :query)', { query: `%${query}%` })
            .orderBy('product.rating', 'DESC')
            .getMany();
    }
    async generateRecommendations(quiz) {
        this.logger.log(`Generating recommendations for quiz: ${quiz.id}`);
        let recommendedProducts = [];
        const skinTypeProducts = await this.getProductsBySkinType(quiz.skinType);
        recommendedProducts = [...recommendedProducts, ...skinTypeProducts];
        if (quiz.skinConcerns && quiz.skinConcerns.length > 0) {
            const concernProducts = await this.getProductsByConcerns(quiz.skinConcerns);
            recommendedProducts = [...recommendedProducts, ...concernProducts];
        }
        if (quiz.allergies && quiz.allergies.length > 0) {
            recommendedProducts = recommendedProducts.filter(product => {
                return !product.ingredients?.some(ingredient => quiz.allergies.some(allergy => ingredient.toLowerCase().includes(allergy.toLowerCase())));
            });
        }
        const budgetPreference = quiz.additionalResponses?.budgetRange;
        if (budgetPreference) {
            const budgetProducts = await this.getProductsByBudgetRange(budgetPreference);
            recommendedProducts = recommendedProducts.filter(product => budgetProducts.some(budgetProduct => budgetProduct.id === product.id));
        }
        const productPreference = quiz.additionalResponses?.productPreference;
        if (productPreference === 'natural') {
            recommendedProducts = recommendedProducts.filter(product => product.isOrganic ||
                product.tagList?.some(tag => tag.toLowerCase().includes('natural') ||
                    tag.toLowerCase().includes('organic')));
        }
        const uniqueProducts = recommendedProducts.filter((product, index, self) => index === self.findIndex((p) => p.id === product.id));
        return uniqueProducts
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 12);
    }
    async getRecommendedProductsForQuiz(quizId) {
        const quiz = await this.quizRepository.findOne({
            where: { id: quizId },
            relations: ['recommendedProducts']
        });
        if (!quiz) {
            throw new Error('Quiz not found');
        }
        if (quiz.recommendedProducts && quiz.recommendedProducts.length > 0) {
            return quiz.recommendedProducts;
        }
        const recommendations = await this.generateRecommendations(quiz);
        quiz.recommendedProducts = recommendations;
        await this.quizRepository.save(quiz);
        return recommendations;
    }
    mapMakeupAPIToProduct(apiProduct) {
        const product = new product_entity_1.Product();
        product.name = apiProduct.name;
        product.brand = apiProduct.brand;
        product.price = parseFloat(apiProduct.price) || 0;
        product.imageUrl = apiProduct.image_link;
        product.productLink = apiProduct.product_link;
        product.description = apiProduct.description;
        product.rating = apiProduct.rating;
        product.productCategory = apiProduct.category;
        product.productType = apiProduct.product_type;
        product.tagList = apiProduct.tag_list;
        product.apiSourceId = apiProduct.id.toString();
        product.apiSource = 'makeup_api';
        product.lastUpdated = new Date();
        product.isAvailable = true;
        this.analyzeProductTags(product);
        this.classifyBudgetRange(product);
        this.setSuitableSkinTypes(product);
        return product;
    }
    analyzeProductTags(product) {
        if (!product.tagList)
            return;
        const tags = product.tagList.map(tag => tag.toLowerCase());
        if (tags.some(tag => tag.includes('natural') ||
            tag.includes('organic') ||
            tag.includes('plant-based'))) {
            product.isOrganic = true;
        }
        if (tags.some(tag => tag.includes('hypoallergenic'))) {
            product.isHypoallergenic = true;
        }
        if (tags.some(tag => tag.includes('cruelty-free') ||
            tag.includes('vegan') ||
            tag.includes('not tested on animals'))) {
            product.isCrueltyFree = true;
        }
        if (tags.some(tag => tag.includes('non-comedogenic'))) {
            product.isNonComedogenic = true;
        }
    }
    classifyBudgetRange(product) {
        if (!product.price) {
            product.budgetRange = 'mid';
            return;
        }
        if (product.price < 15) {
            product.budgetRange = 'budget';
        }
        else if (product.price > 50) {
            product.budgetRange = 'premium';
        }
        else {
            product.budgetRange = 'mid';
        }
    }
    setSuitableSkinTypes(product) {
        const suitableTypes = ['normal'];
        if (product.productType === 'foundation' || product.productType === 'powder') {
            if (product.tagList) {
                const tags = product.tagList.map(tag => tag.toLowerCase());
                if (tags.some(tag => tag.includes('matte'))) {
                    suitableTypes.push('oily');
                }
                if (tags.some(tag => tag.includes('hydrating') ||
                    tag.includes('moisturizing') ||
                    tag.includes('dewy'))) {
                    suitableTypes.push('dry');
                }
                if (tags.some(tag => tag.includes('sensitive') ||
                    tag.includes('gentle') ||
                    product.isHypoallergenic)) {
                    suitableTypes.push('sensitive');
                }
            }
        }
        if (!product.tagList?.some(tag => tag.toLowerCase().includes('oil-free') ||
            tag.toLowerCase().includes('heavy'))) {
            suitableTypes.push('combination');
        }
        product.suitableSkinTypes = suitableTypes;
    }
    async syncProductsFromAPI() {
        this.logger.log('Starting product sync from Makeup API');
        try {
            const apiProducts = await this.fetchProductsFromAPI();
            await this.productsRepository.delete({ apiSource: 'makeup_api' });
            await this.saveProducts(apiProducts);
            this.logger.log(`Successfully synced ${apiProducts.length} products from Makeup API`);
        }
        catch (error) {
            this.logger.error('Error syncing products from API', error);
            throw error;
        }
    }
    async getProductById(id) {
        return await this.productsRepository.findOne({
            where: { id, isAvailable: true }
        });
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = ProductService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(quiz_entity_1.Quiz)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService,
        axios_1.HttpService])
], ProductService);
//# sourceMappingURL=product.service.js.map