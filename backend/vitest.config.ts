import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    // Integration tests share one real Postgres DB and truncate it between
    // tests — must run serially or concurrent files stomp on each other's data.
    fileParallelism: false,
    // Injected before any module loads, avoiding dotenv/import-order pitfalls.
    // DATABASE_URL is overridable so CI can point at its own postgres service.
    env: {
      DATABASE_URL: process.env.DATABASE_URL ?? 'postgresql://bsm:devpass@localhost:5434/bsm_test',
      JWT_SECRET: 'test-secret',
      ADMIN_USERNAME: 'admin',
      // bcrypt hash of "admin123", test-only
      ADMIN_PASSWORD_HASH: '$2a$10$EG.0SdCIs4jzimHKPm5X8eKbgRNinDIxk3BXlKIM/21cmk2971cbe',
      EMAILJS_SERVICE_ID: 'service_test',
      EMAILJS_PUBLIC_KEY: 'test_public_key',
      EMAILJS_PRIVATE_KEY: 'test_private_key',
      EMAILJS_TEMPLATE_ID_CONTACT: 'template_contact_test',
      CORS_ORIGINS: '',
      PORT: '3000',
      MINIO_ENDPOINT: 'localhost',
      MINIO_PORT: '9000',
      MINIO_USE_SSL: 'false',
      MINIO_ROOT_USER: 'test',
      MINIO_ROOT_PASSWORD: 'testtesttest',
      MINIO_BUCKET: 'bsm-media-test',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/index.ts', 'src/prisma.ts', 'src/mailer.ts', 'src/minio.ts', 'src/**/*.d.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})
