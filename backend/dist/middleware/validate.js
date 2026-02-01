"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // Return all errors, not just first
            stripUnknown: true, // Remove unknown properties
        });
        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));
            res.status(400).json({
                error: 'Validation failed',
                details: errors,
            });
            return;
        }
        req.body = value; // Use sanitized value
        next();
    };
}
//# sourceMappingURL=validate.js.map