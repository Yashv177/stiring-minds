"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDealsValidation = exports.getDealValidation = exports.createDealValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createDealValidation = joi_1.default.object({
    title: joi_1.default.string().min(3).max(200).required().trim(),
    description: joi_1.default.string().min(10).max(5000).required(),
    provider: joi_1.default.string().min(2).max(100).required().trim(),
    isLocked: joi_1.default.boolean().default(false),
    termsUrl: joi_1.default.string().uri().optional().allow('', null),
    tags: joi_1.default.array().items(joi_1.default.string().trim()).optional().default([]),
    expiresAt: joi_1.default.date().optional().allow(null),
});
exports.getDealValidation = joi_1.default.object({
    id: joi_1.default.string().hex().length(24).required(), // MongoDB ObjectId format
});
exports.listDealsValidation = joi_1.default.object({
    q: joi_1.default.string().trim().max(100).optional(),
    tags: joi_1.default.string().trim().optional(),
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(100).default(10),
});
//# sourceMappingURL=deals.validation.js.map