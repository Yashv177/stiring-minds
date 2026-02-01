import Joi from 'joi';

export const registerValidation = Joi.object({
  name: Joi.string().min(2).max(50).required().trim(),
  email: Joi.string().email().required().lowercase(),
  password: Joi.string().min(8).max(128).required(),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required().lowercase(),
  password: Joi.string().required(),
});

