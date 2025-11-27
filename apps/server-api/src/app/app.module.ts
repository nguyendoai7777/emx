import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsoleModule } from './console/console.module';
import { PrismaClientModule } from '@prisma-provider';
import { join } from 'node:path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { ShopModule } from './shop/shop.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../shared/guards/auth.guard';
import { RedisModule } from '@services';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AppController],
  providers: [AppService, { name: APP_GUARD, provide: APP_GUARD, useClass: AuthGuard }],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../public'),
    }),
    PrismaClientModule,
    ConsoleModule,
    RedisModule,
    AuthModule,
    ProductModule,
    ShopModule,
  ],
})
export class AppModule {}
