import { Injectable } from '@nestjs/common';
import { DtoProduct, DtoSearchProduct } from '@emx/dto';
import { PrismaClientService } from '@prisma-client';
import { paginator } from '@utils';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaClientService) {}
  create(data: DtoProduct) {
    return this.prisma.product.create({
      data,
    });
  }

  async getListWithPaginate(options: DtoSearchProduct) {
    const { search, discountPercent, categoryId } = options;
    return paginator(options, async ({ take, skip }) => {
      const whereConditions: any = {};
      const key = <K extends keyof typeof this.prisma.product.fields>(key: K) => {
        return this.prisma.product.fields[key].name;
      };

      // Khởi tạo điều kiện tìm kiếm/lọc
      const searchCol = [
        { [key('brand')]: { contains: search } },
        { [key('name')]: { contains: search } },
        { [key('title')]: { contains: search } },
      ];

      if (discountPercent) {
        whereConditions.discountPercent = { gte: discountPercent };
      }
      if (categoryId) {
        whereConditions.categoryId = categoryId;
      }
      // Gán OR conditions sau cùng
      whereConditions.OR = searchCol;

      // Thực hiện truy vấn (Phần này là trách nhiệm của queryFn)
      const [data, total] = await this.prisma.$transaction([
        this.prisma.product.findMany({
          take, // Lấy từ tham số của queryFn
          skip, // Lấy từ tham số của queryFn
          where: whereConditions,
          include: {
            category: { select: { id: true, label: true, value: true } },
            images: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.product.count({ where: whereConditions }),
      ]);

      // Trả về data và total cho hàm paginator xử lý metadata
      return { data, total };
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: DtoProduct) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
