"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClaim = createClaim;
exports.listUserClaims = listUserClaims;
const claim_model_1 = __importDefault(require("../models/claim.model"));
const deal_model_1 = __importDefault(require("../models/deal.model"));
async function createClaim(req, res, next) {
    try {
        const user = req.user;
        const { dealId } = req.body;
        const deal = await deal_model_1.default.findById(dealId);
        if (!deal)
            return res.status(404).json({ error: 'Deal not found' });
        // Authorization: locked deals require verified users
        if (deal.isLocked && !user.isVerified) {
            return res.status(403).json({ error: 'Deal locked: verification required' });
        }
        // Check for existing claim
        const existing = await claim_model_1.default.findOne({ user: user._id, deal: deal._id });
        if (existing)
            return res.status(409).json({ error: 'You have already claimed this deal' });
        const claim = await claim_model_1.default.create({
            user: user._id,
            deal: deal._id,
            status: 'pending',
        });
        res.status(201).json({ claim });
    }
    catch (err) {
        // Handle duplicate key error (race condition)
        if (err.code === 11000) {
            return res.status(409).json({ error: 'You have already claimed this deal' });
        }
        next(err);
    }
}
async function listUserClaims(req, res, next) {
    try {
        const user = req.user;
        const { page = 1, limit = 10, status } = req.query;
        const filter = { user: user._id };
        if (status)
            filter.status = status;
        const skip = (Number(page) - 1) * Number(limit);
        const [claims, total] = await Promise.all([
            claim_model_1.default.find(filter).populate('deal').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
            claim_model_1.default.countDocuments(filter),
        ]);
        res.json({
            claims,
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
//# sourceMappingURL=claims.controller.js.map