import { computed } from '@angular/core';
import { NgPageItem, UsePaginatorProps } from './ng-paginator.types';

export const usePaginator = (input: UsePaginatorProps) => {
  const totalPages = computed(() => {
    const total = input.totalRecords();
    const pageSize = input.size();
    return pageSize <= 0 ? 1 : Math.ceil(total / pageSize);
  });

  const pages = computed<NgPageItem[]>(() => {
    const total = totalPages();
    const current = input.page();
    const numericCount = 7;
    const result: NgPageItem[] = [];
    const first = 1;
    const last = total;
    const sideCount = 2;
    let start: number;
    let end: number;
    if (total <= numericCount) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= sideCount + 1) {
      start = 1;
      end = numericCount - 1;
    } else if (current >= total - sideCount) {
      start = total - numericCount + 2;
      end = total;
    } else {
      start = current - sideCount;
      end = current + sideCount;
    }
    start = Math.max(1, start);
    end = Math.min(total, end);
    if (start > 1) {
      result.push(first);
      if (start - first > 2) {
        result.push('...');
      } else {
        for (let p = first + 1; p < start; p++) {
          result.push(p);
        }
      }
      for (let p = start; p <= end; p++) {
        result.push(p);
      }
    } else {
      for (let p = start; p <= end; p++) {
        result.push(p);
      }
    }
    if (end < total) {
      if (last - end > 2) {
        result.push('...');
      } else {
        for (let p = end + 1; p < last; p++) {
          result.push(p);
        }
      }
      result.push(last);
    }
    return result;
  });

  function goToPage(p: NgPageItem) {
    if (p === '...') return;
    if (p >= 0 && p <= totalPages()) {
      input.page.set(p);
    }
  }

  return {
    totalPages,
    pages,
    goToPage,
  };
};
