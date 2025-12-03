import { Injectable } from '@nestjs/common';
import { PrismaClientService } from '@prisma-client';
import { DtoCategory, DtoPagination } from '@emx/dto';
import { paginator } from '@utils';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaClientService) {}

  create(body: DtoCategory) {
    return this.prisma.category.create({
      data: body,
    });
  }

  deleteMany(id: string) {
    const ids = id.split(',').map(Number);
    return this.prisma.category.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  getListWithPaginate(options: DtoPagination) {
    const { size, page, search } = options;

    return paginator(options, async () => {
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
      const [data, total] = await this.prisma.$transaction([
        this.prisma.category.findMany({
          take: size,
          skip: (page - 1) * size,
          where: {
            OR: searchCol,
          },
        }),
        this.prisma.category.count(),
      ]);
      return { data, total };
    });
  }
}
