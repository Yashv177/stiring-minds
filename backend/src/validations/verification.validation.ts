import Joi from 'joi';

// No specific validation needed for these endpoints as they use JWT auth
// All necessary validation is done by the jwtAuth middleware
export const verificationStatusValidation = Joi.object({});

