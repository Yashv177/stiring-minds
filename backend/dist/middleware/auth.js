"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtAuth = jwtAuth;
const jwt_1 = require("../utils/jwt");
const user_model_1 = __importDefault(require("../models/user.model"));
async function jwtAuth(req, res, next) {
    try {
        const auth = req.headers.authorization;
        if (!auth || !auth.startsWith('Bearer '))
            return res.status(401).json({ error: 'Missing token' });
        const token = auth.split(' ')[1];
        const payload = (0, jwt_1.verifyJwt)(token);
        if (!payload || !payload.sub)
            return res.status(401).json({ error: 'Invalid token' });
        const user = await user_model_1.default.findById(payload.sub).select('-passwordHash');
        if (!user)
            return res.status(401).json({ error: 'User not found' });
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: 'Invalid token', detail: err.message });
    }
}
//# sourceMappingURL=auth.js.map