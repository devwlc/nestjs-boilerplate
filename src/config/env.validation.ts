import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('30m'),
  JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),
  THROTTLE_TTL: Joi.number().default(60000),
  THROTTLE_LIMIT: Joi.number().default(20),
});
