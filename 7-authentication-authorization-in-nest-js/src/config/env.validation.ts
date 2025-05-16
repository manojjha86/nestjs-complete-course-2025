import * as Joi from 'joi';

export default Joi.object({
    NODE_ENV: Joi.string()
                 .valid('development', 'test', 'production')
                 .default('development'),
    DB_PORT: Joi.number().port().default(5432),
    DB_PASSWORD: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    JWT_TOKEN_SECRET: Joi.string().required(),
    JWT_TOKEN_EXPIRESIN: Joi.number().required(),
    REFRESH_TOKEN_EXPIRESIN: Joi.number().required(),
    JWT_TOKEN_AUDIENCE: Joi.string().required(),
    JWT_TOKEN_ISSUER: Joi.string().required(),
})