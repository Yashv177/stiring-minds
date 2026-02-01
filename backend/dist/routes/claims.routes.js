"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const claims_controller_1 = require("../controllers/claims.controller");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const claims_validation_1 = require("../validations/claims.validation");
const router = (0, express_1.Router)();
router.post('/', auth_1.jwtAuth, (0, validate_1.validate)(claims_validation_1.createClaimValidation), claims_controller_1.createClaim);
router.get('/me', auth_1.jwtAuth, (0, validate_1.validate)(claims_validation_1.paginationValidation), claims_controller_1.listUserClaims);
exports.default = router;
//# sourceMappingURL=claims.routes.js.map