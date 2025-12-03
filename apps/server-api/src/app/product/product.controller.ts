import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { DtoProduct, DtoSearchProduct } from '@emx/dto';
import { AllowRole, PublicRoute, TransformParams, User } from '@decorators';
import type { UserJWT } from '@emx/types';
import { ResponseFactory, ResponsePaginationFactory } from '@emx/core';
import { Role } from '@emx/orm';
import { RedisKey, SuccessMessage } from '@constants';
import { RedisService } from '@services';
import { MsgPackInterceptor } from '@interceptors';

@Controller('product')
export class ProductController {
  constructor(
    private readonly $$: ProductService,
    private readonly redis: RedisService
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @AllowRole(Role.ADMIN)
  async create(@Body() body: DtoProduct, @User() user: UserJWT) {
    const data = await this.$$.create(body);
    return new ResponseFactory({
      message: SuccessMessage.Created,
      status: HttpStatus.OK,
      data: data,
    });
  }

  @Post('m')
  @UseInterceptors(MsgPackInterceptor)
  @AllowRole(Role.ADMIN)
  async create2(@Body() payload: any) {
    console.log('Unpacked data:', payload);

    // Trả về data, sẽ tự động được pack nếu client accept msgpack
    return {
      message: 'Success',
      data: payload,
      products: [
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 },
      ],
    };
  }

  @Get()
  @PublicRoute()
  async getList(@Query(TransformParams()) query: DtoSearchProduct) {
    const cacheKey = `${RedisKey.categoryList}:${JSON.stringify(query)}`;
    const cacheTtlSeconds = 30;
    const res = await this.redis.executeExclusive(
      cacheKey,
      async () => {
        return await this.$$.getListWithPaginate(query);
      },
      cacheTtlSeconds
    );
    return new ResponsePaginationFactory({
      message: SuccessMessage.Ok,
      status: HttpStatus.OK,
      ...res,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.$$.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: DtoProduct) {
    return this.$$.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.$$.remove(+id);
  }
}
