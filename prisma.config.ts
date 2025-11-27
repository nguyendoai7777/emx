import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'apps/server-api/src/prisma/schema.prisma',
  migrations: {
    path: 'apps/server-api/src/prisma/migrations',
    seed: 'apps/server-api/src/prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
