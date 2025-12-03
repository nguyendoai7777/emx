import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@emx/orm';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaClientService extends PrismaClient {
  constructor() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
    super({ adapter });
  }
}
