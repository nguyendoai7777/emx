import { DtoPagination } from '@emx/dto';
import { PaginationMeta } from '@emx/types';

export interface ExecutingPageOption {
  take: number;
  skip: number;
  pageNumber: number;
}
export interface PaginatedResponse<D> {
  data: D;
  pagination: PaginationMeta;
}

interface QueryResult<D> {
  data: D;
  total: number;
}

export const paginator = async <D>(
  pageParam: DtoPagination,
  queryFn: (pageOption: ExecutingPageOption) => Promise<QueryResult<D>>
): Promise<PaginatedResponse<D>> => {
  const { size = 20, page = 1 } = pageParam;
  const take = Math.max(1, Number(size) || 20);
  const pageNumber = Math.max(1, Number(page) || 1);
  const skip = (pageNumber - 1) * take;
  const { data, total } = await queryFn({ pageNumber, skip, take });
  const totalPages = Math.max(1, Math.ceil(total / take));
  const pagination: PaginationMeta = {
    total,
    page: pageNumber,
    size: take,
    totalPages,
    hasNext: pageNumber < totalPages,
    hasPrev: pageNumber > 1,
  };

  return { data, pagination };
};
