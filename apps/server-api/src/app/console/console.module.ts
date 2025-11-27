import { Module } from '@nestjs/common';
import { ConsoleService } from './console.service';
import { ConsoleController } from './console.controller';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  controllers: [ConsoleController, CategoryController],
  providers: [ConsoleService, CategoryService],
})
export class ConsoleModule {}
