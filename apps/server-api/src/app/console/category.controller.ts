import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DtoCategory, DtoCategoryDeleteQuery, DtoPagination } from '@emx/dto';
import { CategoryService } from './category.service';
import { ResponseFactory, ResponsePaginationFactory } from '@emx/core';
import { TransformParams } from '@decorators';
import { SuccessMessage } from '@constants';

@Controller('category')
@ApiTags('Console')
export class CategoryController {
  constructor(protected readonly category$$: CategoryService) {}
  @Get('ping')
  ping() {
    return 'pong';
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: DtoCategory) {
    const data = await this.category$$.create(body);
    return new ResponseFactory({
      data,
      status: HttpStatus.OK,
      message: 'Tạo ok',
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getListByPaginate(@Query(TransformParams()) pagination: DtoPagination) {
    const [data, total] = await this.category$$.getListWithPaginate(pagination);
    return new ResponsePaginationFactory<DtoCategory[]>({
      status: HttpStatus.OK,
      message: 'Success',
      data,
      pagination: {
        total,
      },
    });
  }

  @Delete()
  async deleteMany(@Query(TransformParams()) query: DtoCategoryDeleteQuery) {
    await this.category$$.deleteMany(query.id);
    return new ResponseFactory({
      status: HttpStatus.OK,
      message: SuccessMessage.Delete,
    });
  }
}
