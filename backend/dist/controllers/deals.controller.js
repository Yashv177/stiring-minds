"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDeals = listDeals;
exports.getDeal = getDeal;
const deal_model_1 = __importDefault(require("../models/deal.model"));
async function listDeals(req, res, next) {
    try {
        const { q, tags, page = 1, limit = 10 } = req.query;
        const filter = {};
        if (q)
            filter.$text = { $search: String(q) };
        if (tags)
            filter.tags = { $in: String(tags).split(',') };
        const skip = (Number(page) - 1) * Number(limit);
        const [deals, total] = await Promise.all([
            deal_model_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
            deal_model_1.default.countDocuments(filter),
        ]);
        res.json({
            deals,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    }
    catch (err) {
        next(err);
    }
}
async function getDeal(req, res, next) {
    try {
        const { id } = req.params;
        const deal = await deal_model_1.default.findById(id);
        if (!deal)
            return res.status(404).json({ error: 'Deal not found' });
        res.json({ deal });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=deals.controller.js.map