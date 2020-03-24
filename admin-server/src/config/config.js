const Joi = require('joi');

// Get ".env" path
const envPath = {
  development: './.env.development',
  uat: './.env.uat',
  staging: './.env.staging',
  production: './.env',
}[process.env.ENV || 'development'];
// Require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config({ path: envPath });

// Define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'uat', 'staging', 'production'])
    .default('development'),
  PORT: Joi.number().default(5050),
  JWT_SECRET: Joi.string()
    .required()
    .description('JWT Secret required to sign'),
  ACCESS_TOKEN_EXPIRATION_MINUTES: Joi.number().default(525600),
  REFRESH_TOKEN_EXPIRATION_MINUTES: Joi.number().default(525600),
  MONGO_URI: Joi.string()
    .required()
    .description('MongoDB URI'),
  FACEBOOK_APP_ID: Joi.string()
    .required()
    .description('Facebook App ID'),
  FACEBOOK_APP_SECRET: Joi.string()
    .required()
    .description('Facebook App Secret'),
  FACEBOOK_ACCOUNT_KIT_APP_SECRET: Joi.string()
    .required()
    .description('Facebook Account Kit App Secret'),
  AWS_ACCESS_KEY_ID: Joi.string()
    .required()
    .description('AWS access key ID'),
  AWS_SECRET_KEY: Joi.string()
    .required()
    .description('AWS secret access key'),
  AWS_REGION: Joi.string()
    .required()
    .description('AWS region'),
  MAILJET_APIKEY_PRIVATE: Joi.string().required(),
  MAILJET_APIKEY_PUBLIC: Joi.string().required(),
})
  .unknown()
  .required();
const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwtSecret: envVars.JWT_SECRET,
  accessTokenExpiry: envVars.ACCESS_TOKEN_EXPIRATION_MINUTES,
  refreshTokenExpiry: envVars.REFRESH_TOKEN_EXPIRATION_MINUTES,
  mongoUri: envVars.MONGO_URI,
  facebookAppId: envVars.FACEBOOK_APP_ID,
  facebookAppSecret: envVars.FACEBOOK_APP_SECRET,
  facebookAccountKitAppSecret: envVars.FACEBOOK_ACCOUNT_KIT_APP_SECRET,
  awsKeyId: envVars.AWS_ACCESS_KEY_ID,
  awsSecretKey: envVars.AWS_SECRET_KEY,
  awsRegion: envVars.AWS_REGION,
  mailjetKeyPrivate: envVars.MAILJET_APIKEY_PRIVATE,
  mailjetKeyPublic: envVars.MAILJET_APIKEY_PUBLIC,
};
