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
exports.Recommendation = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const product_entity_1 = require("./product.entity");
let Recommendation = class Recommendation {
};
exports.Recommendation = Recommendation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Recommendation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Recommendation.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], Recommendation.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['general', 'personal'],
        default: 'general',
        comment: 'Recommendation mode: general (filter-based) or personal (AI-based)'
    }),
    __metadata("design:type", String)
], Recommendation.prototype, "mode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
        comment: 'AI-generated or filter-based explanation for recommendation'
    }),
    __metadata("design:type", String)
], Recommendation.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 3,
        scale: 2,
        nullable: true,
        comment: 'Confidence score (0.00-1.00) for AI recommendations'
    }),
    __metadata("design:type", Number)
], Recommendation.prototype, "confidenceScore", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: false,
        comment: 'Whether user has favorited/saved this recommendation'
    }),
    __metadata("design:type", Boolean)
], Recommendation.prototype, "isFavorite", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: false,
        comment: 'Whether user has viewed this recommendation'
    }),
    __metadata("design:type", Boolean)
], Recommendation.prototype, "isViewed", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        nullable: true,
        comment: 'Additional metadata like matching criteria, user feedback, etc.'
    }),
    __metadata("design:type", Object)
], Recommendation.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamp',
        name: 'created_at'
    }),
    __metadata("design:type", Date)
], Recommendation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.recommendations, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], Recommendation.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, product => product.recommendations, { onDelete: 'CASCADE' }),
    __metadata("design:type", product_entity_1.Product)
], Recommendation.prototype, "product", void 0);
exports.Recommendation = Recommendation = __decorate([
    (0, typeorm_1.Entity)('recommendations')
], Recommendation);
//# sourceMappingURL=recommendation.entity.js.map