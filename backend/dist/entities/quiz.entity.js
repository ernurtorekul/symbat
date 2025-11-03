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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const product_entity_1 = require("./product.entity");
let Quiz = class Quiz {
};
exports.Quiz = Quiz;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Quiz.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', unique: true }),
    __metadata("design:type", String)
], Quiz.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['oily', 'dry', 'combination', 'normal', 'sensitive'],
        comment: 'Primary skin type'
    }),
    __metadata("design:type", String)
], Quiz.prototype, "skinType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['very_fair', 'fair', 'medium', 'olive', 'tan', 'deep'],
        nullable: true,
        comment: 'Skin tone/complexion'
    }),
    __metadata("design:type", String)
], Quiz.prototype, "skinTone", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        array: true,
        nullable: true,
        comment: 'List of allergies'
    }),
    __metadata("design:type", Array)
], Quiz.prototype, "allergies", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        array: true,
        nullable: true,
        comment: 'List of skin concerns'
    }),
    __metadata("design:type", Array)
], Quiz.prototype, "skinConcerns", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        nullable: true,
        comment: 'Additional quiz responses as JSON'
    }),
    __metadata("design:type", Object)
], Quiz.prototype, "additionalResponses", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        name: 'completed_at'
    }),
    __metadata("design:type", Date)
], Quiz.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, user => user.quiz, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Quiz.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => product_entity_1.Product, product => product.recommendedFor, { cascade: true }),
    (0, typeorm_1.JoinTable)({
        name: 'quiz_recommended_products',
        joinColumn: { name: 'quiz_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' }
    }),
    __metadata("design:type", Array)
], Quiz.prototype, "recommendedProducts", void 0);
exports.Quiz = Quiz = __decorate([
    (0, typeorm_1.Entity)('quizzes')
], Quiz);
//# sourceMappingURL=quiz.entity.js.map