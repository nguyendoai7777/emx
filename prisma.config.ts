import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'packages/orm/src/schema.prisma',
  migrations: {
    path: 'packages/orm/src/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
