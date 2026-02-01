"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationValidation = exports.createClaimValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createClaimValidation = joi_1.default.object({
    dealId: joi_1.default.string().hex().length(24).required(), // MongoDB ObjectId format
    metadata: joi_1.default.object().optional().default({}),
});
exports.paginationValidation = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(100).default(10),
    status: joi_1.default.string().valid('pending', 'approved', 'rejected', 'redeemed').optional(),
});
//# sourceMappingURL=claims.validation.js.map