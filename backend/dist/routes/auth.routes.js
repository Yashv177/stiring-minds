"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validate_1 = require("../middleware/validate");
const auth_validation_1 = require("../validations/auth.validation");
const router = (0, express_1.Router)();
router.post('/register', (0, validate_1.validate)(auth_validation_1.registerValidation), auth_controller_1.register);
router.post('/login', (0, validate_1.validate)(auth_validation_1.loginValidation), auth_controller_1.login);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map