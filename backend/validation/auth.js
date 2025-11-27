import Joi from 'joi';

export const signupSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const socialLoginSchema = Joi.object({
  idToken: Joi.string().required(),
  email: Joi.string().email().required(),
  name: Joi.string().optional(),
  photoURL: Joi.string().uri().optional().allow(''),
});
