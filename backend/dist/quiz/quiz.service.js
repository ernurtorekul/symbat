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
exports.QuizService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const quiz_entity_1 = require("../entities/quiz.entity");
const user_entity_1 = require("../entities/user.entity");
const product_entity_1 = require("../entities/product.entity");
let QuizService = class QuizService {
    constructor(quizRepository, userRepository, productsRepository) {
        this.quizRepository = quizRepository;
        this.userRepository = userRepository;
        this.productsRepository = productsRepository;
    }
    async submitQuiz(userId, submitQuizDto) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['quiz']
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        let quiz = user.quiz;
        if (quiz) {
            quiz.skinType = submitQuizDto.skinType;
            quiz.skinTone = submitQuizDto.skinTone;
            quiz.skinConcerns = submitQuizDto.skinConcerns;
            quiz.allergies = submitQuizDto.allergies || [];
            quiz.additionalResponses = submitQuizDto.additionalResponses || {};
            quiz.completedAt = new Date();
        }
        else {
            quiz = this.quizRepository.create({
                ...submitQuizDto,
                user: user,
                completedAt: new Date(),
            });
        }
        const savedQuiz = await this.quizRepository.save(quiz);
        await this.generateBasicRecommendations(savedQuiz);
        const quizWithUser = await this.quizRepository.findOne({
            where: { id: savedQuiz.id },
            relations: ['user', 'recommendedProducts'],
        });
        return this.mapToResponseDto(quizWithUser);
    }
    async getUserQuiz(userId) {
        const quiz = await this.quizRepository.findOne({
            where: { user: { id: userId } },
            relations: ['user', 'recommendedProducts'],
        });
        if (!quiz) {
            throw new common_1.NotFoundException('Quiz not found for this user');
        }
        return this.mapToResponseDto(quiz);
    }
    async generateBasicRecommendations(quiz) {
        let queryBuilder = this.productsRepository
            .createQueryBuilder('product')
            .where('product.isAvailable = :isAvailable', { isAvailable: true })
            .orderBy('product.rating', 'DESC')
            .take(12);
        if (quiz.skinType === 'oily') {
            queryBuilder = queryBuilder.andWhere('(:tag1 = ANY(product.tagList) OR :tag2 = ANY(product.tagList) OR product.description ILIKE :desc1)', { tag1: 'oil-free', tag2: 'mattifying', desc1: '%oily skin%' });
        }
        else if (quiz.skinType === 'dry') {
            queryBuilder = queryBuilder.andWhere('(:tag1 = ANY(product.tagList) OR :tag2 = ANY(product.tagList) OR product.description ILIKE :desc1)', { tag1: 'hydrating', tag2: 'moisturizing', desc1: '%dry skin%' });
        }
        else if (quiz.skinType === 'sensitive') {
            queryBuilder = queryBuilder.andWhere('(product.isHypoallergenic = :hypo OR :tag1 = ANY(product.tagList) OR product.description ILIKE :desc1)', { hypo: true, tag1: 'gentle', desc1: '%sensitive skin%' });
        }
        if (quiz.skinConcerns.includes('Acne')) {
            queryBuilder = queryBuilder.andWhere('(product.isNonComedogenic = :nonComedo OR :tag1 = ANY(product.tagList))', { nonComedo: true, tag1: 'acne' });
        }
        if (quiz.skinConcerns.includes('Anti-aging') || quiz.skinConcerns.includes('Wrinkles')) {
            queryBuilder = queryBuilder.andWhere('(:tag1 = ANY(product.tagList) OR :tag2 = ANY(product.tagList) OR product.description ILIKE :desc1)', { tag1: 'anti-aging', tag2: 'retinol', desc1: '%wrinkle%' });
        }
        const recommendedProducts = await queryBuilder.getMany();
        if (recommendedProducts.length > 0) {
            quiz.recommendedProducts = recommendedProducts;
            await this.quizRepository.save(quiz);
        }
    }
    mapToResponseDto(quiz) {
        return {
            id: quiz.id,
            skinType: quiz.skinType,
            skinTone: quiz.skinTone,
            skinConcerns: quiz.skinConcerns,
            allergies: quiz.allergies,
            additionalResponses: quiz.additionalResponses,
            completedAt: quiz.completedAt,
            userId: quiz.user.id,
            recommendedProducts: quiz.recommendedProducts || [],
        };
    }
};
exports.QuizService = QuizService;
exports.QuizService = QuizService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(quiz_entity_1.Quiz)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], QuizService);
//# sourceMappingURL=quiz.service.js.map