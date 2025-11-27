import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../client';

@Injectable()
export class PrismaClientService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    // console.log(`@@ PrismaClient connected`);
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
