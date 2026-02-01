import Joi from 'joi';

export const createDealValidation = Joi.object({
  title: Joi.string().min(3).max(200).required().trim(),
  description: Joi.string().min(10).max(5000).required(),
  provider: Joi.string().min(2).max(100).required().trim(),
  isLocked: Joi.boolean().default(false),
  isHumanity: Joi.boolean().default(false),
  termsUrl: Joi.string().uri().optional().allow('', null),
  tags: Joi.array().items(Joi.string().trim()).optional().default([]),
  expiresAt: Joi.date().optional().allow(null),
});

export const getDealValidation = Joi.object({
  id: Joi.string().hex().length(24).required(), // MongoDB ObjectId format
});

export const listDealsValidation = Joi.object({
  q: Joi.string().trim().max(100).optional(),
  tags: Joi.string().trim().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

