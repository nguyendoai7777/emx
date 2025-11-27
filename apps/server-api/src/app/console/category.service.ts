import { Injectable } from '@nestjs/common';
import { PrismaClientService } from '@prisma-provider';
import { DtoCategory, DtoPagination } from '@emx/dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaClientService) {}

  create(body: DtoCategory) {
    return this.prisma.category.create({
      data: body,
    });
  }

  getListWithPaginate(options: DtoPagination) {
    const { size, page, search } = options;

    const key = <K extends keyof typeof this.prisma.category.fields>(key: K) => {
      return this.prisma.category.fields[key].name;
    };

    const searchCol = [
      {
        [key('value')]: { contains: search },
      },
      {
        [key('label')]: { contains: search },
      },
    ];
    return this.prisma.$transaction([
      this.prisma.category.findMany({
        take: size,
        skip: (page - 1) * size,
        where: {
          OR: searchCol,
        },
      }),
      this.prisma.category.count(),
    ]);
  }
}
