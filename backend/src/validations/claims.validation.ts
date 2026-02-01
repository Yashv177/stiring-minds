import Joi from 'joi';

export const createClaimValidation = Joi.object({
  dealId: Joi.string().hex().length(24).required(), // MongoDB ObjectId format
  metadata: Joi.object().optional().default({}),
});

export const paginationValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid('pending', 'approved', 'rejected', 'redeemed').optional(),
});

