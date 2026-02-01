"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.generateTokens = generateTokens;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
exports.decodeToken = decodeToken;
exports.isTokenExpired = isTokenExpired;
exports.signJwt = signJwt;
exports.verifyJwt = verifyJwt;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
/**
 * Generate access token (short-lived, 1 day)
 */
function signAccessToken(userId) {
    return jsonwebtoken_1.default.sign({ sub: userId, type: 'access' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
/**
 * Generate refresh token (long-lived, 7 days)
 */
function signRefreshToken(userId) {
    return jsonwebtoken_1.default.sign({ sub: userId, type: 'refresh' }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
}
/**
 * Generate both tokens
 */
function generateTokens(userId) {
    return {
        accessToken: signAccessToken(userId),
        refreshToken: signRefreshToken(userId),
    };
}
/**
 * Verify access token
 */
function verifyAccessToken(token) {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
}
/**
 * Verify refresh token
 */
function verifyRefreshToken(token) {
    return jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
}
/**
 * Decode token without verification (for debugging)
 */
function decodeToken(token) {
    return jsonwebtoken_1.default.decode(token);
}
/**
 * Check if token is expired
 */
function isTokenExpired(token) {
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded?.exp)
            return true;
        return Date.now() >= decoded.exp * 1000;
    }
    catch {
        return true;
    }
}
// Keep legacy function for backward compatibility
function signJwt(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
function verifyJwt(token) {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
}
//# sourceMappingURL=jwt.js.map