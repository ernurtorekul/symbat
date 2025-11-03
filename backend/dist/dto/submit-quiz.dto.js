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
exports.SubmitQuizDto = exports.SkinTone = exports.SkinType = void 0;
const class_validator_1 = require("class-validator");
var SkinType;
(function (SkinType) {
    SkinType["OILY"] = "oily";
    SkinType["DRY"] = "dry";
    SkinType["COMBINATION"] = "combination";
    SkinType["NORMAL"] = "normal";
    SkinType["SENSITIVE"] = "sensitive";
})(SkinType || (exports.SkinType = SkinType = {}));
var SkinTone;
(function (SkinTone) {
    SkinTone["VERY_FAIR"] = "very_fair";
    SkinTone["FAIR"] = "fair";
    SkinTone["MEDIUM"] = "medium";
    SkinTone["OLIVE"] = "olive";
    SkinTone["TAN"] = "tan";
    SkinTone["DEEP"] = "deep";
})(SkinTone || (exports.SkinTone = SkinTone = {}));
class SubmitQuizDto {
}
exports.SubmitQuizDto = SubmitQuizDto;
__decorate([
    (0, class_validator_1.IsEnum)(SkinType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitQuizDto.prototype, "skinType", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(SkinTone),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitQuizDto.prototype, "skinTone", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SubmitQuizDto.prototype, "skinConcerns", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SubmitQuizDto.prototype, "allergies", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SubmitQuizDto.prototype, "additionalResponses", void 0);
//# sourceMappingURL=submit-quiz.dto.js.map