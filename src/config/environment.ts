type AppEnvironment = 'local' | 'ci' | 'staging' | 'production';

export const APP_ENV: AppEnvironment = process.env.APP_ENV as AppEnvironment;
export const NODE_ENV = process.env.NODE_ENV;
export const PORT = Number(process.env.PORT);

export const BACKEND_HOST = process.env.BACKEND_HOST;
export const WEB_BASE_URL = process.env.WEB_BASE_URL;

export const ADMIN_PHONE_NUMBER = process.env.ADMIN_PHONE_NUMBER;
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export const POSTGRES_HOST = process.env.POSTGRES_HOST;
export const POSTGRES_PORT = Number(process.env.POSTGRES_PORT);
export const POSTGRES_DB = process.env.POSTGRES_DB;
export const POSTGRES_USER = process.env.POSTGRES_USER;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION;
export const JWT_OTP_EXPIRATION = process.env.JWT_OTP_EXPIRATION;

export const S3_ENDPOINT = process.env.S3_ENDPOINT;
export const S3_BUCKET = process.env.S3_BUCKET;
export const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
export const S3_SECRET_KEY = process.env.S3_SECRET_KEY;

export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = Number(process.env.REDIS_PORT);
export const REDIS_PREFIX = process.env.REDIS_PREFIX;

export const EMAIL_QUEUE = process.env.EMAIL_QUEUE;
export const SMS_QUEUE = process.env.SMS_QUEUE;
export const TELEGRAM_QUEUE = process.env.TELEGRAM_QUEUE;
export const PUSH_QUEUE = process.env.PUSH_QUEUE;
export const WEB_PUSH_QUEUE = process.env.WEB_PUSH_QUEUE;
export const PAYMENT_QUEUE = process.env.PAYMENT_QUEUE;

export const SMTP_CONNECTION_URL = process.env.SMTP_CONNECTION_URL;

export const TELEGRAM_EXAMPLE_APP_DEV_BOT_TOKEN = process.env.TELEGRAM_EXAMPLE_APP_DEV_BOT_TOKEN;
export const TELEGRAM_EXAMPLE_APP_DEV_CHAT_ID = process.env.TELEGRAM_EXAMPLE_APP_DEV_CHAT_ID;

export const METABASE_SITE_URL = process.env.METABASE_SITE_URL;
export const METABASE_SECRET_KEY = process.env.METABASE_SECRET_KEY;
