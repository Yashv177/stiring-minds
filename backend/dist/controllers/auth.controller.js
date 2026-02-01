"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user.model"));
const jwt_1 = require("../utils/jwt");
async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;
        const existing = await user_model_1.default.findOne({ email });
        if (existing)
            return res.status(409).json({ error: 'Email already in use' });
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const user = await user_model_1.default.create({ name, email, passwordHash });
        const token = (0, jwt_1.signJwt)({ sub: user._id.toString() });
        return res.status(201).json({
            user: { id: user._id, name: user.name, email: user.email, isVerified: user.isVerified },
            token,
        });
    }
    catch (err) {
        next(err);
    }
}
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.default.findOne({ email });
        if (!user)
            return res.status(401).json({ error: 'Invalid credentials' });
        const ok = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!ok)
            return res.status(401).json({ error: 'Invalid credentials' });
        const token = (0, jwt_1.signJwt)({ sub: user._id.toString() });
        return res.json({
            user: { id: user._id, name: user.name, email: user.email, isVerified: user.isVerified },
            token,
        });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=auth.controller.js.map