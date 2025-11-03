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
exports.QuizController = void 0;
const common_1 = require("@nestjs/common");
const quiz_service_1 = require("./quiz.service");
const submit_quiz_dto_1 = require("../dto/submit-quiz.dto");
let QuizController = class QuizController {
    constructor(quizService) {
        this.quizService = quizService;
    }
    async submitQuiz(submitQuizDto) {
        try {
            return await this.quizService.submitQuiz('df8bc604-2a91-4d18-8d81-6a93bd2b047b', submitQuizDto);
        }
        catch (error) {
            if (error.message === 'User not found') {
                throw new common_1.BadRequestException('Invalid user');
            }
            throw error;
        }
    }
    async getUserQuiz(userId) {
        try {
            return await this.quizService.getUserQuiz(userId);
        }
        catch (error) {
            if (error.message === 'Quiz not found for this user') {
                throw new common_1.BadRequestException('Quiz not found for this user');
            }
            throw error;
        }
    }
    async getMyQuiz() {
        try {
            return await this.quizService.getUserQuiz('df8bc604-2a91-4d18-8d81-6a93bd2b047b');
        }
        catch (error) {
            if (error.message === 'Quiz not found for this user') {
                throw new common_1.BadRequestException('Quiz not found for this user');
            }
            throw error;
        }
    }
};
exports.QuizController = QuizController;
__decorate([
    (0, common_1.Post)('submit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [submit_quiz_dto_1.SubmitQuizDto]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "submitQuiz", null);
__decorate([
    (0, common_1.Get)('profile/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "getUserQuiz", null);
__decorate([
    (0, common_1.Get)('my-profile'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "getMyQuiz", null);
exports.QuizController = QuizController = __decorate([
    (0, common_1.Controller)('quiz'),
    __metadata("design:paramtypes", [quiz_service_1.QuizService])
], QuizController);
//# sourceMappingURL=quiz.controller.js.map