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
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const recommendation_entity_1 = require("./recommendation.entity");
const quiz_entity_1 = require("./quiz.entity");
let Product = class Product {
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        nullable: true,
        comment: 'Product main category'
    }),
    __metadata("design:type", String)
], Product.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        nullable: true,
        comment: 'Specific product category from API'
    }),
    __metadata("design:type", String)
], Product.prototype, "productCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        nullable: true,
        comment: 'Product type from API'
    }),
    __metadata("design:type", String)
], Product.prototype, "productType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true
    }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
        name: 'image_url'
    }),
    __metadata("design:type", String)
], Product.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
        name: 'product_link'
    }),
    __metadata("design:type", String)
], Product.prototype, "productLink", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        array: true,
        nullable: true,
        comment: 'List of ingredients'
    }),
    __metadata("design:type", Array)
], Product.prototype, "ingredients", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        array: true,
        nullable: true,
        name: 'suitable_skin_types',
        comment: 'Skin types this product is suitable for'
    }),
    __metadata("design:type", Array)
], Product.prototype, "suitableSkinTypes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        array: true,
        nullable: true,
        comment: 'Target skin concerns'
    }),
    __metadata("design:type", Array)
], Product.prototype, "targetConcerns", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        array: true,
        nullable: true,
        comment: 'Tags for filtering and search'
    }),
    __metadata("design:type", Array)
], Product.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        array: true,
        nullable: true,
        comment: 'Tag list from API'
    }),
    __metadata("design:type", Array)
], Product.prototype, "tagList", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
        comment: 'Price in USD'
    }),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['budget', 'mid', 'premium'],
        default: 'mid',
        comment: 'Budget classification'
    }),
    __metadata("design:type", String)
], Product.prototype, "budgetRange", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 2,
        scale: 1,
        nullable: true,
        comment: 'Product rating (1-5)'
    }),
    __metadata("design:type", Number)
], Product.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: true,
        name: 'api_source_id',
        comment: 'ID from external API source'
    }),
    __metadata("design:type", String)
], Product.prototype, "apiSourceId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['makeup_api', 'open_beauty_facts', 'sephora', 'ulta', 'cosdna', 'manual_seed'],
        default: 'makeup_api',
        name: 'api_source'
    }),
    __metadata("design:type", String)
], Product.prototype, "apiSource", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        name: 'last_updated'
    }),
    __metadata("design:type", Date)
], Product.prototype, "lastUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: true,
        comment: 'Whether this product is currently available'
    }),
    __metadata("design:type", Boolean)
], Product.prototype, "isAvailable", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, comment: 'Product is non-comedogenic' }),
    __metadata("design:type", Boolean)
], Product.prototype, "isNonComedogenic", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, comment: 'Product is hypoallergenic' }),
    __metadata("design:type", Boolean)
], Product.prototype, "isHypoallergenic", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, comment: 'Product contains natural/organic ingredients' }),
    __metadata("design:type", Boolean)
], Product.prototype, "isOrganic", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, comment: 'Product is cruelty-free' }),
    __metadata("design:type", Boolean)
], Product.prototype, "isCrueltyFree", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => recommendation_entity_1.Recommendation, recommendation => recommendation.product),
    __metadata("design:type", Array)
], Product.prototype, "recommendations", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => quiz_entity_1.Quiz, quiz => quiz.recommendedProducts),
    __metadata("design:type", Array)
], Product.prototype, "recommendedFor", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)('products')
], Product);
//# sourceMappingURL=product.entity.js.map