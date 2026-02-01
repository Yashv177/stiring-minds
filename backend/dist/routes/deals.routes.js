"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deals_controller_1 = require("../controllers/deals.controller");
const validate_1 = require("../middleware/validate");
const deals_validation_1 = require("../validations/deals.validation");
const router = (0, express_1.Router)();
router.get('/', (0, validate_1.validate)(deals_validation_1.listDealsValidation), deals_controller_1.listDeals);
router.get('/:id', (0, validate_1.validate)(deals_validation_1.getDealValidation), deals_controller_1.getDeal);
exports.default = router;
//# sourceMappingURL=deals.routes.js.map