import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DtoCategory, DtoCategoryDeleteQuery, DtoPagination } from '@emx/dto';
import { CategoryService } from './category.service';
import { c, ResponseFactory, ResponsePaginationFactory } from '@emx/core';
import { TransformParams } from '@decorators';
import { RedisKey, SuccessMessage } from '@constants';
import { RedisService } from '@services';

@Controller('category')
@ApiTags('Console')
export class CategoryController {
  constructor(
    protected readonly category$$: CategoryService,
    private readonly redis: RedisService
  ) {}
  @Get('ping')
  ping() {
    return 'pong';
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: DtoCategory) {
    const data = await this.category$$.create(body);

    // Clear all cached category list entries so next list call fetches fresh data
    try {
      await this.redis.delByPrefix(RedisKey.categoryList);
      console.log(c.green`Cleared Redis keys for prefix ${RedisKey.categoryList}`);
    } catch (err) {
      console.log(c.red`Failed to clear category list cache`, err as any);
    }

    return new ResponseFactory({
      data,
      status: HttpStatus.OK,
      message: 'Tạo ok',
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getListByPaginate(@Query(TransformParams()) pagination: DtoPagination) {
    const cacheKey = `${RedisKey.categoryList}:${JSON.stringify(pagination)}`;
    const cacheTtlSeconds = 30;

    const res = await this.redis.executeExclusive(
      cacheKey,
      async () => {
        return await this.category$$.getListWithPaginate(pagination);
      },
      cacheTtlSeconds
    );

    return new ResponsePaginationFactory<DtoCategory[]>({
      status: HttpStatus.OK,
      message: SuccessMessage.Ok,
      ...res,
    });
  }

  @Delete()
  async deleteMany(@Query(TransformParams()) query: DtoCategoryDeleteQuery) {
    await this.category$$.deleteMany(query.id);
    return new ResponseFactory({
      status: HttpStatus.OK,
      message: SuccessMessage.Deleted,
    });
  }
}
