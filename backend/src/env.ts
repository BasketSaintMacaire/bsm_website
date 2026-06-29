import 'dotenv/config'

function required(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export const env = {
  PORT: Number(process.env.PORT ?? 3000),
  DATABASE_URL: required('DATABASE_URL'),
  JWT_SECRET: required('JWT_SECRET'),
  ADMIN_USERNAME: required('ADMIN_USERNAME'),
  ADMIN_PASSWORD_HASH: required('ADMIN_PASSWORD_HASH'),
  EMAILJS_SERVICE_ID: required('EMAILJS_SERVICE_ID'),
  EMAILJS_PUBLIC_KEY: required('EMAILJS_PUBLIC_KEY'),
  EMAILJS_PRIVATE_KEY: required('EMAILJS_PRIVATE_KEY'),
  EMAILJS_TEMPLATE_ID_CONTACT: required('EMAILJS_TEMPLATE_ID_CONTACT'),
  CORS_ORIGINS: (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT ?? 'localhost',
  MINIO_PORT: Number(process.env.MINIO_PORT ?? 9000),
  MINIO_USE_SSL: process.env.MINIO_USE_SSL === 'true',
  MINIO_ROOT_USER: required('MINIO_ROOT_USER'),
  MINIO_ROOT_PASSWORD: required('MINIO_ROOT_PASSWORD'),
  MINIO_BUCKET: process.env.MINIO_BUCKET ?? 'bsm-media',
}
